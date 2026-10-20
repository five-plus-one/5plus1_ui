#!/bin/bash
# Read-only integration preflight. Component integration follows the migration guide.
set -eu
TARGET="${1:?Usage: bash scripts/migrate-kezhan.sh /path/to/KeZhan-notebook}"
cd "$TARGET"
test -f frontend/main.tsx || { echo "Expected frontend/main.tsx"; exit 1; }
echo "KeZhan frontend located. Review docs/kezhan-migration-guide.md before integration."
git status --short
