import { useRef, useState } from "react";
import * as U from "./lib";

export function UploadQueueDemo() {
  const [tasks, setTasks] = useState<U.UploadTask[]>([
    { id: "one", name: "课堂讲义.pdf", status: "uploading", progress: 66 },
    {
      id: "two",
      name: "课程笔记.docx",
      status: "error",
      error: "网络连接中断",
    },
  ]);
  const remove = (id: string) =>
    setTasks((items) => items.filter((item) => item.id !== id));
  return (
    <U.UploadQueue
      tasks={tasks}
      onCancel={remove}
      onDismiss={remove}
      onRetry={(id) =>
        setTasks((items) =>
          items.map((item) =>
            item.id === id
              ? { ...item, status: "uploading", progress: 0, error: undefined }
              : item,
          ),
        )
      }
    />
  );
}

export function ChatComposerDemo() {
  const [value, setValue] = useState(""),
    [model, setModel] = useState("fast"),
    [loading, setLoading] = useState(false),
    [quote, setQuote] = useState("如何将一个复杂的问题拆成容易理解的步骤？");
  const [attachments, setAttachments] = useState<U.ComposerAttachment[]>([]);
  const [messages, setMessages] = useState<U.Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "可以从一个具体的问题开始，也可以添加你想讨论的资料。",
    },
  ]);
  return (
    <div style={{ maxWidth: 640, margin: "auto" }}>
      <div style={{ height: 230 }}>
        <U.MessageList messages={messages} isLoading={loading} />
      </div>
      <U.ChatComposer
        value={value}
        onChange={setValue}
        isLoading={loading}
        quotedText={quote}
        onClearQuote={() => setQuote("")}
        attachments={attachments}
        onFiles={(files) =>
          setAttachments((items) => [
            ...items,
            ...files.map((file) => ({
              id: crypto.randomUUID(),
              name: file.name,
              status: "ready" as const,
            })),
          ])
        }
        onRemoveAttachment={(id) =>
          setAttachments((items) => items.filter((item) => item.id !== id))
        }
        onSend={(text) => {
          setMessages((items) => [
            ...items,
            {
              id: crypto.randomUUID(),
              role: "user",
              content: text || "一起看看这些资料",
            },
          ]);
          setValue("");
          setQuote("");
          setAttachments([]);
          setLoading(true);
        }}
        onStop={() => setLoading(false)}
        tools={
          <U.ModelSelector
            value={model}
            onChange={setModel}
            groups={[
              {
                name: "通用模型",
                models: [
                  { id: "fast", label: "快速版", contextWindow: 128000 },
                  {
                    id: "deep",
                    label: "深度版",
                    contextWindow: 200000,
                    supportsThinking: true,
                  },
                ],
              },
            ]}
          />
        }
      />
    </div>
  );
}
export function MarkdownEditorDemo() {
  const [markdown, setMarkdown] = useState(
    '# 从阅读到理解\n\n把资料变成自己的认识，从一个问题开始。你可以直接编辑这篇笔记。\n\n## 一个简单的例子\n\n向量长度 $\\sqrt{x^2+y^2}$ 描述了点到原点的距离。\n\n| 阶段 | 目标 |\n| --- | --- |\n| 阅读 | 找到关键概念 |\n| 练习 | 检查理解 |\n\n:::note{label="学习提示"}\n先用自己的话描述，再回到资料核对。\n:::\n',
  );
  return (
    <div>
      <U.MarkdownEditor
        markdown={markdown}
        onChange={setMarkdown}
        status="内容保留在本次预览中"
        onExport={(text) => {
          const url = URL.createObjectURL(
            new Blob([text], { type: "text/markdown" }),
          );
          const link = document.createElement("a");
          link.href = url;
          link.download = "学习笔记.md";
          link.click();
          URL.revokeObjectURL(url);
        }}
      />
    </div>
  );
}
export function WorkspaceLayoutDemo() {
  const layout = useRef<U.WorkspaceLayoutHandle>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [selected, setSelected] = useState("note");
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <U.Button
          size="sm"
          variant="secondary"
          onClick={() =>
            collapsed
              ? layout.current?.expand("files")
              : layout.current?.collapse("files")
          }
        >
          {collapsed ? "展开目录" : "收起目录"}
        </U.Button>
        <U.Button
          size="sm"
          variant="ghost"
          onClick={() => layout.current?.setLayout([22, 50, 28])}
        >
          恢复布局
        </U.Button>
      </div>
      <div
        style={{
          height: 480,
          border: "1px solid var(--fp-line)",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <U.WorkspaceLayout
          ref={layout}
          panels={[
            {
              id: "files",
              label: "资料目录",
              defaultSize: 22,
              minSize: 15,
              collapsible: true,
              onCollapse: () => setCollapsed(true),
              onExpand: () => setCollapsed(false),
              content: (
                <U.FileTree
                  items={[
                    {
                      id: "course",
                      kind: "folder",
                      name: "学习资料",
                      children: [
                        { id: "note", name: "学习笔记", kind: "file" },
                        { id: "handout", name: "课程讲义.pdf", kind: "file" },
                      ],
                    },
                  ]}
                  defaultExpanded={["course"]}
                  selectedId={selected}
                  onSelect={(node) => setSelected(node.id)}
                />
              ),
            },
            {
              id: "document",
              label: "笔记",
              defaultSize: 50,
              minSize: 25,
              content: (
                <div style={{ padding: 20 }}>
                  <h3>{selected === "note" ? "学习笔记" : "课程讲义"}</h3>
                  <p style={{ color: "var(--fp-muted)", lineHeight: 1.8 }}>
                    将资料、笔记与讨论放在一起。拖动分隔线，找到适合自己的工作空间。
                  </p>
                </div>
              ),
            },
            {
              id: "chat",
              label: "讨论",
              defaultSize: 28,
              minSize: 20,
              content: (
                <div style={{ padding: 12 }}>
                  <U.MessageList
                    messages={[
                      {
                        id: "intro",
                        role: "assistant",
                        content: "有什么想一起讨论的？",
                      },
                    ]}
                  />
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}

export function ShareAccessDemo() {
  const [members, setMembers] = useState<U.AccessMember[]>([
      {
        id: "owner",
        name: "五加一",
        detail: "创建者",
        role: "edit",
        editable: false,
      },
    ]),
    [enabled, setEnabled] = useState(false),
    [access, setAccess] = useState("read");
  const directory = [
    { id: "lin", name: "林同学", detail: "lin@example.com" },
    { id: "chen", name: "陈同学", detail: "chen@example.com" },
    { id: "design", name: "设计协作组", detail: "5 位成员" },
  ];
  return (
    <div style={{ maxWidth: 480, margin: "auto", display: "grid", gap: 24 }}>
      <U.MemberSearch
        excludedIds={members.map((member) => member.id)}
        onSearch={async (query, kind) =>
          directory.filter(
            (item) =>
              (kind === "group"
                ? item.id === "design"
                : item.id !== "design") &&
              (item.name.includes(query) || item.detail.includes(query)),
          )
        }
        onPick={(item) =>
          setMembers((current) => [...current, { ...item, role: "read" }])
        }
      />
      <U.MemberAccess
        canManage
        members={members}
        roles={[
          { value: "read", label: "可以阅读" },
          { value: "edit", label: "可以编辑" },
        ]}
        onRoleChange={(id, role) =>
          setMembers((current) =>
            current.map((item) => (item.id === id ? { ...item, role } : item)),
          )
        }
        onRemove={(id) =>
          setMembers((current) => current.filter((item) => item.id !== id))
        }
      />
      <U.ShareLink
        enabled={enabled}
        onEnabledChange={setEnabled}
        access={access}
        onAccessChange={setAccess}
        url="https://fiveplus.one/share/design"
      />
    </div>
  );
}

export function ResourceExplorerDemo() {
  const [folder, setFolder] = useState<string | null>(null),
    [selected, setSelected] = useState<string[]>([]),
    [message, setMessage] = useState("");
  const [items, setItems] = useState<U.ExplorerResource[]>([
    { id: "course", name: "课程资料", kind: "folder" },
    { id: "notes", name: "学习笔记", kind: "folder" },
    {
      id: "pdf",
      name: "阅读与创造.pdf",
      kind: "file",
      size: 2840000,
      modifiedAt: "2026-10-20",
    },
    {
      id: "slides",
      name: "设计协作.pptx",
      kind: "file",
      size: 5120000,
      modifiedAt: "2026-10-19",
    },
    {
      id: "doc",
      parentId: "course",
      name: "课程提纲.docx",
      kind: "file",
      size: 32000,
    },
    { id: "archive", name: "章节资料", kind: "folder" },
    ...Array.from({ length: 1000 }, (_, index) => ({
      id: `chapter-${index}`,
      parentId: "archive",
      name: `章节资料 ${String(index + 1).padStart(4, "0")}.pdf`,
      kind: "file" as const,
      size: 24000 + index * 100,
    })),
  ]);
  return (
    <div>
      <U.ResourceExplorer
        items={items}
        folderId={folder}
        onFolderChange={setFolder}
        selectedIds={selected}
        onSelectionChange={setSelected}
        onOpen={(item) => setMessage(`已打开 ${item.name}`)}
        onUpload={(files, target) =>
          setItems((current) => [
            ...current,
            ...files.map((file) => ({
              id: crypto.randomUUID(),
              parentId: target,
              name: file.name,
              kind: "file" as const,
              size: file.size,
            })),
          ])
        }
        onMove={(ids, target) =>
          setItems((current) =>
            current.map((item) =>
              ids.includes(item.id) ? { ...item, parentId: target } : item,
            ),
          )
        }
        onCreateFolder={() =>
          setItems((current) => [
            ...current,
            {
              id: crypto.randomUUID(),
              parentId: folder,
              name: "新建文件夹",
              kind: "folder",
            },
          ])
        }
        onAction={(action, targets) => {
          if (action === "delete") {
            setItems((current) =>
              current.filter((item) => !targets.some((t) => t.id === item.id)),
            );
            setSelected([]);
          } else
            setMessage(
              `${action === "share" ? "分享" : action === "download" ? "下载" : "重命名"}：${targets.map((i) => i.name).join("、")}`,
            );
        }}
      />
      {message && <p role="status">{message}</p>}
    </div>
  );
}
