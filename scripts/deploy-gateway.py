"""Run on the gateway: python3 deploy-gateway.py /path/to/site.tar.gz release-id.

Uses the gateway's existing 1Panel API and wildcard certificate. Credentials stay
on the gateway. Site releases and previous index directories are retained.
"""
import hashlib
import json
import os
from pathlib import Path
import re
import sqlite3
import subprocess
import sys
import tarfile
import time
import urllib.request

DOMAIN = 'ui.five-plus-one.com'
ALIAS = 'ui.five-plus-one.com'
archive = Path(sys.argv[1]).resolve()
release_id = sys.argv[2]
if not re.fullmatch(r'[a-zA-Z0-9][a-zA-Z0-9._-]*', release_id):
    raise ValueError('Invalid release ID')
settings_db = sqlite3.connect('file:/opt/1panel/db/core.db?mode=ro', uri=True)
settings = dict(settings_db.execute('select key,value from settings'))
def api(path, body):
    timestamp = str(int(time.time()))
    token = hashlib.md5(('1panel' + settings['ApiKey'] + timestamp).encode()).hexdigest()
    request = urllib.request.Request('http://127.0.0.1:' + settings['ServerPort'] + '/api/v2/' + path,
        data=json.dumps(body).encode(), headers={'1Panel-Token': token, '1Panel-Timestamp': timestamp,
        'Content-Type': 'application/json', '1Panel-Node': 'local'})
    result = json.loads(urllib.request.urlopen(request, timeout=60).read())
    if result.get('code') != 200:
        raise RuntimeError(result.get('message', '1Panel request failed'))
    return result.get('data')

agent_db = sqlite3.connect('file:/opt/1panel/db/agent.db?mode=ro', uri=True)
existing = agent_db.execute('select id,primary_domain from websites where alias=?', (ALIAS,)).fetchone()
certificate = agent_db.execute('select id,domains from website_ssls where id=2').fetchone()
if not certificate or '*.five-plus-one.com' not in certificate[1].split(','):
    raise RuntimeError('Expected gateway wildcard certificate')
if existing and existing[1] != DOMAIN:
    raise RuntimeError('Site alias belongs to another domain')
if not existing:
    api('websites', {'type': 'static', 'alias': ALIAS, 'remark': '五加一设计系统', 'webSiteGroupID': 1,
        'domains': [{'domain': DOMAIN, 'port': 80, 'ssl': False}], 'appType': 'installed',
        'enableSSL': True, 'websiteSSLID': certificate[0]})
    existing = agent_db.execute('select id,primary_domain from websites where alias=?', (ALIAS,)).fetchone()
if not existing:
    raise RuntimeError('Website registration failed')
api('websites/' + str(existing[0]) + '/https', {'websiteId': existing[0], 'enable': True,
    'websiteSSLId': certificate[0], 'type': 'existed', 'httpConfig': 'HTTPToHTTPS',
    'SSLProtocol': ['TLSv1.3', 'TLSv1.2'], 'algorithm': '', 'httpsPorts': [443], 'http3': False})

site = Path('/opt/1panel/www/sites') / ALIAS
release = site / 'releases' / release_id
release.mkdir(parents=True, exist_ok=False)
with tarfile.open(archive) as package:
    for member in package.getmembers():
        target = (release / member.name).resolve()
        if not target.is_relative_to(release.resolve()) or not (member.isfile() or member.isdir()):
            raise ValueError('Invalid archive member')
    package.extractall(release)
if not (release / 'index.html').is_file():
    raise RuntimeError('Missing index.html')
index = site / 'index'
previous = os.readlink(index) if index.is_symlink() else None
backup = site / ('index.before-' + release_id)
temporary = site / ('index.next-' + release_id)
container = subprocess.check_output(['docker', 'ps', '--filter', 'name=openresty', '--format', '{{.Names}}'], text=True).strip().splitlines()
if len(container) != 1:
    raise RuntimeError('Expected one OpenResty container')
if index.exists() and not index.is_symlink():
    index.rename(backup)
temporary.symlink_to('releases/' + release_id, target_is_directory=True)
os.replace(temporary, index)
try:
    subprocess.run(['docker', 'exec', container[0], 'nginx', '-t'], check=True)
    subprocess.run(['docker', 'exec', container[0], 'nginx', '-s', 'reload'], check=True)
except Exception:
    index.unlink()
    if previous:
        index.symlink_to(previous, target_is_directory=True)
    elif backup.exists():
        backup.rename(index)
    raise
print(json.dumps({'domain': DOMAIN, 'websiteId': existing[0], 'release': release_id,
    'archiveSha256': hashlib.sha256(archive.read_bytes()).hexdigest()}, ensure_ascii=False))
