import { useRef, useState } from "react";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import {
  AISettingsWorkspace,
  AnchoredPanel,
  CommerceWorkspace,
  GroupEditor,
  DirectoryWorkspace,
  MarkdownContent,
  NotebookPublishing,
  SkillsWorkspace,
  SettingsTabs,
  UserDetailsWorkspace,
  validateAISettings,
  createEditableAIModel,
  normalizeBrowserUrl,
  ReleaseNotice,
  type CommerceSettings,
  type AISettings,
  type DirectoryGroup,
} from "../src/lib";
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
const commerce: CommerceSettings = {
  enabled: false,
  creditsPerYuan: 10,
  gateway: "",
  pid: "",
  secret: "",
  serviceRates: {
    quarkOcrRequest: 0.1,
    documentOrganization: 0.2,
    webSearch: 0.1,
  },
  plans: [],
};
const ai: AISettings = {
  groups: [],
  defaultModel: "",
  excerptModel: "",
  selectionModel: "",
  imageTextModel: "",
  fallbackModel: "",
  defaultThinking: false,
  defaultSearch: false,
  thinkingEffort: "medium",
  globalContext: "",
  disabledTools: [],
  imageEnabled: false,
};
it("retains pricing edits after a failed save and retries the same payload", async () => {
  const save = vi
    .fn()
    .mockRejectedValueOnce(new Error("服务暂不可用。"))
    .mockResolvedValue(undefined);
  render(<CommerceWorkspace value={commerce} onSave={save} />);
  fireEvent.change(screen.getByLabelText("每元兑换积分"), {
    target: { value: "20" },
  });
  fireEvent.click(screen.getByRole("button", { name: "保存更改" }));
  await screen.findByRole("alert");
  expect(screen.getByLabelText("每元兑换积分")).toHaveValue("20");
  fireEvent.click(screen.getByRole("button", { name: "保存更改" }));
  await screen.findByRole("status");
  expect(save).toHaveBeenLastCalledWith(
    expect.objectContaining({ creditsPerYuan: 20 }),
  );
  expect(screen.getByLabelText("每元兑换积分")).toHaveValue("20");
});
it("requires saving local prices before syncing and respects read-only controls", async () => {
  const sync = vi.fn(),
    view = render(
      <CommerceWorkspace
        value={commerce}
        onSave={() => {}}
        onSyncPrices={sync}
      />,
    );
  fireEvent.change(screen.getByLabelText("每元兑换积分"), {
    target: { value: "15" },
  });
  fireEvent.click(screen.getByRole("tab", { name: "模型价格" }));
  fireEvent.click(screen.getByRole("button", { name: "同步上游价格" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("请先保存");
  expect(sync).not.toHaveBeenCalled();
  view.rerender(
    <CommerceWorkspace value={commerce} onSave={() => {}} readOnly />,
  );
  expect(screen.getByRole("button", { name: "添加模型" })).toBeDisabled();
});
it("creates, edits and removes a membership plan locally before saving", async () => {
  const save = vi.fn();
  render(<CommerceWorkspace value={commerce} onSave={save} />);
  fireEvent.click(screen.getByRole("tab", { name: "会员计划" }));
  fireEvent.click(screen.getByRole("button", { name: "添加会员计划" }));
  fireEvent.change(screen.getByLabelText("计划名称"), {
    target: { value: "课程年卡" },
  });
  fireEvent.click(screen.getByRole("button", { name: "保存更改" }));
  await waitFor(() =>
    expect(save).toHaveBeenCalledWith(
      expect.objectContaining({
        plans: [expect.objectContaining({ name: "课程年卡" })],
      }),
    ),
  );
});
it("preserves skill text after failure and commits complete skill content", async () => {
  const save = vi
    .fn()
    .mockRejectedValueOnce(new Error("暂时无法保存。"))
    .mockResolvedValue(undefined);
  render(
    <SkillsWorkspace
      skills={[
        {
          id: "one",
          name: "复习",
          description: "",
          content: "旧正文",
          pinned: false,
        },
      ]}
      onSave={save}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: /复习/ }));
  fireEvent.change(screen.getByLabelText("技能正文"), {
    target: { value: "# 新方法\n检查例题。" },
  });
  fireEvent.click(screen.getByRole("button", { name: "保存更改" }));
  await screen.findByRole("alert");
  expect(screen.getByLabelText("技能正文")).toHaveValue("# 新方法\n检查例题。");
  fireEvent.click(screen.getByRole("button", { name: "保存更改" }));
  await screen.findByRole("status");
  expect(save).toHaveBeenLastCalledWith([
    expect.objectContaining({ content: "# 新方法\n检查例题。" }),
  ]);
});
it("searches group candidates, preserves selection and confirms discarding edits", async () => {
  const close = vi.fn(),
    save = vi.fn();
  render(
    <GroupEditor
      group={{ id: "g", name: "学习小组", description: "", members: ["five"] }}
      users={[
        { sub: "five", name: "五加一" },
        { sub: "chen", name: "陈同学" },
      ]}
      onSave={save}
      onClose={close}
    />,
  );
  fireEvent.change(screen.getByLabelText("搜索候选成员"), {
    target: { value: "陈" },
  });
  fireEvent.click(screen.getByRole("switch", { name: "陈同学" }));
  fireEvent.click(screen.getByRole("button", { name: "关闭用户组" }));
  expect(close).not.toHaveBeenCalled();
  expect(screen.getByText("放弃尚未保存的更改？")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "取消" }));
  fireEvent.click(screen.getByRole("button", { name: "保存用户组" }));
  await waitFor(() =>
    expect(save).toHaveBeenCalledWith(
      expect.objectContaining({ members: ["five", "chen"] }),
    ),
  );
});
it("retains user profile edits while visiting other detail tabs", () => {
  render(
    <UserDetailsWorkspace
      user={{ sub: "chen", name: "陈同学" }}
      groups={[]}
      storage={{ used: 10, capacity: 5 * 1024 ** 3 }}
      onSaveProfile={() => {}}
      onSaveCapacity={() => {}}
    />,
  );
  fireEvent.change(screen.getByLabelText("显示名称"), {
    target: { value: "陈小同学" },
  });
  fireEvent.click(screen.getByRole("tab", { name: "存储" }));
  fireEvent.click(screen.getByRole("tab", { name: "资料" }));
  expect(screen.getByLabelText("显示名称")).toHaveValue("陈小同学");
});
it("validates nested imported AI settings without throwing on malformed entries", () => {
  expect(validateAISettings(ai)).toBe(true);
  for (const groups of [
    [null],
    [{ models: [null] }],
    [
      {
        id: "a",
        name: "A",
        baseUrl: "",
        apiKey: "",
        models: [{ ...createEditableAIModel(), thinkingLevels: [null] }],
      },
    ],
  ])
    expect(validateAISettings({ ...ai, groups })).toBe(false);
  expect(validateAISettings({ ...ai, fontSize: 0 })).toBe(false);
});
it("adds a custom AI connection and retains it when saving fails", async () => {
  const save = vi.fn().mockRejectedValue(new Error("连接暂不可用。"));
  render(<AISettingsWorkspace value={ai} onSave={save} />);
  fireEvent.click(screen.getByRole("button", { name: "添加连接" }));
  fireEvent.change(screen.getByLabelText("服务地址"), {
    target: { value: "https://example.com/v1" },
  });
  fireEvent.click(screen.getByRole("button", { name: "添加模型" }));
  fireEvent.change(screen.getByLabelText("模型名称"), {
    target: { value: "study" },
  });
  fireEvent.click(screen.getByRole("button", { name: "保存更改" }));
  await screen.findByRole("alert");
  expect(screen.getByLabelText("模型名称")).toHaveValue("study");
  expect(save).toHaveBeenCalledWith(
    expect.objectContaining({
      groups: [
        expect.objectContaining({
          models: [expect.objectContaining({ id: "study" })],
        }),
      ],
    }),
  );
});
it("prepares notebook content, previews it and requires confirmation before publishing", async () => {
  const publish = vi.fn(),
    prepare = vi
      .fn()
      .mockResolvedValue({
        id: "draft",
        title: "新的课程",
        sections: 1,
        resources: 0,
        structureChanged: true,
        items: [
          {
            id: "chapter",
            title: "第一章",
            kind: "note",
            content: "# 概念\n\n保留章节正文。",
          },
        ],
      });
  render(<NotebookPublishing onPrepare={prepare} onPublish={publish} />);
  fireEvent.change(screen.getByLabelText("资料来源目录"), {
    target: { value: "课程资料" },
  });
  fireEvent.click(screen.getByRole("button", { name: "检查并预览" }));
  await screen.findByRole("heading", { name: "概念" });
  fireEvent.click(screen.getByRole("button", { name: "确认发布" }));
  expect(publish).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "确认" }));
  await waitFor(() => expect(publish).toHaveBeenCalledWith("draft", undefined));
});
it("invalidates a notebook preview after changing its source", async () => {
  render(
    <NotebookPublishing
      onPrepare={async () => ({
        id: "draft",
        title: "待发布课程",
        sections: 0,
        resources: 0,
        structureChanged: false,
        items: [],
      })}
      onPublish={() => {}}
    />,
  );
  fireEvent.change(screen.getByLabelText("资料来源目录"), {
    target: { value: "来源一" },
  });
  fireEvent.click(screen.getByRole("button", { name: "检查并预览" }));
  await screen.findByRole("heading", { name: "待发布课程" });
  fireEvent.change(screen.getByLabelText("资料来源目录"), {
    target: { value: "来源二" },
  });
  expect(
    screen.queryByRole("heading", { name: "待发布课程" }),
  ).not.toBeInTheDocument();
});
it("supports settings tabs with a keyboard and an animated active indicator", () => {
  function Example() {
    const [value, setValue] = useState("a");
    return (
      <SettingsTabs
        label="内容"
        value={value}
        onChange={setValue}
        items={[
          { id: "a", label: "用户" },
          { id: "b", label: "用户组" },
        ]}
      />
    );
  }
  const view = render(<Example />);
  fireEvent.keyDown(screen.getByRole("tab", { name: "用户" }), {
    key: "ArrowRight",
  });
  expect(screen.getByRole("tab", { name: "用户组" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  expect(
    view.container.querySelectorAll(".fp-settings-tab-indicator"),
  ).toHaveLength(1);
});
it("dismisses an external-anchor panel on outside pointer and Escape", async () => {
  function Example() {
    const anchor = useRef<HTMLButtonElement>(null),
      [open, setOpen] = useState(false);
    return (
      <>
        <button ref={anchor} onClick={() => setOpen(true)}>
          打开
        </button>
        <button>外部</button>
        <AnchoredPanel
          anchor={anchor}
          open={open}
          onClose={() => setOpen(false)}
          label="阅读操作"
        >
          <button>继续</button>
        </AnchoredPanel>
      </>
    );
  }
  render(<Example />);
  fireEvent.click(screen.getByRole("button", { name: "打开" }));
  await screen.findByRole("dialog");
  fireEvent.pointerDown(screen.getByRole("button", { name: "外部" }));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "打开" }));
  fireEvent.keyDown(document, { key: "Escape" });
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "打开" })).toHaveFocus();
});
it("preserves safe inline formatting, heading links and merged table math", () => {
  const view = render(
    <MarkdownContent
      markdown={
        '## 课堂记录\n\n## 课堂记录\n\n==重点== <font color="#b85e00">例子</font>\n\n<table><tr><td colspan="2">$x^2$</td></tr></table>\n\n<span style="background-image:url(https://example.com/x);position:fixed">文字</span><script>alert(1)</script>'
      }
    />,
  );
  const headings = screen.getAllByRole("heading", { name: "课堂记录" });
  expect(headings.map((h) => h.id)).toEqual(["课堂记录", "课堂记录-2"]);
  expect(view.container.querySelector("mark")).toHaveTextContent("重点");
  expect(view.container.querySelector("td")).toHaveAttribute("colspan", "2");
  expect(view.container.querySelector("td .katex")).toBeTruthy();
  expect(view.container.querySelector("script")).toBeNull();
  expect(view.container.innerHTML).not.toContain("background-image");
});
it("keeps directive title and sibling attributes independent", () => {
  render(
    <MarkdownContent
      markdown={
        ':::historymap{title="事件地点" points="南京:60:60,北京:50:25"}\n:::'
      }
    />,
  );
  expect(screen.getByRole("button", { name: /南京/ })).toBeInTheDocument();
});
it("normalizes web addresses and excludes executable URL schemes", () => {
  expect(normalizeBrowserUrl("fiveplus.one")).toBe("https://fiveplus.one/");
  expect(normalizeBrowserUrl("javascript:alert(1)")).toBe("");
  expect(normalizeBrowserUrl("file:///private")).toBe("");
});
it("keeps the release notice open while pending changes block refresh", async () => {
  const refresh = vi.fn();
  render(
    <ReleaseNotice
      available
      beforeRefresh={async () => false}
      onRefresh={refresh}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: "立即更新" }));
  expect(await screen.findByRole("status")).toHaveTextContent(
    "请先保存当前内容",
  );
  expect(refresh).not.toHaveBeenCalled();
});

it("imports a batch of skills atomically and saves their complete content", async () => {
 const save=vi.fn(), view=render(<SkillsWorkspace skills={[]} onSave={save}/>);
 const file=(name:string,text:string)=>Object.assign(new File([text],name,{type:'text/markdown'}),{text:async()=>text});
 const input=view.container.querySelector('input[type="file"]')!;
 fireEvent.change(input,{target:{files:[file('复习.md','---\nname: 课程复习\ndescription: 检验理解\n---\n用例子解释。'),file('说明.txt','不应被导入')]}});
 await screen.findByRole('alert');expect(screen.queryByRole('button',{name:/课程复习 按需/})).toBeNull();
 fireEvent.change(input,{target:{files:[file('复习.md','---\nname: 课程复习\ndescription: 检验理解\n---\n用例子解释。')]}});
 await screen.findByDisplayValue('课程复习');fireEvent.click(screen.getByRole('button',{name:'保存更改'}));
 await waitFor(()=>expect(save).toHaveBeenCalledWith([expect.objectContaining({name:'课程复习',description:'检验理解',content:'用例子解释。'})]));
});

it("keeps protected accounts available while allowing profile edits",()=>{
 render(<DirectoryWorkspace users={[{sub:'owner',name:'课程负责人'}]} groups={[]} protectedUserIds={['owner']} onSaveUser={()=>{}} onSaveGroup={()=>{}} onDeleteGroup={()=>{}}/>);
 fireEvent.click(screen.getByRole('button',{name:/课程负责人 owner 管理/}));expect(screen.getByRole('switch',{name:'停用此用户'})).toBeDisabled();expect(screen.getByLabelText('显示名称')).toBeEnabled();
});
