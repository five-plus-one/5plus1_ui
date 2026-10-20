import { useCallback, useState } from "react";
import * as U from "./lib";
export const patternDefinitions: Record<
  string,
  [string, string, string, string]
> = {
  DirectiveFields: [
    "卡片内容设置",
    "业务模式",
    "编辑媒体、图片、函数与记忆卡的内容属性。",
    "name；value；onChange；disabled?",
  ],
  ShareAccessPanel: [
    "分享协作面板",
    "账户管理",
    "搜索成员、设置权限与管理分享链接。",
    "access；search；onAddMember；link；permissionSummary?",
  ],
  ChatPreferencesPanel: [
    "对话偏好",
    "AI 对话",
    "选择模型、思考方式与联网能力。",
    "models；modelId；onModelChange；thinking；onThinkingChange；webEnabled；onWebChange",
  ],
  ResourceWorkspace: [
    "资料工作区",
    "业务模式",
    "在资源目录与文档预览之间切换。",
    "explorer；preview；previewTitle?；actions?",
  ],
  RecycleBin: [
    "回收站",
    "业务模式",
    "选择资料，恢复或确认永久删除。",
    "items；selectedIds；onSelectionChange；onRestore；onDelete",
  ],
  ReviewDashboard: [
    "复习计划",
    "业务模式",
    "按学习状态选择记录，开始复习。",
    "items；onReview；onPreview；loading?",
  ],
  QuizWorkspace: [
    "答题工作区",
    "业务模式",
    "切换题目并确认提交答题。",
    "title；items；activeId；onNavigate；onSubmit；children",
  ],
  SelectionActions: [
    "选区操作",
    "业务模式",
    "对所选文字执行相关操作。",
    "items: {id,label,onSelect,disabled?}[]",
  ],
  TaskProgress: [
    "任务进度",
    "反馈",
    "查看任务进度和结果，按需取消。",
    "title；detail?；value?；onCancel?",
  ],
  WorkspaceEmpty: [
    "工作区引导",
    "反馈",
    "选择资料或开始新的学习任务。",
    "title?；description?；actions?",
  ],
  RunWorkspace: [
    "助手工作区",
    "AI 对话",
    "查看任务内容、资料与工作记录。",
    "title；status?；trace?；children；actions?",
  ],
  RecordingPlayback: [
    "操作回放",
    "业务模式",
    "控制回放进度并跳转关键步骤。",
    "title；frames；time；duration；playing；onTimeChange；onPlayingChange；children",
  ],
  RecallContent: [
    "挖空回忆",
    "业务模式",
    "逐项揭晓重点，保持正文格式。",
    "children；mode?",
  ],
  HistoryLocationMap: [
    "历史地图",
    "业务模式",
    "查看地点和事件的位置分布。",
    "title?；points；caption?；onSelect?",
  ],
  ReadingTimeline: [
    "正文时间轴",
    "业务模式",
    "按顺序阅读事件与时间。",
    "title?；children",
  ],
  AccountLayout: [
    "账户布局",
    "账户管理",
    "在账户功能之间切换，查看个人资料。",
    "title；navigation；activeId；onNavigate；children",
  ],
  LoginForm: [
    "登录表单",
    "账户管理",
    "使用账号登录，保留重试所需的输入。",
    "onLogin；heading?；description?；alternate?",
  ],
  UserProfile: [
    "用户资料",
    "账户管理",
    "查看用户身份、联系方式及资料。",
    "name；details；avatarUrl?；description?；actions?",
  ],
  CreditAdjustment: [
    "积分调整",
    "账户管理",
    "填写调整原因，确认积分增减。",
    "name；balance；onSubmit",
  ],
  InvitationList: [
    "协作邀请",
    "账户管理",
    "查看并接受或婉拒协作邀请。",
    "items；onRespond；loading?；error?",
  ],
  DirectoryPicker: [
    "目录选择",
    "业务模式",
    "搜索目录并确认保存位置。",
    "items；value；onChange；onConfirm?",
  ],
  PlanPicker: [
    "方案选择",
    "账户管理",
    "查看方案的价格、权益与使用状态。",
    "plans；onSelect",
  ],
  FloatingWindow: [
    "浮动窗口",
    "业务模式",
    "移动、缩放和收起工作窗口。",
    "title；geometry；onGeometryChange；onClose；children",
  ],
  MarkdownContent: [
    "Markdown 阅读",
    "业务模式",
    "阅读公式、表格、图表与语义卡片。",
    "markdown；renderDirective?；resolveResourceUrl?；onOpenLink?",
  ],
  ShortcutSettings: [
    "快捷键设置",
    "账户管理",
    "查找操作、录入快捷键并检查冲突。",
    "items；onChange；onReset?",
  ],
  BrowserSurface: [
    "网页浏览面板",
    "业务模式",
    "输入网址并使用前进和后退。",
    "url；onNavigate；onBack?；onForward?；children",
  ],
  ImportPanel: [
    "资料导入",
    "业务模式",
    "选择或拖入资料，查看导入进度与结果。",
    "onImport；accept?；multiple?；children?",
  ],
  AudioPlayer: [
    "音频播放器",
    "业务模式",
    "播放录音，调整进度和音量。",
    "src；title?；resolveSource?；onTimeUpdate?",
  ],
  WorkspaceTabs: [
    "工作区标签栏",
    "导航",
    "切换文档、拖动排序和移动到分屏。",
    "tabs；activeId；onSelect；onClose；onMove?；paneId?",
  ],
  SearchResults: [
    "内容搜索",
    "业务模式",
    "搜索笔记、章节与资料，并跳转到匹配内容。",
    "query；onQueryChange；onSearch(query,signal)；onOpen",
  ],
  VersionHistory: [
    "版本历史",
    "业务模式",
    "比较笔记历史，确认后恢复到选定版本。",
    "versions；selectedId；onSelect；onRestore；loading?",
  ],
  VersionDiff: [
    "版本比较",
    "业务模式",
    "逐行查看内容的保留、新增和删除。",
    "lines: {kind,text}[]",
  ],
  SaveConflict: [
    "笔记冲突处理",
    "业务模式",
    "比较两份修改，选择要继续使用的内容。",
    "local；remote；onResolve",
  ],
  BacklinksPanel: [
    "关联笔记",
    "业务模式",
    "查看引用当前内容的其他笔记。",
    "items；onOpen；loading?",
  ],
  ImagePasteOptions: [
    "图片添加方式",
    "业务模式",
    "选择保留图片或识别文字与公式。",
    "previewUrl；onChoose；onCancel；busy?；error?",
  ],
  EventCard: [
    "事件卡片",
    "业务模式",
    "展开查看事件的时间与详情。",
    "title；date?；children；defaultOpen?",
  ],
  Figure: [
    "正文插图",
    "业务模式",
    "呈现有标题、来源和查看入口的插图。",
    "src；alt；caption?；credit?；onOpen?",
  ],
  MemoryCard: [
    "记忆卡片",
    "业务模式",
    "揭晓答案并记录掌握程度。",
    "question；answer；revealed；onReveal；onGrade?",
  ],
  HistoryMap: [
    "历史脉络",
    "业务模式",
    "沿时间顺序探索事件及关联。",
    "events；selectedId；onSelect",
  ],
  LearningAnimation: [
    "学习动画",
    "业务模式",
    "观看演示并获取动画源文件。",
    "title；children；sourceUrl?；caption?",
  ],
  NoteLink: [
    "笔记链接",
    "业务模式",
    "从正文打开相关笔记。",
    "title；detail?；onOpen",
  ],
  VennDiagram: [
    "集合关系",
    "业务模式",
    "比较两个集合与交集。",
    "leftLabel；rightLabel；leftCount；rightCount；intersection；total?",
  ],
  ManagementTable: [
    "管理列表",
    "账户管理",
    "查看记录，执行操作并保留失败后的重试入口。",
    "title；items；columns；actions?；loading?；error?",
  ],
  LedgerView: [
    "收支明细",
    "账户管理",
    "按时间查看积分变动与余额。",
    "entries；loading?；error?",
  ],
  CreditsOverview: [
    "积分概览",
    "账户管理",
    "查看可用与使用中的积分。",
    "balance；reserved?；onTopUp?；children?",
  ],
  CapacityOverview: [
    "容量概览",
    "账户管理",
    "查看存储与使用额度。",
    "items；onManage?",
  ],
  PermissionSummary: [
    "权限来源",
    "账户管理",
    "了解权限来自上级目录还是单独设置。",
    "items；canManage?；onManage?",
  ],
  SettingsForm: [
    "设置表单",
    "账户管理",
    "修改设置，保留失败后的输入。",
    "title；fields；onChange；onSave",
  ],
  SetupWizard: [
    "设置向导",
    "业务模式",
    "按步骤完成初始设置。",
    "steps；step；onStepChange；onComplete",
  ],
  ProductNavigation: [
    "产品导航",
    "导航",
    "在产品工作区与功能之间切换。",
    "items；value；onChange；label?",
  ],
  Bookshelf: [
    "笔记书架",
    "业务模式",
    "搜索笔记本，查看进度并继续学习。",
    "items；onOpen；actions?；loading?；onCreate?",
  ],
  MobileTopBar: [
    "移动顶部栏",
    "导航",
    "展示当前页面并返回上一层。",
    "title；onBack?；actions?",
  ],
  MessageContentView: [
    "对话内容分区",
    "AI 对话",
    "展开思考、工作记录与来源。",
    "sections；actions?",
  ],
  ArtifactCard: [
    "成果入口",
    "AI 对话",
    "从对话打开文档或交互内容。",
    "title；description?；kind?；onOpen",
  ],
  ArtifactPreview: [
    "成果预览",
    "AI 对话",
    "查看生成内容，下载或保存到资料。",
    "title；children；onSave?；onDownload?；loading?；error?",
  ],
  SkillsPanel: [
    "助手能力",
    "AI 对话",
    "选择学习助手可使用的能力。",
    "items；onToggle",
  ],
  GraphView: [
    "笔记关系图",
    "业务模式",
    "查看笔记之间的联系并选择关联内容。",
    "nodes；edges；selectedId；onSelect",
  ],
  CanvasWorkbench: [
    "画布与实验工作台",
    "业务模式",
    "操作画布、调整参数与编辑源码。",
    "title；children；tools?；inspector?；source?；onRun?；onSave?",
  ],
  ClassroomTimeline: [
    "课堂时间轴",
    "业务模式",
    "跳转课堂章节并在当前时间记笔记。",
    "chapters；currentTime；onSeek；onAddNote?",
  ],
  LectureDock: [
    "课堂播放面板",
    "业务模式",
    "连续展开和收起当前播放内容。",
    "title；children；collapsed；onCollapsedChange；onClose?",
  ],
  QuizScoring: [
    "答题评分",
    "业务模式",
    "查看分项得分并完成主观题自评。",
    "items；onScoreChange；onComplete?",
  ],
  QuizSummary: [
    "练习总结",
    "业务模式",
    "查看本次成绩并继续复盘。",
    "correct；total；score；maximum；onReview；onRetry?",
  ],
};
const art =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="420" height="240"%3E%3Crect width="420" height="240" fill="%23f2eee8"/%3E%3Cpath d="M60 180L210 50L360 180Z" fill="none" stroke="%23b85e00" stroke-width="3"/%3E%3C/svg%3E';
const initialTabs = [
  { id: "reading", title: "阅读与理解", dirty: true },
  { id: "notes", title: "课堂笔记" },
  { id: "exercise", title: "章节练习" },
];
const nodes = [
  { id: "a", label: "向量空间" },
  { id: "b", label: "线性映射" },
  { id: "c", label: "矩阵" },
];
export function PatternDemo({
  name,
  notify,
}: {
  name: string;
  notify: (message: string) => void;
}) {
  const [shareMembers, setShareMembers] = useState<U.AccessMember[]>([]);
  const [linkRole, setLinkRole] = useState("read");
  const [attributes, setAttributes] = useState('src="/samples/reading.wav"');
  const [windowOpen, setWindowOpen] = useState(true);
  const [geometry, setGeometry] = useState({
    x: 16,
    y: 16,
    width: 300,
    height: 280,
  });
  const [active, setActive] = useState("reading"),
    [tabs, setTabs] = useState(initialTabs),
    [query, setQuery] = useState(""),
    [version, setVersion] = useState("latest"),
    [revealed, setRevealed] = useState(false),
    [selected, setSelected] = useState("a"),
    [step, setStep] = useState(0),
    [collapsed, setCollapsed] = useState(false),
    [time, setTime] = useState(0),
    [score, setScore] = useState(3),
    [source, setSource] = useState("flowchart LR\n  阅读 --> 理解 --> 应用"),
    [setting, setSetting] = useState("课栈笔记"),
    [enabled, setEnabled] = useState(true);
  const search = useCallback(async (q: string, signal: AbortSignal) => {
    if (signal.aborted) return [];
    return [
      {
        id: "reading",
        title: "阅读与理解",
        path: "线性代数 / 第一章",
        excerpt: "把资料变成自己的认识。",
      },
      { id: "notes", title: "课堂笔记", path: "我的笔记" },
    ].filter((item) => (item.title + item.excerpt).includes(q));
  }, []);
  const done = () => notify("已保存");
  const content = (
    <div className="fp-pattern-sample">
      <h3>从阅读到理解</h3>
      <p>用自己的话解释一个概念，再用例子检验理解。</p>
    </div>
  );
  const demos: Record<string, () => React.ReactNode> = {
    DirectiveFields: () => (
      <U.DirectiveFields
        name="audio"
        value={attributes}
        onChange={setAttributes}
      />
    ),
    ShareAccessPanel: () => (
      <U.ShareAccessPanel
        access={{
          members: shareMembers,
          roles: [
            { value: "read", label: "可以阅读" },
            { value: "edit", label: "可以编辑" },
          ],
          canManage: true,
          onRemove: (id) =>
            setShareMembers((items) => items.filter((item) => item.id !== id)),
          onRoleChange: (id, role) =>
            setShareMembers((items) =>
              items.map((item) => (item.id === id ? { ...item, role } : item)),
            ),
        }}
        search={{
          onSearch: async (query) =>
            query
              ? [{ id: "chen", name: "陈同学", detail: "chen@example.com" }]
              : [],
        }}
        onAddMember={(member) =>
          setShareMembers((items) => [...items, { ...member, role: "read" }])
        }
        link={{
          enabled,
          onEnabledChange: setEnabled,
          access: linkRole,
          onAccessChange: setLinkRole,
          url: "https://fiveplus.one/share/notes",
        }}
      />
    ),
    ChatPreferencesPanel: () => (
      <U.ChatPreferencesPanel
        models={[
          {
            name: "通用模型",
            models: [
              { id: "a", label: "快速版" },
              { id: "b", label: "深度版" },
            ],
          },
        ]}
        modelId={selected}
        onModelChange={setSelected}
        thinking={version === "latest" ? "auto" : version}
        thinkingOptions={[
          { value: "auto", label: "自动" },
          { value: "deep", label: "深入思考" },
        ]}
        onThinkingChange={setVersion}
        webEnabled={enabled}
        onWebChange={setEnabled}
      />
    ),
    ResourceWorkspace: () => (
      <U.ResourceWorkspace
        explorer={{
          items: [
            { id: "a", name: "学习笔记", kind: "file" },
            { id: "b", name: "章节回顾", kind: "file" },
          ],
          selectedIds: [selected],
          onSelectionChange: (ids) => setSelected(ids[0] || ""),
          onFolderChange: () => {},
          onOpen: (item) => setSelected(item.id),
        }}
        preview={
          <U.MarkdownContent
            markdown={
              selected === "b"
                ? "# 章节回顾\n\n回顾今天学到的内容。"
                : "# 学习笔记\n\n把资料变成自己的理解。"
            }
          />
        }
      />
    ),
    RecycleBin: () => (
      <U.RecycleBin
        items={
          enabled
            ? [
                {
                  id: "a",
                  name: "课堂草稿.md",
                  originalPath: "我的笔记 / 草稿",
                  deletedAt: "今天",
                },
              ]
            : []
        }
        selectedIds={revealed ? ["a"] : []}
        onSelectionChange={(ids) => setRevealed(ids.length > 0)}
        onRestore={() => {
          setEnabled(false);
          setRevealed(false);
          notify("资料已恢复");
        }}
        onDelete={() => {
          setEnabled(false);
          setRevealed(false);
          notify("资料已删除");
        }}
      />
    ),
    ReviewDashboard: () => (
      <U.ReviewDashboard
        items={[
          {
            id: "a",
            title: "线性映射",
            due: "今天",
            status: "review",
            subject: "线性代数",
          },
          { id: "b", title: "矩阵运算", due: "今天", status: "learning" },
        ]}
        onReview={() => notify("开始复习")}
        onPreview={() => notify("已打开学习记录")}
      />
    ),
    QuizWorkspace: () => (
      <U.QuizWorkspace
        title="章节练习"
        items={[
          { id: "a", label: "1", answered: true },
          { id: "b", label: "2", answered: false },
        ]}
        activeId={selected}
        onNavigate={setSelected}
        onSubmit={() => notify("已提交答题")}
      >
        {selected === "a" ? (
          <p>第一题：解释线性映射的含义。</p>
        ) : (
          <p>第二题：写出一个矩阵的例子。</p>
        )}
      </U.QuizWorkspace>
    ),
    SelectionActions: () => (
      <U.SelectionActions
        items={[
          {
            id: "explain",
            label: "解释",
            onSelect: () => notify("正在整理解释"),
          },
          {
            id: "note",
            label: "添加到笔记",
            onSelect: () => notify("已添加到笔记"),
          },
        ]}
      />
    ),
    TaskProgress: () => (
      <U.TaskProgress
        title="正在整理资料"
        detail="已完成 3 份资料。"
        value={60}
        onCancel={() => notify("已取消整理")}
      />
    ),
    WorkspaceEmpty: () => (
      <U.WorkspaceEmpty
        actions={
          <U.Button onClick={() => notify("选择要添加的资料")}>
            添加资料
          </U.Button>
        }
      />
    ),
    RunWorkspace: () => (
      <U.RunWorkspace
        title="章节复习"
        status="正在整理章节要点"
        trace={
          <U.MessageContentView
            sections={[
              {
                id: "read",
                label: "阅读资料",
                status: "done",
                content: <p>已整理课堂重点。</p>,
              },
            ]}
          />
        }
      >
        {content}
      </U.RunWorkspace>
    ),
    RecordingPlayback: () => (
      <U.RecordingPlayback
        title="推导回放"
        frames={[
          { time: 0, label: "开始" },
          { time: 10, label: "推导" },
          { time: 20, label: "结论" },
        ]}
        duration={30}
        time={time}
        playing={enabled}
        onPlayingChange={setEnabled}
        onTimeChange={setTime}
      >
        {content}
        <p>当前：{Math.round(time)} 秒</p>
      </U.RecordingPlayback>
    ),
    RecallContent: () => (
      <U.RecallContent>
        <p>
          线性映射保持<strong>向量加法</strong>和<strong>数乘</strong>。
        </p>
      </U.RecallContent>
    ),
    HistoryLocationMap: () => (
      <U.HistoryLocationMap
        points={[
          { name: "南京", x: 60, y: 60 },
          { name: "北京", x: 55, y: 25 },
        ]}
        caption="位置为示意。"
        onSelect={(point) => notify(point.name)}
      />
    ),
    ReadingTimeline: () => (
      <U.ReadingTimeline title="学习过程">
        <ul>
          <li>
            <strong>第一周</strong> 阅读概念
          </li>
          <li>
            <strong>第二周</strong> 练习与回顾
          </li>
        </ul>
      </U.ReadingTimeline>
    ),
    AccountLayout: () => (
      <U.AccountLayout
        title="个人账户"
        navigation={[
          { id: "reading", label: "个人资料" },
          { id: "notes", label: "我的积分" },
        ]}
        activeId={active}
        onNavigate={setActive}
      >
        {active === "reading" ? (
          <U.UserProfile
            name="五加一"
            details={[{ label: "身份", value: "学习者" }]}
          />
        ) : (
          <U.CreditsOverview balance={120} />
        )}
      </U.AccountLayout>
    ),
    LoginForm: () => <U.LoginForm onLogin={() => notify("登录信息已提交")} />,
    UserProfile: () => (
      <U.UserProfile
        name="五加一"
        description="记录学习与创造"
        details={[
          { label: "邮箱", value: "study@example.com" },
          { label: "身份", value: "学习者" },
        ]}
      />
    ),
    CreditAdjustment: () => (
      <U.CreditAdjustment
        name="陈同学"
        balance={120}
        onSubmit={() => notify("积分已调整")}
      />
    ),
    InvitationList: () => (
      <U.InvitationList
        items={
          enabled
            ? [
                {
                  id: "course",
                  name: "线性代数笔记",
                  from: "陈同学",
                  role: "一起编辑",
                },
              ]
            : []
        }
        onRespond={(_id, accept) => {
          setEnabled(false);
          notify(accept ? "已接受邀请" : "已婉拒邀请");
        }}
      />
    ),
    DirectoryPicker: () => (
      <U.DirectoryPicker
        items={[
          { id: "a", name: "我的笔记" },
          { id: "b", name: "课堂整理", parentId: "a" },
        ]}
        value={selected}
        onChange={setSelected}
        onConfirm={() => notify("已选择目录")}
      />
    ),
    PlanPicker: () => (
      <U.PlanPicker
        plans={[
          {
            id: "basic",
            name: "基础方案",
            price: "免费",
            description: "开始整理自己的知识。",
            features: ["个人笔记", "资料管理"],
            current: true,
          },
          {
            id: "team",
            name: "协作方案",
            price: "按需购买",
            description: "与同学一起整理。",
            features: ["共同编辑", "更多存储空间"],
          },
        ]}
        onSelect={() => notify("已选择方案")}
      />
    ),
    FloatingWindow: () => (
      <div style={{ position: "relative", height: 400, overflow: "hidden" }}>
        {windowOpen ? (
          <U.FloatingWindow
            contained
            title="阅读笔记"
            geometry={geometry}
            onGeometryChange={setGeometry}
            onClose={() => setWindowOpen(false)}
          >
            {content}
          </U.FloatingWindow>
        ) : (
          <U.Button onClick={() => setWindowOpen(true)}>打开笔记</U.Button>
        )}
      </div>
    ),
    MarkdownContent: () => (
      <U.MarkdownContent
        markdown={
          '## 从阅读到理解\n\n先用自己的话解释，再用 $x^2+y^2$ 检验。\n\n:::concept{term="线性映射"}\n保持向量加法与数乘的映射。\n:::\n\n| 阶段 | 目标 |\n| --- | --- |\n| 阅读 | 找到概念 |\n| 练习 | 检查理解 |\n\n:::event{title="课堂回顾" date="今天"}\n讨论了一个重要的例子。\n:::'
        }
      />
    ),
    ShortcutSettings: () => (
      <U.ShortcutSettings
        items={[
          {
            id: "search",
            label: "搜索笔记",
            keys: setting.includes("+") ? setting : "Ctrl+k",
            enabled,
          },
        ]}
        onChange={(_id, keys, value) => {
          setSetting(keys);
          setEnabled(value);
        }}
        onReset={() => {
          setSetting("Ctrl+k");
          setEnabled(true);
        }}
      />
    ),
    BrowserSurface: () => (
      <U.BrowserSurface
        url={setting.startsWith("https:") ? setting : "https://fiveplus.one/"}
        onNavigate={setSetting}
      >
        {content}
      </U.BrowserSurface>
    ),
    ImportPanel: () => (
      <U.ImportPanel
        accept=".md,.pdf,.docx,.pptx"
        onImport={(files) => notify(`已添加 ${files.length} 份资料`)}
      />
    ),
    AudioPlayer: () => (
      <U.AudioPlayer src="/samples/reading.wav" title="音频示例" />
    ),
    WorkspaceTabs: () => (
      <U.WorkspaceTabs
        tabs={tabs}
        activeId={active}
        onSelect={setActive}
        onClose={(id) => {
          setTabs((t) => t.filter((i) => i.id !== id));
          if (active === id) setActive(tabs.find((t) => t.id !== id)?.id || "");
        }}
        onSplit={() => notify("已切换分屏")}
        onMove={(id, _pane, index) =>
          setTabs((list) => {
            const target = list.find((t) => t.id === id);
            if (!target) return list;
            const rest = list.filter((t) => t.id !== id);
            rest.splice(index, 0, target);
            return rest;
          })
        }
      />
    ),
    SearchResults: () => (
      <U.SearchResults
        query={query}
        onQueryChange={setQuery}
        onSearch={search}
        onOpen={(hit) => notify(`打开${hit.title}`)}
      />
    ),
    VersionHistory: () => (
      <U.VersionHistory
        versions={[
          {
            id: "latest",
            label: "今天的笔记",
            date: "今天 10:30",
            preview: content,
          },
          {
            id: "first",
            label: "第一次整理",
            date: "昨天 18:20",
            preview: <p>记录最初的想法。</p>,
          },
        ]}
        selectedId={version}
        onSelect={setVersion}
        onRestore={() => notify("已恢复所选版本")}
      />
    ),
    VersionDiff: () => (
      <U.VersionDiff
        lines={[
          { kind: "same", text: "# 从阅读到理解" },
          { kind: "removed", text: "阅读资料。" },
          { kind: "added", text: "阅读后，用自己的话解释概念。" },
        ]}
      />
    ),
    SaveConflict: () => (
      <U.SaveConflict
        local={<p>我整理的解释与例题。</p>}
        remote={<p>同学补充的课堂重点。</p>}
        onResolve={() => notify("已应用所选内容")}
      />
    ),
    BacklinksPanel: () => (
      <U.BacklinksPanel
        items={[
          {
            id: "1",
            title: "第二章复习",
            excerpt: "用第一章的概念解释线性映射。",
          },
        ]}
        onOpen={() => notify("已打开关联笔记")}
      />
    ),
    ImagePasteOptions: () => (
      <U.ImagePasteOptions
        previewUrl={art}
        onChoose={(mode) =>
          notify(mode === "image" ? "已插入图片" : "正在识别内容")
        }
        onCancel={() => notify("已取消")}
      />
    ),
    EventCard: () => (
      <U.EventCard title="课程回顾" date="10 月 20 日">
        {content}
      </U.EventCard>
    ),
    Figure: () => (
      <U.Figure
        src={art}
        alt="三角形示意图"
        caption="图 1 · 几何关系"
        credit="课堂示意"
        onOpen={() => notify("已打开插图")}
      />
    ),
    MemoryCard: () => (
      <U.MemoryCard
        question="线性映射需要满足什么条件？"
        answer="保持向量的加法与数乘。"
        revealed={revealed}
        onReveal={() => setRevealed(true)}
        onGrade={() => {
          setRevealed(false);
          notify("已记录掌握程度");
        }}
      />
    ),
    HistoryMap: () => (
      <U.HistoryMap
        events={[
          {
            id: "a",
            title: "提出问题",
            date: "第一阶段",
            description: "从实际问题出发。",
            relatedIds: ["b"],
          },
          {
            id: "b",
            title: "建立模型",
            date: "第二阶段",
            description: "用模型解释观察。",
          },
        ]}
        selectedId={selected}
        onSelect={setSelected}
      />
    ),
    LearningAnimation: () => (
      <U.LearningAnimation
        title="几何关系演示"
        caption="拖动或播放演示，观察关系。"
      >
        <U.Figure src={art} alt="几何关系" />
      </U.LearningAnimation>
    ),
    NoteLink: () => (
      <U.NoteLink
        title="线性映射"
        detail="线性代数 · 第二章"
        onOpen={() => notify("已打开笔记")}
      />
    ),
    VennDiagram: () => (
      <U.VennDiagram
        leftLabel="集合 A"
        rightLabel="集合 B"
        leftCount={12}
        rightCount={10}
        intersection={4}
        total={24}
      />
    ),
    ManagementTable: () => (
      <U.ManagementTable
        title="笔记本管理"
        items={[
          { id: "1", name: "线性代数", members: 3 },
          { id: "2", name: "概率论", members: 2 },
        ]}
        columns={[
          { id: "name", label: "名称", render: (i) => i.name },
          { id: "members", label: "成员", render: (i) => `${i.members} 人` },
        ]}
        actions={[
          { id: "manage", label: "管理", run: (i) => notify(`管理${i.name}`) },
        ]}
      />
    ),
    LedgerView: () => (
      <U.LedgerView
        entries={[
          {
            id: "1",
            title: "整理课堂笔记",
            date: "今天 10:30",
            amount: -12,
            balance: 488,
          },
          {
            id: "2",
            title: "补充积分",
            date: "昨天 18:00",
            amount: 500,
            balance: 500,
          },
        ]}
      />
    ),
    CreditsOverview: () => (
      <U.CreditsOverview
        balance={488}
        reserved={12}
        onTopUp={() => notify("打开积分补充")}
      />
    ),
    CapacityOverview: () => (
      <U.CapacityOverview
        items={[
          {
            id: "storage",
            label: "资料空间",
            used: 2.4,
            limit: 10,
            unit: "GB",
          },
          { id: "notes", label: "笔记", used: 32, limit: 100, unit: "篇" },
        ]}
        onManage={() => notify("打开使用情况")}
      />
    ),
    PermissionSummary: () => (
      <U.PermissionSummary
        items={[
          { source: "学习小组", role: "可以编辑", inherited: true },
          { source: "陈同学", role: "可以阅读", inherited: false },
        ]}
        canManage
        onManage={() => notify("打开权限设置")}
      />
    ),
    SettingsForm: () => (
      <U.SettingsForm
        title="笔记本设置"
        fields={[
          {
            id: "name",
            label: "名称",
            value: setting,
            description: "方便自己和同学找到。",
          },
        ]}
        onChange={(_id, value) => setSetting(value)}
        onSave={done}
      />
    ),
    SetupWizard: () => (
      <U.SetupWizard
        steps={[
          {
            id: "name",
            title: "认识你",
            description: "先为学习空间取个名字。",
            content: (
              <U.Input
                aria-label="空间名称"
                value={setting}
                onChange={(e) => setSetting(e.target.value)}
              />
            ),
            canContinue: !!setting.trim(),
          },
          {
            id: "finish",
            title: "准备就绪",
            content: <p>现在可以创建笔记并添加学习资料了。</p>,
          },
        ]}
        step={step}
        onStepChange={setStep}
        onComplete={done}
      />
    ),
    ProductNavigation: () => (
      <U.ProductNavigation
        items={[
          { id: "reading", label: "笔记" },
          { id: "notes", label: "资料" },
          { id: "exercise", label: "复习" },
        ]}
        value={active}
        onChange={setActive}
      />
    ),
    Bookshelf: () => (
      <U.Bookshelf
        items={[
          { id: "1", title: "线性代数", subtitle: "第一学期", progress: 45 },
          { id: "2", title: "概率论", subtitle: "第二学期", progress: 20 },
        ]}
        onOpen={() => notify("打开笔记本")}
        onCreate={() => notify("新建笔记本")}
      />
    ),
    MobileTopBar: () => (
      <U.MobileTopBar
        title="课堂笔记"
        onBack={() => notify("返回资料目录")}
        actions={
          <U.IconButton label="搜索" onClick={() => notify("打开搜索")}>
            ⌕
          </U.IconButton>
        }
      />
    ),
    MessageContentView: () => (
      <U.MessageContentView
        sections={[
          {
            id: "thinking",
            label: "整理思路",
            kind: "thinking",
            content: <p>先对照定义，再检查例题中的条件。</p>,
            status: "done",
          },
          { id: "answer", label: "学习建议", kind: "content", content },
          {
            id: "sources",
            label: "参考资料",
            kind: "source",
            content: (
              <U.NoteLink
                title="第一章课程讲义"
                onOpen={() => notify("打开讲义")}
              />
            ),
          },
        ]}
      />
    ),
    ArtifactCard: () => (
      <U.ArtifactCard
        title="第一章复习提纲"
        description="概念、例题与常见疑问"
        onOpen={() => notify("打开复习提纲")}
      />
    ),
    ArtifactPreview: () => (
      <U.ArtifactPreview
        title="第一章复习提纲"
        onSave={done}
        onDownload={() => notify("正在准备下载")}
      >
        {content}
      </U.ArtifactPreview>
    ),
    SkillsPanel: () => (
      <U.SkillsPanel
        items={[
          {
            id: "review",
            name: "复习整理",
            description: "归纳知识点，生成复习提纲。",
            enabled,
          },
        ]}
        onToggle={(_id, value) => setEnabled(value)}
      />
    ),
    GraphView: () => (
      <U.GraphView
        nodes={nodes}
        edges={[
          { source: "a", target: "b" },
          { source: "b", target: "c" },
        ]}
        selectedId={selected}
        onSelect={setSelected}
      />
    ),
    CanvasWorkbench: () => (
      <U.CanvasWorkbench
        title="几何工作台"
        source={source}
        onSourceChange={setSource}
        onRun={() => notify("已应用修改")}
        onSave={done}
        onReset={() => setSource("flowchart LR\n  阅读 --> 理解")}
        inspector={
          <U.Slider label="缩放" min={50} max={200} defaultValue={100} />
        }
      >
        {
          <U.VennDiagram
            leftLabel="A"
            rightLabel="B"
            leftCount={10}
            rightCount={12}
            intersection={4}
          />
        }
      </U.CanvasWorkbench>
    ),
    ClassroomTimeline: () => (
      <U.ClassroomTimeline
        chapters={[
          { id: "a", title: "回顾概念", time: 0 },
          { id: "b", title: "课堂例题", time: 130 },
          { id: "c", title: "练习讨论", time: 310 },
        ]}
        currentTime={time}
        onSeek={setTime}
        onAddNote={() => notify("已添加当前时间的笔记")}
      />
    ),
    LectureDock: () => (
      <U.LectureDock
        title="线性代数 · 第一讲"
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
      >
        <U.AudioPlayer src="/samples/reading.wav" title="音频示例" />
      </U.LectureDock>
    ),
    QuizScoring: () => (
      <U.QuizScoring
        items={[
          {
            id: "1",
            title: "第一题",
            maximum: 5,
            awarded: score,
            subjective: true,
            detail: <p>根据定义、推导和结论为自己的答案评分。</p>,
          },
        ]}
        onScoreChange={(_id, value) => setScore(value)}
        onComplete={done}
      />
    ),
    QuizSummary: () => (
      <U.QuizSummary
        correct={8}
        total={10}
        score={85}
        maximum={100}
        onReview={() => notify("打开答题复盘")}
        onRetry={() => notify("开始新的练习")}
      />
    ),
  };
  return demos[name]?.() || null;
}
