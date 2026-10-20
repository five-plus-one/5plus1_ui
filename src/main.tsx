import React, { useState, useEffect, useMemo, useCallback } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight,
  ArrowRight,
  Plus,
  Search,
  Sun,
  Moon,
  Palette,
  Type,
  Grid2X2,
  Shapes,
  Layers,
  BookOpen,
  FileText,
  Compass,
  Code2,
  Check,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  PanelLeft,
  Settings,
  Download,
  CheckCircle2,
  MousePointer2,
  MoveUpRight,
  Box,
  Users,
  FolderTree,
  Monitor,
  ExternalLink,
  Copy,
  Leaf,
  Command,
} from "lucide-react";
import * as U from "./lib";
import { entries, groups, Demo } from "./catalog";
import { WorkspaceGallery, workspaceEntries } from "./workspace-gallery";
import { principles, principlesFor, principleById } from "./principles";
import "./site.css";
import { componentCode } from "./component-code";
const allEntries = [...entries, ...workspaceEntries];
const nav = [
  { id: "/", label: "概览", icon: Compass },
  { id: "/principles", label: "设计原则", icon: Leaf },
  { id: "/foundations", label: "设计基础", icon: Palette },
  { id: "/components", label: "组件", icon: Shapes },
  { id: "/workspace", label: "工作区组件", icon: PanelLeft },
  { id: "/examples", label: "产品示例", icon: Layers },
  { id: "/start", label: "开始使用", icon: Code2 },
];
const go = (p: string) => {
  location.hash = p;
};
function Mark({ small = false }: { small?: boolean }) {
  return <U.BrandLogo size={small ? 24 : 36} decorative />;
}
function useRoute() {
  let [p, setP] = useState(location.hash.slice(1) || "/");
  useEffect(() => {
    let f = () => {
      setP(location.hash.slice(1) || "/");
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", f);
    return () => window.removeEventListener("hashchange", f);
  }, []);
  return p;
}
function App() {
  let path = useRoute(),
    [theme, setTheme] = useState(
      () => localStorage.getItem("fp-theme") || "light",
    ),
    [accent, setAccent] = useState(
      () => localStorage.getItem("fp-product") || "brand",
    ),
    [toast, setToast] = useState(""),
    [search, setSearch] = useState(false),
    [menu, setMenu] = useState(false);
  let notify = useCallback((s: string) => setToast(s), []);
  useEffect(() => setMenu(false), [path]);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("fp-theme", theme);
    // 通知所有 iframe embed 页面同步主题
    document.querySelectorAll("iframe.device-canvas").forEach((iframe) => {
      (iframe as HTMLIFrameElement).contentWindow?.postMessage(
        { type: "theme-change", theme, product: document.documentElement.dataset.product },
        location.origin,
      );
    });
  }, [theme]);
  useEffect(() => {
    const product = path === "/examples/workspace" ? "kezhan" : path === "/examples/marker" ? "marker" : path === "/examples/account" ? "onepass" : path === "/examples/brand" ? "brand" : accent;
    delete document.documentElement.dataset.accent;
    document.documentElement.dataset.product = product;
    localStorage.setItem("fp-product", accent);
    const sync = () => document.querySelectorAll<HTMLIFrameElement>('iframe.device-canvas').forEach(frame => frame.contentWindow?.postMessage({type:'theme-change',theme,product},location.origin));
    sync(); const ready = (event: MessageEvent) => { if (event.origin === location.origin && event.data?.type === 'embed-ready') sync(); };
    window.addEventListener('message', ready); return () => window.removeEventListener('message', ready);
  }, [accent, path, theme]);
  useEffect(() => {
    let f = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearch((v) => !v);
      }
    };
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, []);
  let current =
    nav.find((n) => n.id !== "/" && path.startsWith(n.id)) || nav[0];
  if (path.startsWith('/embed/')) return <><Embed path={path} notify={notify} />{toast && <U.Toast message={toast} onClose={() => setToast('')} />}</>;
  return (
    <>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main-content")?.focus();
          document.getElementById("main-content")?.scrollIntoView();
        }}
      >
        跳到主要内容
      </a>
      <aside className={`site-sidebar ${menu ? "is-open" : ""}`}>
        <a className="site-brand" href="#/">
          <Mark />
          <span>
            五加一<span>Design</span>
          </span>
          <U.Badge>0.3</U.Badge>
        </a>
        <button className="site-search" onClick={() => setSearch(true)}>
          <Search size={15} />
          <span>寻找一些灵感</span>
          <U.Kbd>⌘ K</U.Kbd>
        </button>
        <div className="sidebar-caption">设计资源</div>
        <nav aria-label="设计体系导航">
          {nav.map((n) => (
            <a
              href={"#" + n.id}
              key={n.id}
              onClick={() => setMenu(false)}
              className={current.id === n.id ? "is-active" : ""}
              aria-current={current.id === n.id ? "page" : undefined}
            >
              <n.icon size={17} />
              <span>{n.label}</span>
              {n.id === "/components" && <small>{entries.length}</small>}
            </a>
          ))}
        </nav>
        <div className="sidebar-divider" />
        <div className="sidebar-caption">五加一产品</div>
        <a className="product-link" href="#/examples/workspace">
          <BookOpen size={16} />
          <span>课栈笔记</span>
          <ArrowUpRight size={13} />
        </a>
        <a className="product-link" href="#/examples/marker">
          <Sparkles size={16} />
          <span>AI 批改助手</span>
          <ArrowUpRight size={13} />
        </a>
        <a className="product-link" href="#/examples/account">
          <Grid2X2 size={16} />
          <span>OnePass</span>
          <ArrowUpRight size={13} />
        </a>
        <div className="sidebar-bottom">
          <div className="little-garden">
            <span>五加一 · 工具与内容</span>
            <Leaf size={28} />
          </div>
          <a href="https://go.r-l.ink/home" target="_blank" rel="noreferrer">
            由五加一创造
            <ArrowUpRight size={13} />
          </a>
        </div>
      </aside>
      {menu && (
        <button
          className="mobile-scrim"
          aria-label="关闭导航"
          onClick={() => setMenu(false)}
        />
      )}
      <div className="site-main">
        <header className="site-topbar">
          <div>
            <U.IconButton
              label="打开导航"
              className="mobile-menu"
              onClick={() => setMenu(!menu)}
            >
              <Menu size={19} />
            </U.IconButton>
            <span>设计体系</span>
            <ChevronRight size={12} />
            <strong>{current.label}</strong>
          </div>
          <div>
            <U.SelectField label="切换主题颜色" value={accent} onChange={setAccent} options={Object.entries(U.productThemes).map(([value, theme]) => ({value, label: theme.name, color:theme.primary}))} />
            <U.IconButton
              label={theme === "light" ? "切换深色外观" : "切换浅色外观"}
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
            </U.IconButton>
            <a
              className="topbar-home"
              href="https://go.r-l.ink/home"
              target="_blank"
              rel="noreferrer"
            >
              五加一主页
              <ArrowUpRight size={14} />
            </a>
          </div>
        </header>
        <main id="main-content" tabIndex={-1}>
          {path.startsWith("/embed/") ? (
            <Embed path={path} notify={notify} />
          ) : path === "/" ? (
            <Overview />
          ) : path.startsWith("/components") ? (
            <Components path={path} notify={notify} />
          ) : path.startsWith("/workspace") ? (
            <WorkspaceGallery path={path} notify={notify} />
          ) : path === "/foundations" ? (
            <Foundations
              accent={accent}
              setAccent={setAccent}
              theme={theme}
              setTheme={setTheme}
            />
          ) : path === "/principles" ? (
            <Principles />
          ) : path.startsWith("/examples") ? (
            <Examples path={path} notify={notify} />
          ) : path === "/start" ? (
            <Start />
          ) : (
            <U.EmptyState
              title="这个页面还没有内容"
              description="回到概览，继续探索设计体系。"
              action={<U.Button onClick={() => go("/")}>返回概览</U.Button>}
            />
          )}
        </main>
        <footer className="site-footer">
          <span>
            <Mark small />
            五加一 Design
          </span>
          <span>界面规范与组件</span>
          <span>© 2026 五加一</span>
        </footer>
      </div>
      <U.CommandMenu
        open={search}
        onClose={() => setSearch(false)}
        items={[
          ...nav.map((n) => ({ label: n.label, onSelect: () => go(n.id) })),
          ...allEntries.map((e) => ({
            label: `${e.zh} · ${e.name}`,
            onSelect: () =>
              go(
                `${workspaceEntries.includes(e) ? "/workspace" : "/components"}/${e.name}`,
              ),
          })),
        ]}
      />
      {toast && <U.Toast message={toast} onClose={() => setToast("")} />}
    </>
  );
}
function Overview() {
  const [name, setName] = useState("设计系统使用指南");
  const [shared, setShared] = useState(true);
  return (
    <div className="page overview editorial-home">
      <header className="editorial-title">
        <div className="edition-label">
          五加一 / 设计系统 <span>01 — 2026</span>
        </div>
        <h1>
          五加一
          <br />
          设计系统
        </h1>
        <div className="editorial-intro">
          <p>
            五加一产品的设计规范与组件。
            <br />
            为阅读、编辑和日常工作建立一致的体验。
          </p>
          <a href="#/components">
            浏览组件 <ArrowUpRight size={18} />
          </a>
        </div>
      </header>
      <section className="specimen-section">
        <div className="specimen-caption">
          <span>01 / 控件与交互</span>
          <span>直接试用</span>
        </div>
        <div className="specimen-board">
          <div className="specimen-form">
            <span className="specimen-kicker">文档设置</span>
            <h2>新建文档</h2>
            <U.Field label="文档名称">
              <U.Input value={name} onChange={(e) => setName(e.target.value)} />
            </U.Field>
            <U.Switch
              label="允许团队成员编辑"
              checked={shared}
              onChange={setShared}
            />
            <div className="specimen-buttons">
              <U.Button onClick={() => go("/workspace/CollaborativeEditor")}>
                打开文档 <ArrowRight size={15} />
              </U.Button>
              <U.Button variant="secondary" onClick={() => go("/components")}>
                查看组件
              </U.Button>
            </div>
          </div>
          <div className="specimen-document">
            <div className="specimen-doc-top">
              <span>
                <FileText size={15} /> {name || "未命名文档"}
              </span>
              <U.Badge tone="success">
                {shared ? "团队共享" : "仅自己可见"}
              </U.Badge>
            </div>
            <div className="specimen-page">
              <span className="specimen-kicker">设计笔记 · 001</span>
              <h3>
                好的工具，
                <br />
                让人专注于内容。
              </h3>
              <p>
                从清楚的文字、合适的间距开始。每一个操作都应该有明确的位置，每一个状态都应该容易理解。
              </p>
              <hr />
              <div className="specimen-task">
                <CheckCircle2 size={16} />
                <span>整理阅读资料</span>
                <span>已完成</span>
              </div>
              <div className="specimen-task">
                <span className="task-circle" />
                <span>补充本周的想法</span>
                <span>进行中</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="system-index">
        <div className="index-heading">
          <h2>设计与使用</h2>
          <span>从规范到实际界面</span>
        </div>
        {[
          ["01", "设计基础", "颜色、文字、间距与界面层级", "/foundations"],
          ["02", "组件", "输入、导航、反馈与数据展示", "/components"],
          ["03", "工作区", "文件预览、目录与协作编辑", "/workspace"],
          ["04", "产品示例", "课栈、批改助手与账号服务", "/examples"],
        ].map(([n, title, description, url]) => (
          <a key={n} href={"#" + url}>
            <span>{n}</span>
            <h3>{title}</h3>
            <p>{description}</p>
            <ArrowUpRight size={19} />
          </a>
        ))}
      </section>
    </div>
  );
}
function Components({
  path,
  notify,
}: {
  path: string;
  notify: (s: string) => void;
}) {
  let name = path.split("/")[2],
    selected = entries.find((e) => e.name === name),
    [q, setQ] = useState(""),
    [group, setGroup] = useState("全部"),
    [device, setDevice] = useState("desktop");
  let list = entries.filter(
    (e) =>
      (group === "全部" || e.group === group) &&
      (e.zh + e.name).toLowerCase().includes(q.toLowerCase()),
  );
  if (selected)
    return (
      <div className="page component-detail">
        <U.Breadcrumbs
          items={[
            { label: "组件", href: "#/components" },
            { label: selected.group },
            { label: selected.zh },
          ]}
        />
        <U.PageHeader
          eyebrow={selected.name.toUpperCase()}
          title={selected.zh}
          description={selected.description}
          action={<U.Badge tone="success">可直接使用</U.Badge>}
        />
        <div className="preview-heading">
          <span>交互预览</span>
          <div className="device-switch">
            <U.SegmentedControl
              value={device}
              onChange={setDevice}
              items={[
                { value: "desktop", label: "桌面" },
                { value: "tablet", label: "平板" },
                { value: "mobile", label: "手机" },
              ]}
            />
            <span>
              {device === "desktop"
                ? "≥ 1280px"
                : device === "tablet"
                  ? "768px"
                  : "390px"}
            </span>
          </div>
        </div>
        <div className="component-stage" data-device={device}>
          <div
            className="device-frame"
            data-device={device}
            style={{ height: device === "mobile" ? 620 : 460 }}
          >
            <iframe
              key={device}
              title={`${selected.zh}在${
                device === "desktop"
                  ? "桌面"
                  : device === "tablet"
                    ? "平板"
                    : "手机"
              }上的预览`}
              src={`#/embed/${selected.name}?device=${device}`}
              className="device-canvas"
            />
          </div>
        </div>
        <h2 className="doc-heading">对应的设计原则</h2>
        <div className="principle-tags">
          {principlesFor(selected.name, selected.group).map((id) => {
            let p = principleById[id];
            return (
              <a href="#/principles" key={id}>
                <span>{p.index}</span>
                {p.title}
              </a>
            );
          })}
        </div>
        <p className="fp-muted principle-note">
          组件通过语义变量、状态反馈与键盘路径落实这些原则。修改实现时，请同时检查对应原则是否仍然成立。
        </p>
        <h2 className="doc-heading">使用方式</h2>
        <U.CodeBlock code={componentCode(selected.name)} />
        <h2 className="doc-heading">接口说明</h2>
        <U.Card>
          <p className="fp-muted">{selected.api}</p>
          <p className="fp-muted">{selected.usage}</p>
        </U.Card>
        <h2 className="doc-heading">设计与交互</h2>
        <U.Accordion
          items={[
            {
              title: "状态与主题",
              content:
                "组件通过共同语义变量适配深浅主题和强调色。可操作元素提供悬停、按下、禁用与键盘焦点状态，组件专用状态通过属性控制。",
            },
            {
              title: "接入实际业务",
              content:
                "示例中的操作用于体验交互。使用时将回调连接到项目的数据、保存和权限流程，保留组件的可访问名称与错误恢复入口。",
            },
          ]}
        />
        <div className="related-components">
          {entries
            .filter(
              (e) => e.group === selected.group && e.name !== selected.name,
            )
            .slice(0, 4)
            .map((e) => (
              <a href={"#/components/" + e.name} key={e.name}>
                {e.zh}
                <ArrowUpRight size={14} />
              </a>
            ))}
        </div>
      </div>
    );
  return (
    <div className="page">
      <U.PageHeader
        eyebrow="COMPONENT LIBRARY"
        title="组件"
        description={`${entries.length} 个组件，包含交互示例、属性与使用代码。`}
      />
      <div className="catalog-toolbar">
        <U.SearchInput value={q} onChange={setQ} placeholder="搜索组件名称…" />
        <U.Badge>{list.length} 个组件</U.Badge>
      </div>
      <div className="filter-row">
        {["全部", ...groups].map((g) => (
          <U.Chip key={g} selected={g === group} onClick={() => setGroup(g)}>
            {g}
          </U.Chip>
        ))}
      </div>
      <div className="catalog-grid">
        {list.map((e) => (
          <article className="catalog-card" key={e.name}>
            <div className="catalog-visual">
              <Miniature name={e.name} group={e.group} />
            </div>
            <div>
              <h3><a href={"#/components/" + e.name}>{e.zh}<ArrowUpRight size={15} /></a></h3>
              <span>{e.name}</span>
              <p>{e.description}</p>
            </div>
          </article>
        ))}
      </div>
      {!list.length && (
        <U.EmptyState
          title="暂时没有找到"
          description="试试其他名称，或选择全部分类。"
        />
      )}
    </div>
  );
}
function Miniature({ name }: { name: string; group: string }) {
  return <div className="catalog-specimen" inert aria-hidden="true"><Demo name={name} notify={() => {}} /></div>;
}
function Foundations({
  accent,
  setAccent,
  theme,
  setTheme,
}: {
  accent: string;
  setAccent: (s: string) => void;
  theme: string;
  setTheme: (s: string) => void;
}) {
  let [tab, setTab] = useState("color");
  return (
    <div className="page">
      <U.PageHeader
        eyebrow="FOUNDATIONS"
        title="设计基础"
        description="颜色有意义，文字有层次，留白有节奏。"
      />
      <U.Tabs
        value={tab}
        onChange={setTab}
        items={[
          { value: "color", label: "颜色与外观" },
          { value: "type", label: "文字排版" },
          { value: "space", label: "间距与形状" },
          { value: "motion", label: "动效与可访问性" },
        ]}
      />
      {tab === "color" ? (
        <>
          <section className="foundation-control">
            <div>
              <h2>品牌与产品主题</h2>
              <p>五加一品牌色保持一致，各产品使用独立的操作主题色。</p>
            </div>
            <div className="product-theme-picker">
              {Object.entries(U.productThemes).map(([id, palette]) => (
                <button key={id} aria-pressed={accent === id} onClick={() => setAccent(id)}>
                  <span style={{background: palette.primary}} />
                  <span>{palette.name}<small>{palette.primary}</small></span>
                  {accent === id && <Check size={15} />}
                </button>
              ))}
            </div>
            <U.SegmentedControl
              value={theme}
              onChange={setTheme}
              items={[
                { value: "light", label: "浅色" },
                { value: "dark", label: "深色" },
              ]}
            />
          </section>
          <h2 className="doc-heading">颜色承担明确的角色</h2>
          <div className="swatch-grid">
            {[
              ["品牌色", "brand", "五加一统一视觉标识 · #FD8B07"],
              ["产品主题色", "primary", "用于当前产品的主要行动"],
              ["强调容器", "primary-soft", "用于选中与分组"],
              ["页面背景", "bg", "承载整体体验"],
              ["内容表面", "surface", "承载可阅读内容"],
              ["正文", "ink", "表达重要信息"],
              ["次要文字", "muted", "辅助说明与提示"],
            ].map(([label, key, desc]) => (
              <div className="swatch" key={key}>
                <div style={{ background: `var(--fp-${key})` }} />
                <strong>{label}</strong>
                <p>{desc}</p>
                <code>--fp-{key}</code>
              </div>
            ))}
          </div>
          <h2 className="doc-heading">让状态也清楚可读</h2>
          <U.Grid>
            <U.Alert tone="success" title="已保存">
              内容已妥善保存，可以继续编辑。
            </U.Alert>
            <U.Alert tone="warning" title="需要确认">
              请检查资料范围后继续。
            </U.Alert>
            <U.Alert tone="error" title="连接中断">
              内容已保留，可以重新连接。
            </U.Alert>
          </U.Grid>
          <h2 className="doc-heading">主题接入</h2>
          <U.CodeBlock
            code={
              '<html data-theme="light" data-product="kezhan">\n  <!-- 所有组件共享语义颜色 -->\n</html>'
            }
            language="html"
          />
        </>
      ) : tab === "type" ? (
        <div className="type-specimen">
          <div>
            <span>DISPLAY / 56</span>
            <p style={{ fontSize: "clamp(30px,4vw,56px)", fontWeight: 500 }}>
              让好的想法，自然生长。
            </p>
          </div>
          <div>
            <span>HEADLINE / 32</span>
            <p style={{ fontSize: 32 }}>从阅读，走向理解。</p>
          </div>
          <div>
            <span>TITLE / 20</span>
            <p style={{ fontSize: 20 }}>每一次创造，都值得认真对待。</p>
          </div>
          <div>
            <span>BODY / 16</span>
            <p style={{ fontSize: 16, lineHeight: 1.9, maxWidth: 680 }}>
              用清楚的层级组织信息，以舒适的行距承载长篇阅读。中文正文优先考虑字形、段落和持续阅读的感受，让知识之间的关系更容易被理解。
            </p>
          </div>
          <div>
            <span>LABEL / 13</span>
            <p style={{ fontSize: 13 }}>保存笔记 · 继续阅读 · 查看资料</p>
          </div>
        </div>
      ) : tab === "space" ? (
        <>
          <h2 className="doc-heading">以 4 为基础的空间节奏</h2>
          <div className="spacing-list">
            {[4, 8, 12, 16, 24, 32, 48, 64].map((n) => (
              <div key={n}>
                <code>{n}px</code>
                <span style={{ width: n * 4 }} />
                <small>
                  {n <= 12
                    ? "控件内部"
                    : n <= 24
                      ? "相关内容分组"
                      : "区域与章节"}
                </small>
              </div>
            ))}
          </div>
          <h2 className="doc-heading">形状服务于内容的关系</h2>
          <div className="radius-list">
            {[6, 8, 12, 999].map((r, i) => (
              <div key={r}>
                <span style={{ borderRadius: r }} />
                <strong>{["控件", "内容容器", "浮层", "胶囊标签"][i]}</strong>
                <code>{r === 999 ? "full" : r + "px"}</code>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <h2 className="doc-heading">变化有因，反馈及时</h2>
          <U.Table
            columns={["场景", "时长", "目的"]}
            rows={[
              ["状态反馈", "120–180ms", "确认点击、悬停与焦点"],
              ["面板展开", "200–280ms", "保持位置与层级关系"],
              ["减少动态效果", "即时反馈", "尊重系统中的动态效果偏好"],
            ]}
          />
          <h2 className="doc-heading">可访问性融入每个细节</h2>
          <U.Accordion
            items={[
              {
                title: "键盘与焦点",
                content:
                  "主流程可以通过键盘完成。对话框使用原生模态语义和焦点约束；标签页、文件树、分栏与横向滚动条支持相应键盘操作。",
              },
              {
                title: "文字与触控",
                content:
                  "采用可配对的语义前景和背景，常用触控区域至少 44px。对实际项目中的组合颜色、缩放和最终内容进行验收。",
              },
              {
                title: "减少动态效果",
                content:
                  "组件响应 prefers-reduced-motion，保留状态信息并缩短动效。",
              },
            ]}
          />
        </>
      )}
    </div>
  );
}
function Embed({ path, notify }: { path: string; notify: (s: string) => void }) {
  let name = path.split("/")[2]?.split("?")[0] || "";
  let entry = allEntries.find((e) => e.name === name);
  useEffect(() => {
    const syncTheme = (e: MessageEvent) => {
      if (e.origin === location.origin && e.source === window.parent && e.data?.type === "theme-change" && ['light', 'dark'].includes(e.data.theme)) {
        document.documentElement.setAttribute("data-theme", e.data.theme);
        if (Object.keys(U.productThemes).includes(e.data.product)) document.documentElement.dataset.product = e.data.product;
      }
    };
    window.addEventListener("message", syncTheme);
    window.parent.postMessage({ type: "embed-ready" }, "*");
    return () => window.removeEventListener("message", syncTheme);
  }, []);
  if (!entry) return <p className="fp-muted">没有找到这个组件。</p>;
  return (
    <div className="embed-page">
      <header>
        <span>{entry.zh}</span>
        <U.Badge>{entry.group}</U.Badge>
      </header>
      <Demo key={entry.name} name={entry.name} notify={notify} />
    </div>
  );
}
function scrollToPrinciple(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  el.animate(
    [
      { boxShadow: "0 0 0 0 var(--fp-primary)" },
      { boxShadow: "0 0 0 4px var(--fp-primary-soft)" },
      { boxShadow: "0 0 0 0 transparent" },
    ],
    { duration: 900, easing: "ease-out" },
  );
}
function Principles() {
  let data = principles.map((p) => ({
    n: p.index,
    title: p.title,
    sub: p.summary,
    body: p.body,
    id: p.id,
    rules: p.rules,
  }));
  let all = [...entries, ...workspaceEntries];
  return (
    <div className="page">
      <U.PageHeader
        eyebrow="DESIGN PRINCIPLES"
        title="做有温度，也有秩序的工具。"
        description="六条共同准则，连接每一个细节与完整体验。每个组件都标注了它落实的原则。"
      />
      <nav className="principle-jump" aria-label="原则索引">
        {data.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => scrollToPrinciple(p.id)}
          >
            <span>{p.n}</span>
            {p.title}
          </button>
        ))}
      </nav>
      <div className="principles-grid">
        {data.map((p) => (
          <article key={p.n} id={p.id}>
            <span>{p.n}</span>
            <h2>{p.title}</h2>
            <h3>{p.sub}</h3>
            <p>{p.body}</p>
            <ul className="principle-rules">
              {p.rules.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <h2 className="doc-heading" id="component-principles">
        组件与原则
      </h2>
      <p className="fp-muted principle-note">
        每个组件至少对应一条原则。修改组件实现时，请逐项检查对应原则是否仍然成立。
      </p>
      <div className="principle-matrix">
        {groups.concat("工作区").map((g) => {
          let list = all.filter((e) => e.group === g);
          if (!list.length) return null;
          return (
            <section key={g}>
              <h3>{g}</h3>
              <div>
                {list.map((e) => (
                  <div className="principle-row" key={e.name}>
                    <a
                      href={
                        (g === "工作区" ? "#/workspace/" : "#/components/") +
                        e.name
                      }
                    >
                      {e.zh}
                    </a>
                    <small>{e.name}</small>
                    <span>
                      {principlesFor(e.name, e.group).map((id) => (
                        <button
                          type="button"
                          key={id}
                          onClick={() => scrollToPrinciple(id)}
                          title={principleById[id].title}
                        >
                          {principleById[id].index}
                        </button>
                      ))}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
      <section className="source-note">
        <BookOpen size={21} />
        <div>
          <h3>从成熟原则出发，在真实场景里成长。</h3>
          <p>
            参考 Material Design、Google PAIR、Atlassian 与 Carbon
            的设计方法，结合五加一产品形成共同规范。
          </p>
          <a href="/docs/research/ui-ux-research-2026-10-19.md" download>
            阅读完整调研
            <ArrowUpRight size={13} />
          </a>
        </div>
      </section>
    </div>
  );
}
function Start() {
  return (
    <div className="page start-page">
      <U.PageHeader
        eyebrow="GET STARTED"
        title="把设计，带进你的项目。"
        description="从基础样式开始，按需使用组件，再连接真实的业务。"
      />
      <U.Steps current={0} items={["安装组件包", "导入样式", "连接你的产品"]} />
      <h2 className="doc-heading">1. 连接本地组件库</h2>
      <p className="fp-muted">
        在 5plus1-ui 目录构建并打包，在你的 React 项目安装生成的包。
      </p>
      <U.CodeBlock
        language="shell"
        code={
          "# 在 5plus1-ui 目录\nnpm install\nnpm run build\nnpm pack\n\n# 在你的产品项目\nnpm install ../5plus1-ui/fiveplusone-ui-0.3.1.tgz"
        }
      />
      <h2 className="doc-heading">2. 从一个按钮开始</h2>
      <U.CodeBlock
        code={
          'import { Button, Field, Input, Card } from "@fiveplusone/ui";\nimport "@fiveplusone/ui/styles.css";\n\nexport function NoteForm() {\n  return (\n    <Card>\n      <Field label="笔记名称">\n        <Input placeholder="给想法取个名字" />\n      </Field>\n      <Button onClick={saveNote}>保存笔记</Button>\n    </Card>\n  );\n}'
        }
      />
      <h2 className="doc-heading">3. 设置共同外观</h2>
      <U.CodeBlock
        language="css"
        code={
          ":root {\n  --fp-primary: #356348;\n  --fp-on-primary: #ffffff;\n  --fp-primary-soft: #e5eddf;\n  --fp-primary-ink: #2c523b;\n  --fp-radius-sm: 8px;\n}"
        }
      />
      <U.Alert title="先接入一个真实流程">
        从登录、资料列表或笔记编辑开始。确认主题、内容与交互符合产品需要后，再扩展到其他页面。
      </U.Alert>
      <h2 className="doc-heading">工作区能力接入</h2>
      <p className="fp-muted">
        文档预览通过页图协议对接转换服务；多人编辑通过 Hocuspocus 与 Yjs
        接入权限和同步。接口与迁移说明随组件源码一同提供。
      </p>
      <div className="related-components">
        <a href="#/workspace/ResourcePreview">
          文件预览
          <ArrowUpRight size={14} />
        </a>
        <a href="#/workspace/CollaborativeEditor">
          多人编辑
          <ArrowUpRight size={14} />
        </a>
        <a href="#/workspace/FileTree">
          文件树
          <ArrowUpRight size={14} />
        </a>
      </div>
    </div>
  );
}
function Examples({
  path,
  notify,
}: {
  path: string;
  notify: (s: string) => void;
}) {
  let id = path.split("/")[2] || "workspace",
    items = [
      { value: "workspace", label: "课栈笔记" },
      { value: "marker", label: "AI 批改助手" },
      { value: "account", label: "OnePass" },
      { value: "brand", label: "品牌首页" },
    ];
  return (
    <div className="page examples-page">
      <U.PageHeader
        eyebrow="PRODUCT EXPERIENCES"
        title="同一种语言，不同的创造。"
        description="把共同的视觉与交互，放进真实的产品场景。"
      />
      <U.Tabs items={items} value={id} onChange={(v) => go("/examples/" + v)} />
      <div className="example-browser">
        <div className="browser-chrome">
          <span>
            <i />
            <i />
            <i />
          </span>
          <span>
            {id === "workspace"
              ? "课栈笔记"
              : id === "marker"
                ? "AI 批改助手"
                : id === "account"
                  ? "OnePass"
                  : "五加一"}{" "}
            · 产品体验
          </span>
          <Monitor size={13} />
        </div>
        {id === "workspace" ? (
          <WorkspaceExample notify={notify} />
        ) : id === "marker" ? (
          <MarkerExample notify={notify} />
        ) : id === "account" ? (
          <AccountExample notify={notify} />
        ) : (
          <BrandExample />
        )}
      </div>
      <div className="example-note">
        <span>共同的秩序</span>
        <p>
          {id === "workspace"
            ? "目录、正文与 AI 各有合适的空间。阅读保持舒适，辅助操作按需展开。"
            : id === "marker"
              ? "把评分依据、建议结果与提交操作放在同一条清晰路径上。"
              : id === "account"
                ? "清楚的标签、就近校验与可恢复的操作，让账号流程更从容。"
                : "用鲜明的品牌与直接的入口，让人快速理解产品的价值。"}
        </p>
      </div>
    </div>
  );
}
function WorkspaceExample({ notify }: { notify: (s: string) => void }) {
  let [ai, setAi] = useState(true),
    [selected, setSelected] = useState("n1"),
    [messages, setMessages] = useState<string[]>([]);
  return (
    <div className={`workspace-example ${ai ? "" : "ai-hidden"}`}>
      <aside>
        <div className="example-logo">
          <BookOpen size={19} />
          <strong>课栈笔记</strong>
        </div>
        <U.Button
          variant="secondary"
          size="sm"
          onClick={() => notify("新笔记已创建")}
        >
          <Plus size={14} />
          新建笔记
        </U.Button>
        <p className="example-aside-label">我的课程</p>
        <U.FileTree
          items={[
            {
              id: "linear",
              name: "线性代数",
              kind: "folder",
              children: [
                { id: "n1", name: "我的学习计划", kind: "file" },
                { id: "n2", name: "课程资料", kind: "file" },
                { id: "n3", name: "复习记录", kind: "file" },
              ],
            },
            {
              id: "math",
              name: "高等数学",
              kind: "folder",
              children: [{ id: "n4", name: "学习笔记", kind: "file" }],
            },
          ]}
          defaultExpanded={["linear"]}
          selectedId={selected}
          onSelect={(n) => setSelected(n.id)}
        />
        <div className="workspace-user">
          <U.Avatar name="五" size={28} />
          <span>五加一的工作空间</span>
        </div>
      </aside>
      <section className="note-example">
        <header>
          <span>
            线性代数 /{" "}
            {selected === "n1"
              ? "我的学习计划"
              : selected === "n2"
                ? "课程资料"
                : "学习记录"}
          </span>
          <U.IconButton
            label={ai ? "收起 AI 助手" : "打开 AI 助手"}
            onClick={() => setAi(!ai)}
          >
            <Sparkles size={16} />
          </U.IconButton>
        </header>
        <article>
          <span className="note-eyebrow">一个新的开始</span>
          <h1>
            {selected === "n1"
              ? "让学习，形成自己的脉络。"
              : selected === "n2"
                ? "把有用的资料，放在一起。"
                : "每一步，都算数。"}
          </h1>
          <div className="note-meta">
            <span>五加一</span>
            <span>更新于今天</span>
            <U.Badge tone="success">已保存</U.Badge>
          </div>
          <p>
            知识的积累，从来不只是记下更多。把零散的想法放在一起，让每一次阅读，都成为新的理解。
          </p>
          <h2>这周，专注于三件事</h2>
          <U.Stack gap={10}>
            <U.Checkbox
              label="阅读课程讲义，标记想继续探索的问题"
              defaultChecked
            />
            <U.Checkbox label="把自己的理解写下来" />
            <U.Checkbox label="回看笔记，建立知识之间的联系" />
          </U.Stack>
          <U.Divider />
          <U.Callout title="留一点时间，想清楚">
            不急着得到所有答案。先记下问题，再带着问题回到资料中。
          </U.Callout>
          <h2>相关资料</h2>
          <U.FileCard
            name="课程学习指南.pdf"
            detail="学习参考 · 3 页"
            onOpen={() => go("/workspace/ResourcePreview")}
          />
        </article>
      </section>
      {ai && (
        <aside className="ai-example">
          <header>
            <Sparkles size={16} />
            <strong>一起想一想</strong>
            <U.Badge tone="accent">AI</U.Badge>
          </header>
          <U.AIMessage role="assistant">
            学习计划已经有了清楚的方向。我们可以从一个具体的小目标开始，让进展看得见。
          </U.AIMessage>
          <div className="ai-suggestions">
            {["帮我安排复习计划", "整理这篇笔记"].map((s) => (
              <button key={s} onClick={() => setMessages((m) => [...m, s])}>
                {s}
                <ArrowUpRight size={12} />
              </button>
            ))}
          </div>
          {messages.map((m, i) => (
            <React.Fragment key={i}>
              <U.AIMessage role="user">{m}</U.AIMessage>
              <U.AIMessage role="assistant">
                可以先把目标分成阅读、整理与回顾三个阶段，按自己的节奏逐步完成。
              </U.AIMessage>
            </React.Fragment>
          ))}
          <div className="ai-composer-anchor">
            <U.AIComposer onSend={(s) => setMessages((m) => [...m, s])} />
          </div>
        </aside>
      )}
    </div>
  );
}
function MarkerExample({ notify }: { notify: (s: string) => void }) {
  let [score, setScore] = useState(8),
    [mode, setMode] = useState("review"),
    [submitted, setSubmitted] = useState(false);
  return (
    <div className="marker-example">
      <header>
        <span className="example-logo">
          <Sparkles size={20} />
          AI 批改助手
        </span>
        <U.Badge tone="accent">试改模式</U.Badge>
      </header>
      <div className="marker-grid">
        <section>
          <U.Breadcrumbs
            items={[
              { label: "批改工作台" },
              { label: "本次作业" },
              { label: "第 3 题" },
            ]}
          />
          <h2>先看见思路，再给出评价。</h2>
          <p className="fp-muted">当前试卷 · 第 3 / 24 份</p>
          <div className="answer-paper">
            <span>学生作答</span>
            <h3>请结合材料，说明你的观点。</h3>
            <p>
              我认为，一个好的学习方法需要与自己的实际情况结合。首先，要明确目标，把较大的任务拆成可以完成的小步骤。
            </p>
            <p>
              其次，要及时回顾。只有把学到的内容用自己的话讲出来，才能发现还没有理解的地方。
            </p>
            <p>
              最后，在实践中不断调整方法。学习计划应该为理解服务，也应当给探索留下空间。
            </p>
          </div>
        </section>
        <U.Card>
          <div className="fp-between">
            <strong>评分建议</strong>
            <U.Badge tone={submitted ? "success" : "warning"}>
              {submitted ? "已确认" : "等待确认"}
            </U.Badge>
          </div>
          <U.Tabs
            items={[
              { value: "review", label: "评分依据" },
              { value: "settings", label: "批改设置" },
            ]}
            value={mode}
            onChange={setMode}
          />
          {mode === "review" ? (
            <>
              <div className="score-display">
                <strong>{score}</strong>
                <span>/ 10 分</span>
              </div>
              <U.NumberInput
                label="评分"
                value={score}
                onChange={setScore}
                max={10}
              />
              <U.Divider />
              <U.Timeline
                items={[
                  {
                    title: "观点明确",
                    description: "能够围绕问题提出自己的判断。",
                  },
                  {
                    title: "论述有层次",
                    description: "从目标、回顾与调整三个方面展开。",
                  },
                  {
                    title: "还可以更具体",
                    description: "增加一个真实事例，会让观点更有说服力。",
                  },
                ]}
              />
              <U.Field label="给学生的评语">
                <U.Textarea defaultValue="思路清晰，表达完整。试着加入一个自己的学习经历，让论述更具体。" />
              </U.Field>
              <U.Button
                disabled={submitted}
                onClick={() => {
                  setSubmitted(true);
                  notify("示例评分已确认");
                }}
              >
                {submitted ? "已确认评分" : "确认本次评分"}
              </U.Button>
            </>
          ) : (
            <U.Stack>
              <U.Switch
                label="提交前由我确认"
                checked
                onChange={() => notify("试改模式保留人工确认")}
              />
              <U.Select
                aria-label="评分方式"
                options={[
                  { value: "single", label: "单次评阅" },
                  { value: "double", label: "双评复核" },
                ]}
              />
              <p className="fp-muted">
                评分模式由教师根据任务选择，重要结果保留回看入口。
              </p>
            </U.Stack>
          )}
        </U.Card>
      </div>
    </div>
  );
}
function AccountExample({ notify }: { notify: (s: string) => void }) {
  let [email, setEmail] = useState(""),
    [error, setError] = useState(""),
    [done, setDone] = useState(false);
  return (
    <div className="account-example">
      <div className="account-story">
        <Mark />
        <span className="eyebrow">ONE ACCOUNT. MORE POSSIBILITIES.</span>
        <h2>
          每一次创造，
          <br />
          从这里连接。
        </h2>
        <p>
          一个五加一账号，
          <br />
          连接你的工具、知识和新的可能。
        </p>
        <div className="account-shapes">
          <i />
          <i />
          <i />
        </div>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("请输入完整的邮箱地址");
            return;
          }
          setError("");
          setDone(true);
        }}
      >
        <U.Badge tone="accent">OnePass</U.Badge>
        <h2>{done ? "欢迎回来。" : "很高兴，再次见到你。"}</h2>
        <p>继续你的五加一旅程。</p>
        {done ? (
          <U.Alert title="登录表单已验证" tone="success">
            这是账号流程示例。接入你的身份服务后，即可完成实际登录。
          </U.Alert>
        ) : (
          <>
            <U.Field label="邮箱地址" error={error}>
              <U.Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </U.Field>
            <U.Field label="密码">
              <U.PasswordInput
                required
                minLength={6}
                placeholder="输入你的密码"
              />
            </U.Field>
            <U.Button type="submit" size="lg">
              继续
              <ArrowRight size={15} />
            </U.Button>
            <span className="account-help">
              首次使用？
              <button
                type="button"
                onClick={() => notify("在项目中连接账号注册流程")}
              >
                创建五加一账号
              </button>
            </span>
          </>
        )}
      </form>
    </div>
  );
}
function BrandExample() {
  return (
    <div className="brand-example">
      <header>
        <span className="example-logo">
          <Mark small />
          五加一
        </span>
        <a href="https://go.r-l.ink/home" target="_blank" rel="noreferrer">
          认识我
          <ArrowUpRight size={14} />
        </a>
      </header>
      <span className="eyebrow">SMALL IDEAS. REAL POSSIBILITIES.</span>
      <h1>
        为好奇心，
        <br />
        做一点<span>有用的事。</span>
      </h1>
      <p>
        创造工具，连接知识。
        <br />
        把每个小小的想法，变成真实的可能。
      </p>
      <U.Button onClick={() => go("/examples/workspace")}>
        探索我的产品
        <ArrowRight size={15} />
      </U.Button>
      <div className="brand-projects">
        <span>课栈笔记</span>
        <span>AI 批改助手</span>
        <span>OnePass</span>
      </div>
      <div className="brand-flower">✳</div>
    </div>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
