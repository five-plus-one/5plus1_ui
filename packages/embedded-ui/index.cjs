/* @fiveplusone/embedded-ui — DOM controls for embedded applications. */
const FivePlusOneEmbeddedUI = (() => {
    const MENU = '.fp-embedded-toolbar-menu';
    const FONT = '-apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft YaHei",sans-serif';
    function installBoundary(doc, roots) {
        const selector = [...roots, MENU, '.fp-embedded-tooltip'].join(',');
        let style = doc.getElementById('fp-embedded-ui-styles');
        if (!style) { style = doc.createElement('style'); style.id = 'fp-embedded-ui-styles'; (doc.head || doc.documentElement).append(style); }
        // Scope proximity beats equally specific host defaults, while component classes and
        // inline values keep ownership of their own dimensions, typography and appearance.
        style.textContent = `
@scope (${selector}) {
 button { all:revert; box-sizing:border-box; font:inherit; line-height:normal; cursor:pointer; width:auto; min-width:0; max-width:none; margin:0; padding:0; text-transform:none; letter-spacing:normal; }
 input,select,textarea { all:revert; box-sizing:border-box; font:inherit; color:inherit; line-height:normal; max-width:100%; }
 button:disabled { cursor:default; }
 [hidden] { display:none !important; }
 @media (pointer:coarse) { button { min-width:44px !important; min-height:44px !important; } }
}
.fp-embedded-toolbar { display:flex;align-items:center;min-width:0;flex-wrap:nowrap; }
@media (pointer:coarse) { .fp-embedded-toolbar button:not(.fp-embedded-more)::after { content:attr(aria-label);font-size:13px;margin-left:6px; } }
.fp-embedded-more { display:inline-flex;align-items:center;justify-content:center;flex:none;min-height:28px;white-space:nowrap; }
.fp-embedded-toolbar-menu { position:fixed;z-index:2147483647;display:flex;flex-direction:column;gap:4px;min-width:168px;max-width:calc(100vw - 16px);max-height:calc(100vh - 16px);overflow:auto;padding:6px;border:1px solid var(--fp-line,#dce1e8);border-radius:8px;background:var(--fp-surface,#fff);color:var(--fp-ink,#172033);box-shadow:0 8px 28px #17203326;font:13px/1.5 ${FONT}; }
.fp-embedded-toolbar-menu[hidden],.fp-embedded-tooltip[hidden] { display:none !important; }
.fp-embedded-toolbar-menu button { display:flex;align-items:center;width:100%;min-width:0 !important;min-height:36px;padding:6px 12px;border:0;border-radius:6px;background:transparent;color:inherit;font-size:0;text-align:left;white-space:normal; }
.fp-embedded-toolbar-menu button > * { display:none; }
.fp-embedded-toolbar-menu button::after { content:attr(data-fp-menu-label);font:13px/1.5 ${FONT};white-space:normal;overflow-wrap:anywhere; }
.fp-embedded-toolbar-menu button:hover,.fp-embedded-toolbar-menu button:focus-visible { background:var(--fp-surface-muted,#f1f4f7);outline:2px solid var(--fp-primary,#13795b);outline-offset:-2px; }
.fp-embedded-toolbar-menu [role=separator] { display:none; }
.fp-embedded-tooltip { position:fixed;z-index:2147483647;pointer-events:none;width:max-content;max-width:calc(100vw - 16px);padding:6px 10px;border-radius:6px;background:var(--fp-ink,#172033);color:var(--fp-bg,#fff);font:13px/1.5 ${FONT};white-space:normal;box-shadow:0 4px 14px #0002; }
`;
        return style;
    }
    function copyTheme(from, to) {
        const styles = from.ownerDocument.defaultView.getComputedStyle(from);
        for (const key of ['--fp-ink','--fp-bg','--fp-surface','--fp-surface-muted','--fp-line','--fp-primary']) {
            const value = styles.getPropertyValue(key); if (value.trim()) to.style.setProperty(key, value); else to.style.removeProperty(key);
        }
    }
    function position(anchor, popup) {
        const view = anchor.ownerDocument.defaultView, a = anchor.getBoundingClientRect(), p = popup.getBoundingClientRect();
        popup.style.left = Math.max(8, Math.min(a.left, view.innerWidth - p.width - 8)) + 'px';
        popup.style.top = Math.max(8, Math.min(a.bottom + 6 + p.height <= view.innerHeight - 8 ? a.bottom + 6 : a.top - p.height - 6, view.innerHeight - p.height - 8)) + 'px';
    }
    function installTooltips(doc, roots) {
        const rootSelector = [...roots, MENU].join(','), tip = doc.createElement('div');
        tip.className = 'fp-embedded-tooltip'; tip.hidden = true; tip.setAttribute('role','tooltip');
        tip.id = 'fp-embedded-tooltip'; (doc.body || doc.documentElement).append(tip);
        let active = null, previousDescription = null;
        const ours = el => el?.closest?.(rootSelector);
        function label(el) {
            const native = el.getAttribute('title');
            if (native) {
                el.setAttribute('data-fp-tooltip',native); el.removeAttribute('title');
                if (!el.getAttribute('aria-label')) el.setAttribute('aria-label',native);
            }
            return el.getAttribute('data-fp-tooltip') || el.getAttribute('aria-label');
        }
        function hide() {
            tip.hidden = true;
            if (active) {
                if (previousDescription === null) active.removeAttribute('aria-describedby');
                else active.setAttribute('aria-describedby',previousDescription);
            }
            active = null; previousDescription = null;
        }
        function show(event) {
            if (event.pointerType === 'touch') return;
            const el = event.target.closest?.('button,[data-fp-tooltip]');
            if (!el || !ours(el) || el.closest(MENU) || el.contains(event.relatedTarget)) return;
            const text = label(el); if (!text) return;
            hide(); active = el; previousDescription = el.getAttribute('aria-describedby');
            el.setAttribute('aria-describedby',[previousDescription,tip.id].filter(Boolean).join(' '));
            (doc.body || doc.documentElement).append(tip);
            tip.textContent = text; copyTheme(el,tip); tip.hidden = false; position(el,tip);
        }
        function leave(event) { if (active && active.contains(event.target) && !active.contains(event.relatedTarget)) hide(); }
        function key(event) { if (event.key === 'Escape') hide(); }
        function migrate(node) {
            if (node.nodeType !== 1) return;
            for (const el of [node,...node.querySelectorAll('button[title],[data-fp-tooltip][title]')]) {
                if (ours(el) && el.hasAttribute('title') && el.matches('button,[data-fp-tooltip]')) label(el);
            }
        }
        migrate(doc.documentElement);
        const observer = new doc.defaultView.MutationObserver(records => {
            for (const record of records) for (const node of record.addedNodes) migrate(node);
            if (active && !active.isConnected) hide();
        });
        observer.observe(doc.documentElement,{childList:true,subtree:true});
        const bindings = [['pointerover',show],['focusin',show],['pointerout',leave],['focusout',leave],['click',hide],['scroll',hide],['keydown',key]];
        for (const [event,handler] of bindings) doc.addEventListener(event,handler,true);
        doc.defaultView.addEventListener('resize',hide);
        return () => { hide(); observer.disconnect(); tip.remove(); for (const [event,handler] of bindings) doc.removeEventListener(event,handler,true); doc.defaultView.removeEventListener('resize',hide); };
    }
    function enhanceToolbar(bar, options = {}) {
        const doc = bar.ownerDocument, view = doc.defaultView;
        const original = [...bar.children], more = doc.createElement('button'), menu = doc.createElement('div');
        for (const button of bar.querySelectorAll('button')) {
            const label = button.getAttribute('data-fp-tooltip') || button.getAttribute('title');
            if (label && !button.hasAttribute('aria-label')) button.setAttribute('aria-label',label);
        }
        more.type = 'button'; more.className = 'fp-embedded-more'; more.textContent = '更多';
        more.setAttribute('aria-haspopup','menu'); more.setAttribute('aria-expanded','false');
        more.setAttribute('aria-label','更多编辑操作');
        menu.className = 'fp-embedded-toolbar-menu'; menu.hidden = true; menu.setAttribute('role','menu');
        bar.classList.add('fp-embedded-toolbar'); bar.append(more); (doc.body || doc.documentElement).append(menu);
        let destroyed = false;
        const buttons = () => [...menu.querySelectorAll('button:not(:disabled)')];
        const oldRoles = new Map();
        function close(focus = false) { menu.hidden = true; more.setAttribute('aria-expanded','false'); if (focus) more.focus(); }
        function open() { (doc.body || doc.documentElement).append(menu); copyTheme(bar,menu); menu.hidden = false; more.setAttribute('aria-expanded','true'); position(more,menu); }
        function restore() {
            for (const el of original) {
                bar.insertBefore(el,more); el.hidden = false;
                for (const button of el.matches('button') ? [el] : el.querySelectorAll('button')) {
                    if (oldRoles.has(button)) { const role = oldRoles.get(button); role === null ? button.removeAttribute('role') : button.setAttribute('role',role); }
                    button.removeAttribute('data-fp-menu-label');
                }
            }
        }
        function layout() {
            if (destroyed || !bar.isConnected) return;
            close(); restore(); more.hidden = false;
            const css = view.getComputedStyle(bar), gap = parseFloat(css.columnGap) || 0;
            const available = bar.clientWidth - (parseFloat(css.paddingLeft)||0) - (parseFloat(css.paddingRight)||0);
            const width = el => { const s = view.getComputedStyle(el); return el.getBoundingClientRect().width + (parseFloat(s.marginLeft)||0) + (parseFloat(s.marginRight)||0); };
            const widths = original.map(width), total = widths.reduce((a,b)=>a+b,0) + Math.max(0,original.length-1)*gap;
            if (total <= available + 0.5) { more.hidden = true; return; }
            let used = width(more), overflow = false;
            original.forEach((el,i) => {
                if (!overflow && used + widths[i] + gap <= available + 0.5) used += widths[i] + gap;
                else {
                    overflow = true; menu.append(el);
                    for (const button of el.matches('button') ? [el] : el.querySelectorAll('button')) {
                        if (!oldRoles.has(button)) oldRoles.set(button,button.getAttribute('role'));
                        button.setAttribute('role','menuitem');
                        button.setAttribute('data-fp-menu-label',button.getAttribute('aria-label') || button.getAttribute('data-fp-tooltip') || button.getAttribute('title') || button.textContent);
                    }
                }
            });
            for (const el of original) if (el.matches('[role=separator]')) {
                const at = original.indexOf(el);
                el.hidden = el.parentNode !== bar || !original[at-1] || original[at-1].parentNode !== bar || !original[at+1] || original[at+1].parentNode !== bar;
            }
        }
        const observer = new view.ResizeObserver(layout); observer.observe(bar);
        const click = () => menu.hidden ? open() : close(); more.addEventListener('click',click);
        function outside(event) { if (!bar.contains(event.target) && !menu.contains(event.target)) close(); }
        function key(event) {
            if (menu.hidden) {
                if (event.target === more && event.key === 'ArrowDown') { event.preventDefault(); open(); buttons()[0]?.focus(); }
                return;
            }
            if (event.key === 'Escape') { event.preventDefault(); event.stopImmediatePropagation(); close(true); }
            else if (menu.contains(event.target) && ['ArrowDown','ArrowUp','Home','End'].includes(event.key)) {
                event.preventDefault(); const list = buttons(), index = list.indexOf(doc.activeElement);
                const next = event.key === 'Home' ? 0 : event.key === 'End' ? list.length-1 : (index + (event.key==='ArrowDown'?1:-1) + list.length)%list.length;
                list[next]?.focus();
            }
        }
        function selected(event) { if (event.target.closest('button')) { options.onAction?.(event); close(); } }
        doc.addEventListener('pointerdown',outside,true); doc.addEventListener('keydown',key,true); doc.addEventListener('scroll',closeOnScroll,true);
        function closeOnScroll(event) { if (!menu.contains(event.target)) close(); }
        menu.addEventListener('click',selected);
        layout();
        return { layout, destroy() { destroyed = true; observer.disconnect(); close(); restore(); more.remove(); menu.remove(); bar.classList.remove('fp-embedded-toolbar'); doc.removeEventListener('pointerdown',outside,true); doc.removeEventListener('keydown',key,true); doc.removeEventListener('scroll',closeOnScroll,true); } };
    }
    return { version:'0.1.0', installBoundary, installTooltips, enhanceToolbar };
})();
if (typeof module === 'object' && module.exports) module.exports = FivePlusOneEmbeddedUI;
