import { useEffect, useMemo, useState } from "react";
import {
  FileText,
  Users,
  FolderTree,
  ArrowUpRight,
  Plus,
  BookOpen,
  PanelLeft,
  Link2,
} from "lucide-react";
import * as U from "./lib";
import type { Entry } from "./catalog";
export const workspaceEntries: Entry[] = [
  {
    name: "ResourcePreview",
    zh: "多格式文件预览",
    group: "工作区",
    description: "PDF、Word、演示文稿与表格，共享清晰稳定的阅读体验。",
    usage: "Office 格式沿用课栈的服务端转换与页图协议。",
    api: "resource: {name,url,mediaType?,bytes?,previewUrl?,downloadUrl?}",
    code: '<ResourcePreview resource={{ name: "课程讲义.docx", url: fileUrl, previewUrl: previewEndpoint }} />',
  },
  {
    name: "PdfPreview",
    zh: "文档页图预览",
    group: "工作区",
    description: "翻页、缩放、展开与重试，完整的文档阅读工具。",
    usage: "沿用课栈的渐进加载、页图懒加载与横向滚动机制。",
    api: "url: 预览接口；name: 文件名；downloadUrl?: 原文件下载地址",
    code: '<PdfPreview url={previewEndpoint} name="讲义.pdf" downloadUrl={downloadUrl} />',
  },
  {
    name: "HorizontalScrollbar",
    zh: "预览横向滚动",
    group: "工作区",
    description: "在放大文档时，保持清楚的定位和可达的操作。",
    usage: "支持拖动、点击轨道、方向键、PageUp、PageDown、Home、End。",
    api: "value；max；viewport；controls: 目标区域 id；onChange(number)",
    code: '<HorizontalScrollbar value={left} max={max} viewport={width} controls="pages" onChange={setLeft} />',
  },
  {
    name: "CollaborativeEditor",
    zh: "多人协作编辑",
    group: "工作区",
    description: "让多个想法在同一篇内容中相遇，编辑与协作自然衔接。",
    usage:
      "沿用课栈的 Tiptap、Yjs 和 Hocuspocus 技术，编辑器通过会话属性接入同步。",
    api: "document?: Y.Doc；provider?: HocuspocusProvider；user: {id,name,color}；markdown?；content?；extensions?；editable?；status?；onChange?；onReady?",
    code: "const {session, status} = useCollaboration({ url, room, token, user });\nreturn session && <CollaborativeEditor {...session} user={user} status={status} />;",
  },
  {
    name: "FileTree",
    zh: "工作区文件树",
    group: "工作区",
    description: "从课程、文件夹到资料，让层次与位置一目了然。",
    usage: "提取课栈文件树的命名空间、层级、展开与选中行为，改为受控接口。",
    api: "items: FileTreeNode[]；selectedId?；onSelect(node)；defaultExpanded?；namespace?；onCreate?；onRename?；onRemove?",
    code: '<FileTree items={files} selectedId={selected}\n  onSelect={file => setSelected(file.id)}\n  defaultExpanded={["course"]} namespace="my-course" />',
  },
];
const files: U.FileTreeNode[] = [
  {
    id: "design",
    name: "设计协作手册",
    kind: "folder",
    children: [
      { id: "pdf", name: "阅读与创造.pdf", kind: "file" },
      { id: "docx", name: "共同的设计语言.docx", kind: "file" },
      { id: "pptx", name: "从想法到体验.pptx", kind: "file" },
      { id: "xlsx", name: "组件使用清单.xlsx", kind: "file" },
    ],
  },
  {
    id: "notes",
    name: "我的笔记",
    kind: "folder",
    children: [
      { id: "plan", name: "下一步的想法", kind: "file" },
      { id: "review", name: "设计回顾", kind: "file" },
    ],
  },
];
function PreviewDemo() {
  let [type, setType] = useState("pdf");
  return (
    <>
      <div className="workspace-demo-toolbar">
        <U.SegmentedControl
          items={["pdf", "docx", "pptx", "xlsx"].map((i) => ({
            value: i,
            label: i.toUpperCase(),
          }))}
          value={type}
          onChange={setType}
        />
        <U.Badge tone="accent">多格式 · 同一体验</U.Badge>
      </div>
      <U.ResourcePreview
        key={type}
        resource={{
          name: files[0].children!.find((f) => f.id === type)!.name,
          url: `/samples/design.${type}`,
          previewUrl: `/samples/${type}.json`,
          downloadUrl: `/samples/design.${type}`,
        }}
      />
      <p className="preview-footnote">
        示例文档及其预览页随站点提供。实际文件由项目的转换服务生成预览，原文件始终可下载。
      </p>
    </>
  );
}
function CollaborationDemo() {
  let [doc] = useState(() => new U.Y.Doc()),
    [two, setTwo] = useState(true);
  useEffect(() => {
    let channel = new BroadcastChannel("fiveplusone-design-collab-demo");
    let origin = { remote: true };
    let send = (update: Uint8Array, o: unknown) => {
      if (o !== origin) channel.postMessage({ type: "update", data: update });
    };
    doc.on("update", send);
    channel.onmessage = (e) => {
      if (e.data.type === "sync") {
        channel.postMessage({
          type: "update",
          data: U.Y.encodeStateAsUpdate(doc),
        });
      }
      if (e.data.type === "update") U.Y.applyUpdate(doc, e.data.data, origin);
    };
    channel.postMessage({ type: "sync" });
    return () => {
      doc.off("update", send);
      channel.close();
    };
  }, [doc]);
  return (
    <>
      <div className="collab-demo-heading">
        <div>
          <U.AvatarGroup names={two ? ["你", "同"] : ["你"]} />
          <span>{two ? "两个编辑视图，共同一篇内容" : "专注于你的想法"}</span>
        </div>
        <U.Button variant="secondary" size="sm" onClick={() => setTwo(!two)}>
          {two ? "收起第二视图" : "打开第二视图"}
        </U.Button>
      </div>
      <div className={`collab-demo-grid ${two ? "two" : ""}`}>
        <div>
          <div className="collab-view-label">
            <span />
            你的编辑视图
          </div>
          <U.CollaborativeEditor
            document={doc}
            user={{ id: "one", name: "你", color: "#356348" }}
            status="local"
          />
        </div>
        {two && (
          <div>
            <div className="collab-view-label">
              <span style={{ background: "#a64d18" }} />
              共同编辑视图
            </div>
            <U.CollaborativeEditor
              document={doc}
              user={{ id: "two", name: "同学", color: "#a64d18" }}
              status="local"
            />
          </div>
        )}
      </div>
      <U.Alert title="试着在任一视图写下一个想法">
        两个编辑器共享同一篇文档。你也可以在同一浏览器中打开此页面，通过本地同步体验跨窗口编辑。
      </U.Alert>
    </>
  );
}
function FileTreeDemo({ notify }: { notify: (s: string) => void }) {
  let [items, setItems] = useState(files),
    [selected, setSelected] = useState("pdf"),
    [rename, setRename] = useState<U.FileTreeNode | null>(null),
    [value, setValue] = useState(""),
    [remove, setRemove] = useState<U.FileTreeNode | null>(null);
  function update(
    nodes: U.FileTreeNode[],
    id: string,
    name?: string,
  ): U.FileTreeNode[] {
    return nodes
      .filter((n) => name !== undefined || n.id !== id)
      .map((n) =>
        n.id === id
          ? { ...n, name: name! }
          : {
              ...n,
              children: n.children ? update(n.children, id, name) : undefined,
            },
      );
  }
  return (
    <>
      <div className="filetree-demo">
        <aside>
          <header>
            <strong>我的资料</strong>
            <U.Badge>
              {items.reduce((s, n) => s + (n.children?.length || 1), 0)}
            </U.Badge>
          </header>
          <U.FileTree
            items={items}
            namespace="design-demo"
            selectedId={selected}
            defaultExpanded={["design", "notes"]}
            onSelect={(n) => setSelected(n.id)}
            onRename={(n) => {
              setRename(n);
              setValue(n.name);
            }}
            onRemove={setRemove}
            onCreate={(n) => {
              setItems((old) =>
                old.map((i) =>
                  i.id === n.id
                    ? {
                        ...i,
                        children: [
                          ...(i.children || []),
                          {
                            id: crypto.randomUUID(),
                            name: "新的想法",
                            kind: "file",
                          },
                        ],
                      }
                    : i,
                ),
              );
              notify("新文件已创建");
            }}
          />
        </aside>
        <section>
          {["pdf", "docx", "pptx", "xlsx"].includes(selected) ? (
            <U.ResourcePreview
              key={selected}
              resource={{
                name: items[0]?.children?.find((f) => f.id === selected)?.name || "资料",
                url: `/samples/design.${selected}`,
                previewUrl: `/samples/${selected}.json`,
              }}
            />
          ) : (
            <U.EmptyState
              title="为想法留一点空间"
              description="选择左侧资料进行阅读，或继续整理你的笔记。"
            />
          )}
        </section>
      </div>
      <U.Dialog
        open={!!rename}
        onClose={() => setRename(null)}
        title="给资料取个新名字"
        footer={
          <U.Button
            onClick={() => {
              if (rename && value.trim()) {
                setItems((old) => update(old, rename.id, value.trim()));
                setRename(null);
                notify("名称已更新");
              }
            }}
          >
            保存名称
          </U.Button>
        }
      >
        <U.Field label="资料名称">
          <U.Input value={value} onChange={(e) => setValue(e.target.value)} />
        </U.Field>
      </U.Dialog>
      <U.ConfirmDialog
        open={!!remove}
        onClose={() => setRemove(null)}
        title="从示例中移除资料？"
        description="本次操作只影响当前展示，刷新后恢复示例内容。"
        onConfirm={() => {
          if (remove) {
            setItems((old) => update(old, remove.id));
            setSelected("");
            setRemove(null);
            notify("资料已移除");
          }
        }}
      />
    </>
  );
}
export function WorkspaceGallery({
  path,
  notify,
}: {
  path: string;
  notify: (s: string) => void;
}) {
  let selected = workspaceEntries.find((e) => e.name === path.split("/")[2]);
  let [scroll, setScroll] = useState(60);
  return (
    <div className="page workspace-gallery">
      <U.PageHeader
        eyebrow="WORKSPACE COMPONENTS"
        title={selected?.zh || "让复杂的工作，自然发生。"}
        description={
          selected?.description ||
          "从课栈提取的文件阅读、目录与协作能力，为更多产品准备。"
        }
      />
      {!selected ? (
        <>
          <div className="workspace-entry-grid">
            {workspaceEntries.map((e, i) => (
              <a href={"#/workspace/" + e.name} key={e.name}>
                <span className="workspace-entry-icon">
                  {i < 2 ? (
                    <FileText size={25} />
                  ) : i === 3 ? (
                    <Users size={25} />
                  ) : (
                    <FolderTree size={25} />
                  )}
                </span>
                <div>
                  <h2>
                    {e.zh}
                    <ArrowUpRight size={16} />
                  </h2>
                  <p>{e.description}</p>
                  <code>{e.name}</code>
                </div>
              </a>
            ))}
          </div>
          <section className="workspace-feature">
            <div className="section-header">
              <div>
                <span className="eyebrow">READ, TOGETHER</span>
                <h2>一种熟悉的阅读体验</h2>
              </div>
              <U.Badge tone="success">沿用课栈预览能力</U.Badge>
            </div>
            <PreviewDemo />
          </section>
        </>
      ) : (
        <>
          <div className="preview-heading">
            <span>交互预览</span>
            <span>
              {selected.name === "CollaborativeEditor"
                ? "在两个视图中体验同步编辑"
                : "真实组件 · 自由体验"}
            </span>
          </div>
          <div className="workspace-stage">
            {selected.name === "CollaborativeEditor" ? (
              <CollaborationDemo />
            ) : selected.name === "FileTree" ? (
              <FileTreeDemo notify={notify} />
            ) : selected.name === "HorizontalScrollbar" ? (
              <U.Stack>
                <div
                  className="scroll-sample"
                  id="scroll-sample"
                  style={{ overflow: "hidden" }}
                >
                  <div
                    style={{
                      width: 1200,
                      transform: `translateX(-${scroll}px)`,
                    }}
                  >
                    想法 · 阅读 · 理解 · 整理 · 连接 · 创造 · 回顾 · 成长
                  </div>
                </div>
                <U.HorizontalScrollbar
                  value={scroll}
                  max={600}
                  viewport={400}
                  controls="scroll-sample"
                  onChange={setScroll}
                />
              </U.Stack>
            ) : (
              <PreviewDemo />
            )}
          </div>
          <h2 className="doc-heading">使用方式</h2>
          <U.CodeBlock
            code={`import { ${selected.name}${selected.name === "CollaborativeEditor" ? ", useCollaboration" : ""} } from '@fiveplusone/ui';\nimport '@fiveplusone/ui/styles.css';\n\n${selected.code}`}
          />
          <h2 className="doc-heading">接口与接入</h2>
          <U.Card>
            <p className="fp-muted">{selected.api}</p>
            <p className="fp-muted">{selected.usage}</p>
          </U.Card>
          {selected.name === "CollaborativeEditor" ? (
            <>
              <h2 className="doc-heading">协作会话</h2>
              <U.Alert title="文档同步与业务保存各有职责">
                本地示例使用共享 Y.Doc 与浏览器窗口同步。跨设备协作使用
                Hocuspocus
                会话，项目提供房间、用户、认证与文档持久化；组件显示连接状态并提供编辑能力。
              </U.Alert>
              <U.CodeBlock
                code={
                  'const user = { id: "u1", name: "五加一", color: "#356348" };\nconst { session, status } = useCollaboration({\n  url: "wss://your-host/collaboration",\n  room: "notebook/document-id",\n  token: getSessionToken,\n  user,\n});\n\nreturn session && (\n  <CollaborativeEditor document={session.document}\n    provider={session.provider} user={user} status={status}\n    extensions={yourExtraExtensions} />\n);'
                }
              />
            </>
          ) : selected.name === "ResourcePreview" ||
            selected.name === "PdfPreview" ? (
            <>
              <h2 className="doc-heading">页图服务协议</h2>
              <p className="fp-muted">
                组件请求预览地址并附带 view=pages。服务按权限检查文件，转换
                Office 文档或渲染 PDF
                后返回页图清单。图片地址也应遵循项目的授权策略。
              </p>
              <U.CodeBlock
                language="json"
                code={
                  '{\n  "status": "ready",\n  "contentHash": "document-version",\n  "manifest": {\n    "pageCount": 2,\n    "pages": [\n      {"n": 1, "url": "/authorized/preview/page-1.png"},\n      {"n": 2, "url": "/authorized/preview/page-2.png"}\n    ]\n  }\n}'
                }
              />
              <p className="fp-muted">
                准备中返回 status: rendering；失败返回 status:
                failed。组件处理等待、重试、页图渐进加载与版本轮询。转换服务与私有文件存储继续由使用方提供。
              </p>
            </>
          ) : null}
          <div className="related-components">
            {workspaceEntries
              .filter((e) => e !== selected)
              .map((e) => (
                <a href={"#/workspace/" + e.name} key={e.name}>
                  {e.zh}
                  <ArrowUpRight size={14} />
                </a>
              ))}
          </div>
        </>
      )}
    </div>
  );
}
