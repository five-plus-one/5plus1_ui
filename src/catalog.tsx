import React, { useState } from "react";
import * as U from "./lib";
import { ResourceExplorerDemo, ChatComposerDemo, MarkdownEditorDemo, WorkspaceLayoutDemo, ShareAccessDemo, UploadQueueDemo } from './advanced-demos';
import {
  Plus,
  ArrowUpRight,
  Download,
  Settings,
  Search,
  Bell,
  FileText,
  BookOpen,
  MoreHorizontal,
  Heart,
  Copy,
  Check,
  Mail,
  ArrowRight,
  LayoutGrid,
  PanelLeft,
  Sun,
  Moon,
  Sparkles,
} from "lucide-react";
export type Entry = {
  name: string;
  zh: string;
  group: string;
  description: string;
  usage: string;
  api: string;
  code: string;
};
const defs: Record<string, [string, string, string, string]> = {
  ResourceExplorer: ['文件资源管理器','业务模式','浏览文件夹，搜索、排序并以列表或网格管理资料。','items；folderId；onFolderChange；selectedIds；onSelectionChange；onOpen；onAction?'],
  ContextMenu: ['右键菜单','反馈','按当前位置提供文件、空白区域与选中内容的快捷操作。','items；children；label?；disabled?'],
  ChatComposer: ['对话输入框', 'AI 对话', '引用、附件与模型选择，集中在清晰轻巧的输入区。', 'value；onChange；onSend；onStop?；attachments?；onFiles?；tools?；onComposerInsetChange?'],
  MarkdownEditor: ['Markdown 富文本编辑', '业务模式', '文字、公式、表格与资料卡片，在同一篇笔记中编辑。', 'markdown?；documentKey?；onChange?；document?；provider?；onFiles?；resolveResourceUrl?'],
  WorkspaceLayout: ['多栏工作区', '布局', '自由调整目录、内容和讨论区域，保留熟悉的工作节奏。', 'panels: WorkspacePanel[]；ref: WorkspaceLayoutHandle；persistenceKey?；direction?'],
  SelectField: ['选择器', '表单', '统一主题、键盘导航与关闭行为的单项选择。', 'value；onChange；options；label；disabled?'],
  MemberSearch: ['成员搜索', '账户管理', '查找用户或用户组，为资料添加协作成员。', 'onSearch(query,kind,signal)；onPick；excludedIds?；disabled?'],
  ShareLink: ['链接分享', '账户管理', '控制链接访问权限，复制分享地址。', 'enabled；onEnabledChange；url?；access；onAccessChange；onCopy?'],
  AttachmentPicker: ['资料选择', '业务模式', '搜索资料并选择需要添加的附件。', 'items；selectedIds；onChange；onConfirm；onSearch?；onLoadMore?'],
  UploadQueue: ['上传队列', '业务模式', '查看上传与整理进度，重试或取消任务。', 'tasks；onCancel?；onRetry?；onDismiss?'],
  MemberAccess: ['成员与权限', '账户管理', '查看成员、选择访问权限与邀请协作者。', 'members；roles；canManage?；onRoleChange?；onRemove?；onInvite?；busyIds?；error?'],
  Button: [
    "按钮",
    "基础",
    "突出主要行动，区分普通操作与危险操作。",
    "variant: primary | secondary | ghost | danger；size: sm | md | lg；loading: boolean",
  ],
  IconButton: [
    "图标按钮",
    "基础",
    "为紧凑工具栏提供带有可访问名称的操作。",
    "label: string；其余属性继承原生 button",
  ],
  Link: [
    "链接",
    "基础",
    "在段落、列表和帮助说明中跳转到相关内容。",
    "继承原生 a 属性",
  ],
  Badge: [
    "徽标",
    "基础",
    "用文字配合语义颜色说明状态。",
    "tone: neutral | success | warning | error | accent",
  ],
  Chip: [
    "标签",
    "基础",
    "用于筛选、选择或移除已选项目。",
    "selected: boolean；onClick；onRemove",
  ],
  Avatar: [
    "头像",
    "基础",
    "用姓名首字或图片表示用户。",
    "name: string；src?: string；size?: number",
  ],
  AvatarGroup: ["头像组", "基础", "展示共同参与的成员。", "names: string[]"],
  Divider: ["分隔线", "基础", "在同一区域内划分信息分组。", "无必填属性"],
  Kbd: ["快捷键", "基础", "显示可用的键盘组合。", "children: ReactNode"],
  VisuallyHidden: [
    "辅助说明",
    "基础",
    "为读屏软件保留必要的文字说明。",
    "children: ReactNode",
  ],
  Input: [
    "输入框",
    "表单",
    "用于单行文字，配合 Field 显示标签与校验。",
    "继承原生 input 属性",
  ],
  Textarea: [
    "多行输入",
    "表单",
    "填写较长描述、反馈或任务说明。",
    "继承原生 textarea 属性",
  ],
  Field: [
    "表单字段",
    "表单",
    "关联标签、输入控件、说明和错误。",
    "label: string；hint?；error?；children: 单个输入控件",
  ],
  Checkbox: [
    "复选框",
    "表单",
    "选择独立选项或多个项目。",
    "label: string；继承原生 input 属性",
  ],
  Radio: [
    "单选框",
    "表单",
    "在一组选项中作出唯一选择。",
    "label: string；name: string；继承原生 input 属性",
  ],
  Switch: [
    "开关",
    "表单",
    "切换即时生效的二元设置。",
    "label: string；checked: boolean；onChange(boolean)",
  ],
  Select: [
    "选择器",
    "表单",
    "从确定的选项中选择一个。",
    "options: {value,label}[]；继承原生 select 属性",
  ],
  Combobox: [
    "可输入选择",
    "表单",
    "结合输入、筛选与键盘选择候选项。",
    "label；options: string[]；value；onChange(string)",
  ],
  MultiSelect: [
    "多项选择",
    "表单",
    "从一组可见选项中选择多个。",
    "label；options: string[]；value: string[]；onChange(string[])",
  ],
  PasswordInput: [
    "密码输入",
    "表单",
    "允许用户主动查看或隐藏输入内容。",
    "label?；继承原生 input 属性",
  ],
  NumberInput: [
    "数字输入",
    "表单",
    "通过输入或增减按钮调整有界数值。",
    "label；value: number；min?；max?；onChange(number)",
  ],
  Slider: [
    "滑动条",
    "表单",
    "调整连续的数值，保留键盘操作。",
    "label: string；继承原生 range input 属性",
  ],
  DatePicker: [
    "日期输入",
    "表单",
    "使用统一主题的日历选择日期，支持手动输入。",
    "继承原生 input 属性",
  ],
  TimePicker: [
    "时间输入",
    "表单",
    "选择小时与分钟，也可直接输入时间。",
    "继承原生 input 属性",
  ],
  Calendar: [
    "日历",
    "表单",
    "按月浏览并选择日期。",
    "value: YYYY-MM-DD；onChange(string)",
  ],
  ColorPicker: [
    "颜色选择",
    "表单",
    "选择颜色并显示当前色值。",
    "label；value: HEX；onChange(string)",
  ],
  Rating: [
    "评分",
    "表单",
    "收集一到五星的评价。",
    "value: number；onChange(number)",
  ],
  SearchInput: [
    "搜索输入",
    "表单",
    "输入与清除检索关键词。",
    "value；onChange(string)；placeholder?",
  ],
  FileUpload: [
    "文件上传",
    "表单",
    "选择或拖入本地文件，交由应用处理。",
    "onFiles(File[])；accept?；multiple?",
  ],
  Tabs: [
    "标签页",
    "导航",
    "在同级内容间切换，支持方向键。",
    "items: {value,label}[]；value；onChange(string)",
  ],
  SegmentedControl: [
    "分段选择",
    "导航",
    "切换紧密相关的视图或显示模式。",
    "items；value；onChange(string)",
  ],
  Breadcrumbs: [
    "面包屑",
    "导航",
    "表示当前位置与返回上级的路径。",
    "items: {label,href?}[]",
  ],
  Pagination: [
    "分页",
    "导航",
    "浏览分组内容，边界处禁用翻页。",
    "page；total；onChange(number)",
  ],
  Steps: [
    "步骤",
    "导航",
    "说明多阶段任务的当前位置。",
    "items: string[]；current: 从 0 开始",
  ],
  Navigation: [
    "侧栏导航",
    "导航",
    "在产品的主要任务间切换。",
    "items: {value,label,icon?}[]；value；onChange",
  ],
  Tree: [
    "树形目录",
    "导航",
    "分层展开资料或章节。",
    "items: {label,children?: string[]}[]",
  ],
  Dropdown: [
    "操作菜单",
    "导航",
    "收纳次要操作，选择后自动收起。",
    "label；items: {label,onClick,danger?}[]",
  ],
  CommandMenu: [
    "快捷搜索",
    "导航",
    "通过搜索与方向键快速前往目标。",
    "open；onClose；items: {label,onSelect}[]",
  ],
  Alert: [
    "提示",
    "反馈",
    "在相关区域保留用户需要知道的信息。",
    "title；children?；tone: accent | success | warning | error",
  ],
  Banner: [
    "横幅通知",
    "反馈",
    "展示影响当前页面的消息。",
    "children；onClose?",
  ],
  Toast: [
    "轻提示",
    "反馈",
    "展示短暂操作结果，四秒后收起。",
    "message；onClose",
  ],
  Dialog: [
    "对话框",
    "反馈",
    "集中完成一个需要判断的任务。",
    "open；onClose；title；children；footer?",
  ],
  ConfirmDialog: [
    "操作确认",
    "反馈",
    "在移除操作前说明影响并确认。",
    "open；onClose；onConfirm；title；description",
  ],
  Drawer: ["侧边抽屉", "反馈", "保留页面上下文并展示辅助任务。", "同 Dialog"],
  Popover: [
    "弹出信息",
    "反馈",
    "按需展开小范围信息与操作。",
    "label；children",
  ],
  Tooltip: [
    "文字提示",
    "反馈",
    "在悬停或键盘聚焦时补充简短说明。",
    "text；children: 可聚焦控件",
  ],
  Progress: [
    "进度条",
    "反馈",
    "展示可计量任务的实际完成比例。",
    "value: 0–100；label?",
  ],
  Spinner: ["加载指示", "反馈", "表示暂时无法量化的等待。", "size?: number"],
  Skeleton: [
    "骨架屏",
    "反馈",
    "在内容加载前保持主要布局。",
    "width?: CSS width；height?: number",
  ],
  EmptyState: [
    "空状态",
    "反馈",
    "解释当前没有内容，并提供下一步。",
    "title；description；action?",
  ],
  ErrorState: [
    "错误恢复",
    "反馈",
    "解释加载问题并提供重试入口。",
    "title?；description；onRetry",
  ],
  Card: ["卡片", "数据展示", "承载一个完整的信息分组。", "继承 div 属性"],
  Table: [
    "数据表格",
    "数据展示",
    "展示可横向比较的数据。",
    "columns: string[]；rows: ReactNode[][]；caption?",
  ],
  DescriptionList: [
    "详情列表",
    "数据展示",
    "以名称与值展示对象信息。",
    "items: {label,value}[]",
  ],
  Timeline: [
    "时间线",
    "数据展示",
    "按顺序展示事件或处理步骤。",
    "items: {title,description}[]",
  ],
  Stat: [
    "统计数字",
    "数据展示",
    "突出一个重要指标与补充说明。",
    "label；value；detail?",
  ],
  Meter: [
    "用量仪表",
    "数据展示",
    "展示已知范围内的资源占用。",
    "value: number；label",
  ],
  BarChart: [
    "条形图",
    "数据展示",
    "比较不同分类的数值。",
    "items: {label,value}[]；label",
  ],
  Accordion: [
    "折叠面板",
    "数据展示",
    "按需展开常见问题和补充内容。",
    "items: {title,content}[]",
  ],
  CodeBlock: [
    "代码块",
    "数据展示",
    "展示并复制可直接使用的代码。",
    "code: string；language?",
  ],
  ImagePreview: [
    "图片预览",
    "数据展示",
    "点开图片查看较大的预览。",
    "src；alt",
  ],
  NotificationList: [
    "通知列表",
    "数据展示",
    "阅读通知并标记已读。",
    "items: {id,title,detail,read?}[]；onRead(id)",
  ],
  Container: [
    "页面容器",
    "布局",
    "设置适合大多数页面的宽度与边距。",
    "继承 div 属性",
  ],
  Stack: [
    "线性布局",
    "布局",
    "用统一间距组织横向或纵向内容。",
    "gap?: number；direction?: row | column；children",
  ],
  Grid: [
    "响应式网格",
    "布局",
    "根据可用宽度自动调整列数。",
    "minWidth?: number；children",
  ],
  ScrollArea: [
    "滚动区域",
    "布局",
    "在有限空间内阅读较长内容。",
    "height?: number；children",
  ],
  AspectRatio: [
    "比例容器",
    "布局",
    "为媒体保留稳定的宽高比例。",
    "ratio?: number；children",
  ],
  ResizablePanel: [
    "可调分栏",
    "布局",
    "通过拖动、方向键调整两栏宽度。",
    "first: ReactNode；second: ReactNode",
  ],
  PageHeader: [
    "页面标题区",
    "布局",
    "统一页面标题、说明与主操作。",
    "eyebrow?；title；description?；action?",
  ],
  Toolbar: ["工具栏", "布局", "组织作用于当前内容的操作。", "children"],
  Footer: ["页脚", "布局", "展示相关链接与归属信息。", "children"],
  Callout: [
    "阅读重点",
    "业务模式",
    "突出定义、结论与阅读提示。",
    "title；children",
  ],
  Citation: [
    "来源引用",
    "业务模式",
    "展示资料名称与定位信息。",
    "title；detail；onClick?",
  ],
  AIMessage: [
    "AI 消息",
    "业务模式",
    "区分用户提问与 AI 回复。",
    "role: user | assistant；children",
  ],
  AIComposer: [
    "AI 输入",
    "业务模式",
    "输入问题并发送，空白输入不可提交。",
    "onSend(string)；disabled?",
  ],
  TaskStatus: [
    "AI 工作进度",
    "业务模式",
    "显示已完成步骤并允许暂停。",
    "title；steps: string[]；running；onToggle",
  ],
  ResultCard: [
    "生成结果",
    "业务模式",
    "预览生成结果并执行应用操作。",
    "title；description；onApply",
  ],
  FileCard: [
    "资料条目",
    "业务模式",
    "查看资料基本信息并打开。",
    "name；detail；onOpen",
  ],
  MessageList: [
    "消息列表",
    "业务模式",
    "展示对话消息，粘底滚动并处理加载与错误。",
    "messages: Message[]；isLoading?；error?；bottomInset?；renderMessage?",
  ],
  CollapseTransition: [
    "折叠过渡",
    "布局",
    "用高度过渡平滑展开或收起内容。",
    "isOpen: boolean；duration?；easing?",
  ],
  AgentTrace: [
    "推理过程",
    "业务模式",
    "展示 AI 的思考与工具调用步骤，可折叠。",
    "steps: TraceStep[]；streaming?；durationMs?；defaultOpen?",
  ],
  FlipCard: [
    "翻转卡片",
    "学习工具",
    "正面问题、背面答案，点击翻面复习。",
    "front；back；flipped；onFlip；kind?；explanation?",
  ],
  SelectionToolbar: [
    "划词工具栏",
    "业务模式",
    "选中文本后浮动显示操作。",
    "anchor；actions: SelectionAction[]；onClose；preview?",
  ],
  SyncStatus: [
    "同步状态",
    "反馈",
    "显示待同步条目与冲突，允许选择保留版本。",
    "list()；sync()；resolve(key, keepLocal)；intervalMs?",
  ],
  ModelSelector: [
    "模型选择",
    "AI 对话",
    "按分组选择模型，显示上下文长度。",
    "value；onChange；groups: ModelGroup[]；disabled?",
  ],
  TokenDashboard: [
    "积分面板",
    "账户管理",
    "显示余额或免费体验状态，点击查看明细。",
    "balance?；enabled?；isLoading?；onClick?",
  ],
  CollapsibleSection: [
    "可折叠小节",
    "布局",
    "标题行加高度动画，收纳原文、解析等长内容。",
    "label；children；defaultOpen?；meta?",
  ],
  AttachmentGrid: [
    "附件缩略图",
    "表单",
    "以网格展示图片附件，可删除或放大。",
    "items: AttachmentItem[]；onRemove?；onOpen?；size?",
  ],
  QuizQuestion: [
    "答题卡",
    "学习工具",
    "题号、难度与选项；复盘时显示正误和解析。",
    "index；total；prompt；options；selected?；onSelect?；mode?；explanation?",
  ],
  EmbedFallback: [
    "嵌入回退",
    "反馈",
    "页面拒绝内嵌时说明原因并提供打开入口。",
    "url；reason?；onForce?；title?；actionLabel?",
  ],
  MediaLightbox: [
    "图片灯箱",
    "数据展示",
    "全屏查看图片，支持缩放、拖动与键盘操作。",
    "src: string | null；alt?；onClose()",
  ],
  SettingsSection: [
    "设置分组",
    "布局",
    "图标、标题与摘要组成的分组，点击展开。",
    "title；icon；summary?；open；onToggle；children",
  ],
  ChatEmptyState: [
    "对话空状态",
    "AI 对话",
    "还没有对话时介绍助教能力并提供快捷提问。",
    "subjectName?；topic?；prompts?；onPrompt?",
  ],
  SourceFold: [
    "来源列表",
    "AI 对话",
    "可折叠的参考资料，显示标题与站点。",
    "sources: SourceItem[]；label?；cached?；onOpen?",
  ],
  SessionHistory: [
    "会话历史",
    "AI 对话",
    "按类型分组的历史记录，支持选择与删除。",
    "groups: SessionGroup[]；activeId?；onSelect；onCreate?；onDelete?",
  ],
  ContentImage: [
    "正文图片",
    "数据展示",
    "正文中的图片，加载失败时显示说明，可带图注。",
    "src；alt；title?；其余继承 img",
  ],
  WindowChrome: [
    "浮动窗口",
    "布局",
    "带窗口控制的容器：关闭、最小化、全屏与标题。",
    "title；children；onClose；onMinimize?；onFullscreen?；actions?",
  ],
  FilterSelect: [
    "分组筛选",
    "表单",
    "带分组的下拉筛选，适合书架与课程列表。",
    "value；onChange；options?；groups?；label?",
  ],
  AcademicYearSwitcher: [
    "学年切换",
    "导航",
    "先选年级再选学期，紧凑模式适合设置面板。",
    "years；value；onChange；compact?",
  ],
  KeyPoint: [
    "核心要点",
    "学习工具",
    "正文中的重点提示块，带左侧强调线。",
    "label?；children",
  ],
  ConceptCard: [
    "概念卡",
    "学习工具",
    "术语与解释，点击展开查看定义。",
    "term；children；defaultOpen?",
  ],
  CompareTable: [
    "对比表",
    "学习工具",
    "带标题的对照容器，适合并列比较两个概念。",
    "title?；children",
  ],
  CauseEffect: [
    "因果链",
    "学习工具",
    "按因、影响、结果排列的链条。",
    "items?；text?；children?",
  ],
  Derivation: [
    "推导过程",
    "学习工具",
    "默认收起的推导步骤，展开后显示完整过程。",
    "label?；children；defaultOpen?",
  ],
  CitationList: [
    "引用列表",
    "AI 对话",
    "AI 回答引用的笔记列表，可折叠并逐条打开。",
    "hits: CitationHit[]；label?；onOpen?；action?",
  ],
  ApprovalCard: [
    "待批准卡片",
    "AI 对话",
    "需要用户确认才继续的 AI 操作，显示参数与费用。",
    "title?；prompt?；details?；cost?；status?；onApprove；onCancel",
  ],
  TocTree: [
    "标题目录",
    "导航",
    "按层级缩进的页内章节导航，点击滚动定位。",
    "items: TocItemNode[]；activeId?；onSelect?",
  ],
  SiblingFiles: [
    "同级内容",
    "导航",
    "列出同目录条目并标记完成状态，快速切换。",
    "items: SiblingItem[]；activeId?；onSelect；label?",
  ],
  FormulaSteps: [
    "分步公式",
    "学习工具",
    "按步骤展示推导过程，可切换为逐步浏览。",
    "steps: ReactNode[]；interactive?；label?",
  ],
  DistributionChart: [
    "分布图",
    "学习工具",
    "正态、二项、泊松分布的 SVG 示意图，可调参数。",
    "type: normal | binomial | poisson；params?；interactive?",
  ],
  VideoPlayer: [
    "视频播放器",
    "数据展示",
    "自绘控制条的视频播放：进度、音量、全屏与画中画。",
    "src；poster?；title?；startAt?；onTimeUpdate?；onEnded?",
  ],
  ShortcutHelp: [
    "快捷键参考",
    "反馈",
    "按分类展示快捷键组合与说明。",
    "open；onClose；categories: ShortcutCategory[]；title?",
  ],
  BottomNav: [
    "底部导航",
    "导航",
    "移动端底部标签栏，当前项带指示条。",
    "items: BottomNavItem[]；value；onChange；label?",
  ],
  ImageGallery: [
    "图片画廊",
    "数据展示",
    "可横向拖动的图片列表，点击放大查看。",
    "images: GalleryImage[]；label?；size?；meta?",
  ],
  WindowTaskbar: [
    "窗口任务栏",
    "导航",
    "已打开窗口的图标栏，超出宽度自动收纳。",
    "windows: TaskbarWindow[]；onSelect；max?",
  ],
};
export const entries: Entry[] = Object.entries(defs).map(
  ([name, [zh, group, description, api]]) => ({
    name,
    zh,
    group,
    description,
    api,
    usage: description + " 在应用中使用受控状态连接实际内容与操作。",
    code: `import { ${name} } from '@fiveplusone/ui';\nimport '@fiveplusone/ui/styles.css';`,
  }),
);
export const groups = [
  "基础",
  "表单",
  "导航",
  "反馈",
  "数据展示",
  "布局",
  "业务模式",
  "AI 对话",
  "账户管理",
  "学习工具",
];
export function Demo({
  name,
  notify,
}: {
  name: string;
  notify: (s: string) => void;
}) {
  let [on, setOn] = useState(true),
    [text, setText] = useState(""),
    [v, setV] = useState("notes"),
    [n, setN] = useState(3),
    [slider, setSlider] = useState(16),
    [date, setDate] = useState("2026-10-19"),
    [multi, setMulti] = useState(["笔记"]),
    [open, setOpen] = useState(false),
    [read, setRead] = useState(false),
    [flip, setFlip] = useState(false),
    [model, setModel] = useState("fast"),
    [syncVisible, setSyncVisible] = useState(false),
    [quizPick, setQuizPick] = useState<string | null>("a"),
    [quizReview] = useState(true),
    [lightboxOpen, setLightboxOpen] = useState(false),
    [settingsOpen, setSettingsOpen] = useState(true),
    [filterValue, setFilterValue] = useState("all"),
    [academicYear, setAcademicYear] = useState("y2-fall"),
    [approvalStatus, setApprovalStatus] = useState<
      "idle" | "approved" | "running" | "done" | "cancelled" | "error"
    >("idle"),
    [shortcutsOpen, setShortcutsOpen] = useState(false),
    [bottomTab, setBottomTab] = useState("ai"),
    [anchor, setAnchor] = useState<{ x: number; y: number } | null>(null);
  let tabs = [
    { value: "notes", label: "笔记" },
    { value: "files", label: "资料" },
    { value: "history", label: "记录" },
  ];
  let opts = [
    { value: "notes", label: "课程笔记" },
    { value: "files", label: "参考资料" },
  ];
  let nodes = [
    { label: "开始使用", children: ["安装组件库", "设置主题"] },
    { label: "设计基础", children: ["颜色", "字体", "间距"] },
  ];
  let btn = (
    <U.Button
      onClick={(e) => {
        e.preventDefault();
        notify("修改已保存");
      }}
    >
      <Check size={15} />
      保存修改
    </U.Button>
  );
  const examples: Record<string, () => React.ReactNode> = {
    ResourceExplorer: () => <ResourceExplorerDemo />,
    ContextMenu: () => <U.ContextMenu items={[{id:'open',label:'打开',onSelect:()=>notify('已打开')},{id:'view',label:'视图',children:[{id:'list',label:'列表',onSelect:()=>notify('列表视图')},{id:'grid',label:'网格',onSelect:()=>notify('网格视图')}]},{id:'delete',label:'移到回收站',danger:true,separator:true,onSelect:()=>notify('已移到回收站')}]}><div style={{padding:48,border:'1px dashed var(--fp-line)',borderRadius:8}}>右键打开快捷操作，也可以使用 Shift + F10。</div></U.ContextMenu>,
    ChatComposer: () => <ChatComposerDemo />,
    MarkdownEditor: () => <MarkdownEditorDemo />,
    WorkspaceLayout: () => <WorkspaceLayoutDemo />,
    AttachmentPicker: () => <U.AttachmentPicker items={[{id:'guide',name:'设计协作手册.pdf',detail:'PDF · 1.2 MB'},{id:'notes',name:'课堂笔记.md',detail:'Markdown · 最近更新'}]} selectedIds={multi.filter(id => ['guide','notes'].includes(id))} onChange={setMulti} onConfirm={()=>notify('资料已添加')} />,
    UploadQueue: () => <UploadQueueDemo />,
    SelectField: () => <U.SelectField label="排序方式" value={v === 'notes' ? 'recent' : v} onChange={setV} options={[{value:'recent',label:'最近更新'},{value:'name',label:'名称'},{value:'created',label:'创建时间'}]} />,
    MemberSearch: () => <ShareAccessDemo />,
    ShareLink: () => <ShareAccessDemo />,
    MemberAccess: () => <U.MemberAccess members={[{id:'owner',name:'五加一',detail:'创建者',role:'owner',editable:false},{id:'reader',name:'林同学',role:'read'}]} roles={[{value:'owner',label:'所有者'},{value:'read',label:'可以阅读'},{value:'edit',label:'可以编辑'}]} />,
    Button: () => (
      <U.Stack direction="row">
        {btn}
        <U.Button
          variant="secondary"
          onClick={(e) => {
            e.preventDefault();
            notify("已创建新笔记");
          }}
        >
          <Plus size={15} />
          新建笔记
        </U.Button>
        <U.Button
          variant="ghost"
          onClick={(e) => {
            e.preventDefault();
            notify("已取消操作");
          }}
        >
          取消
        </U.Button>
        <U.Button disabled>暂不可用</U.Button>
      </U.Stack>
    ),
    IconButton: () => (
      <U.Stack direction="row">
        <U.IconButton label="设置" onClick={() => notify("偏好设置已打开")}>
          <Settings size={18} />
        </U.IconButton>
        <U.IconButton label="通知" onClick={() => notify("你已阅读全部通知")}>
          <Bell size={18} />
        </U.IconButton>
        <U.IconButton label="更多操作" onClick={() => setOpen(true)}>
          <MoreHorizontal size={18} />
        </U.IconButton>
        <U.Dialog open={open} onClose={() => setOpen(false)} title="更多操作">
          把不常用的操作放在菜单中。
        </U.Dialog>
      </U.Stack>
    ),
    Link: () => (
      <U.Link href="https://fiveplus.one/" target="_blank" rel="noreferrer">
        认识五加一 ↗
      </U.Link>
    ),
    Badge: () => (
      <U.Stack direction="row">
        <U.Badge>草稿</U.Badge>
        <U.Badge tone="success">已完成</U.Badge>
        <U.Badge tone="warning">待确认</U.Badge>
        <U.Badge tone="error">需要处理</U.Badge>
        <U.Badge tone="accent">正在整理</U.Badge>
      </U.Stack>
    ),
    Chip: () => (
      <U.Stack direction="row">
        {["全部", "笔记", "资料"].map((i) => (
          <U.Chip key={i} selected={text === i} onClick={() => setText(i)}>
            {i}
          </U.Chip>
        ))}
      </U.Stack>
    ),
    Avatar: () => (
      <U.Stack direction="row">
        <U.Avatar name="五加一" />
        <U.Avatar name="林" size={44} />
        <U.Avatar name="陈" size={52} />
      </U.Stack>
    ),
    AvatarGroup: () => <U.AvatarGroup names={["五", "林", "陈", "许"]} />,
    Divider: () => (
      <div style={{ width: "100%" }}>
        <span>内容分组</span>
        <U.Divider />
        <span className="fp-muted">下一组内容</span>
      </div>
    ),
    Kbd: () => (
      <U.Stack direction="row">
        <U.Kbd>⌘</U.Kbd>
        <U.Kbd>K</U.Kbd>
        <span className="fp-muted">快速搜索</span>
      </U.Stack>
    ),
    VisuallyHidden: () => (
      <U.Button variant="secondary" onClick={() => notify("资料已打开")}>
        <FileText size={17} />
        <U.VisuallyHidden>打开课程资料</U.VisuallyHidden>
        <span aria-hidden="true">打开课程资料</span>
      </U.Button>
    ),
    Input: () => (
      <U.Input
        placeholder="给笔记取一个名字"
        value={text}
        onChange={(e) => setText(e.target.value)}
        aria-label="笔记名称"
      />
    ),
    Textarea: () => (
      <U.Textarea placeholder="记下此刻的想法…" aria-label="想法" />
    ),
    Field: () => (
      <U.Field label="笔记名称" hint="一个清楚的名字，方便日后找到。">
        <U.Input placeholder="例如：线性代数 · 第二章" />
      </U.Field>
    ),
    Checkbox: () => (
      <U.Checkbox
        label="保存后通知我"
        checked={on}
        onChange={(e) => setOn(e.target.checked)}
      />
    ),
    Radio: () => (
      <U.Stack direction="row">
        <U.Radio name="appearance-demo" label="跟随系统" defaultChecked />
        <U.Radio name="appearance-demo" label="浅色外观" />
      </U.Stack>
    ),
    Switch: () => (
      <U.Switch label="完成后通知我" checked={on} onChange={setOn} />
    ),
    Select: () => (
      <U.Select
        aria-label="资料类型"
        options={opts}
        value={v}
        onChange={(e) => setV(e.target.value)}
      />
    ),
    Combobox: () => (
      <U.Combobox
        label="选择课程"
        options={["线性代数", "高等数学", "大学物理"]}
        value={text}
        onChange={setText}
      />
    ),
    MultiSelect: () => (
      <U.MultiSelect
        label="整理哪些内容"
        options={["笔记", "例题", "知识卡片"]}
        value={multi}
        onChange={setMulti}
      />
    ),
    PasswordInput: () => (
      <U.PasswordInput placeholder="输入密码" defaultValue="fiveplusone" />
    ),
    NumberInput: () => (
      <U.NumberInput
        label="章节数量"
        value={n}
        onChange={setN}
        min={1}
        max={12}
      />
    ),
    Slider: () => (
      <U.Slider
        label={`阅读字号 · ${slider}px`}
        min={12}
        max={24}
        step={0.5}
        value={slider}
        onChange={(e) => setSlider(Number(e.target.value))}
      />
    ),
    DatePicker: () => (
      <U.DatePicker
        aria-label="复习日期"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
    ),
    TimePicker: () => (
      <U.TimePicker aria-label="提醒时间" defaultValue="09:00" />
    ),
    Calendar: () => <U.Calendar value={date} onChange={setDate} />,
    ColorPicker: () => (
      <U.ColorPicker
        label="强调色"
        value={text || "#356348"}
        onChange={setText}
      />
    ),
    Rating: () => <U.Rating value={n} onChange={setN} />,
    SearchInput: () => (
      <U.SearchInput
        value={text}
        onChange={setText}
        placeholder="搜索笔记与资料"
      />
    ),
    FileUpload: () => (
      <U.FileUpload onFiles={(f) => notify(`已选择 ${f.length} 份资料`)} />
    ),
    Tabs: () => (
      <div className="demo-full">
        <U.Tabs items={tabs} value={v} onChange={setV} />
        <p className="fp-muted">
          {v === "notes"
            ? "在这里继续整理你的想法。"
            : v === "files"
              ? "课件、教材与参考资料都在这里。"
              : "每一次修改，都可以回看。"}
        </p>
      </div>
    ),
    SegmentedControl: () => (
      <U.SegmentedControl items={tabs} value={v} onChange={setV} />
    ),
    Breadcrumbs: () => (
      <U.Breadcrumbs
        items={[
          { label: "设计体系", href: "#/" },
          { label: "组件", href: "#/components" },
          { label: "按钮" },
        ]}
      />
    ),
    Pagination: () => <U.Pagination page={n} total={8} onChange={setN} />,
    Steps: () => (
      <U.Steps items={["选择资料", "整理内容", "完成笔记"]} current={1} />
    ),
    Navigation: () => (
      <U.Navigation
        value={v}
        onChange={setV}
        items={[
          { value: "notes", label: "我的笔记", icon: <BookOpen size={17} /> },
          { value: "files", label: "课程资料", icon: <FileText size={17} /> },
        ]}
      />
    ),
    Tree: () => <U.Tree items={nodes} />,
    Dropdown: () => (
      <U.Dropdown
        label="更多操作"
        items={[
          { label: "复制链接", onClick: () => notify("示例链接已准备好") },
          { label: "下载资料", onClick: () => notify("在项目中连接资料下载") },
          {
            label: "移除资料",
            danger: true,
            onClick: () => notify("示例资料已移除"),
          },
        ]}
      />
    ),
    CommandMenu: () => (
      <>
        <U.Button variant="secondary" onClick={() => setOpen(true)}>
          <Search size={15} />
          打开快捷搜索<U.Kbd>⌘ K</U.Kbd>
        </U.Button>
        <U.CommandMenu
          open={open}
          onClose={() => setOpen(false)}
          items={["我的笔记", "课程资料", "外观设置"].map((i) => ({
            label: i,
            onSelect: () => notify(`已选择${i}`),
          }))}
        />
      </>
    ),
    Alert: () => (
      <U.Alert title="笔记已保存" tone="success">
        你可以继续编辑，也可以分享给同学。
      </U.Alert>
    ),
    Banner: () =>
      on ? (
        <U.Banner onClose={() => setOn(false)}>
          欢迎使用五加一设计体系，开始你的下一个创造。
        </U.Banner>
      ) : (
        <U.Button variant="secondary" onClick={() => setOn(true)}>
          显示通知
        </U.Button>
      ),
    Toast: () => (
      <U.Button
        variant="secondary"
        onClick={() => notify("笔记已保存，继续你的创造。")}
      >
        显示轻提示
      </U.Button>
    ),
    Dialog: () => (
      <>
        <U.Button variant="secondary" onClick={() => setOpen(true)}>
          新建笔记
        </U.Button>
        <U.Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="从一个想法开始"
          footer={
            <>
              <U.Button variant="secondary" onClick={() => setOpen(false)}>
                取消
              </U.Button>
              <U.Button
                onClick={() => {
                  notify("笔记已创建");
                  setOpen(false);
                }}
              >
                创建笔记
              </U.Button>
            </>
          }
        >
          <U.Field label="笔记名称">
            <U.Input placeholder="给想法取个名字" />
          </U.Field>
        </U.Dialog>
      </>
    ),
    ConfirmDialog: () => (
      <>
        <U.Button variant="secondary" onClick={() => setOpen(true)}>
          移除示例资料
        </U.Button>
        <U.ConfirmDialog
          open={open}
          onClose={() => setOpen(false)}
          title="移除这份资料？"
          description="资料将从当前笔记中移除，你可以重新添加。"
          onConfirm={() => {
            setOpen(false);
            notify("资料已移除");
          }}
        />
      </>
    ),
    Drawer: () => (
      <>
        <U.Button variant="secondary" onClick={() => setOpen(true)}>
          阅读设置
        </U.Button>
        <U.Drawer
          open={open}
          onClose={() => setOpen(false)}
          title="让阅读更舒适"
        >
          <U.Stack>
            <U.Switch label="专注阅读" checked={on} onChange={setOn} />
            <U.Slider label="文字大小" min={14} max={22} defaultValue={17} />
          </U.Stack>
        </U.Drawer>
      </>
    ),
    Popover: () => (
      <U.Popover label="分享笔记 ↗">
        <strong>一起分享新的发现</strong>
        <p className="fp-muted">复制笔记链接，邀请同学一起阅读。</p>
        <U.Button size="sm" onClick={() => notify("示例链接已准备好")}>
          复制链接
        </U.Button>
      </U.Popover>
    ),
    Tooltip: () => (
      <U.Tooltip text="保存当前修改">
        <U.IconButton label="保存笔记" onClick={() => notify("笔记已保存")}>
          <Download size={19} />
        </U.IconButton>
      </U.Tooltip>
    ),
    Progress: () => <U.Progress label="正在整理章节" value={68} />,
    Spinner: () => (
      <U.Stack direction="row">
        <U.Spinner />
        <span className="fp-muted">正在阅读资料</span>
      </U.Stack>
    ),
    Skeleton: () => (
      <U.Stack>
        <U.Skeleton width="55%" height={20} />
        <U.Skeleton />
        <U.Skeleton width="80%" />
      </U.Stack>
    ),
    EmptyState: () => (
      <U.EmptyState
        title="在这里，积累新的发现"
        description="创建第一篇笔记，让想法慢慢生长。"
        action={
          <U.Button onClick={() => notify("第一篇笔记已创建")}>
            <Plus size={15} />
            创建笔记
          </U.Button>
        }
      />
    ),
    ErrorState: () => (
      <U.ErrorState
        description="连接暂时中断，你的内容已保留。"
        onRetry={() => notify("连接已恢复")}
      />
    ),
    Card: () => (
      <U.Card>
        <U.Badge tone="accent">学习笔记</U.Badge>
        <h3>让知识彼此连接</h3>
        <p className="fp-muted">从零散的想法，到清晰的理解。</p>
        <U.Link href="#/examples">继续阅读 ↗</U.Link>
      </U.Card>
    ),
    Table: () => (
      <U.Table
        columns={["资料名称", "类型", "状态"]}
        rows={[
          [
            "线性代数 · 第二章",
            "课程笔记",
            <U.Badge tone="success">已整理</U.Badge>,
          ],
          ["向量空间与线性变换", "参考资料", <U.Badge>待阅读</U.Badge>],
        ]}
      />
    ),
    DescriptionList: () => (
      <U.DescriptionList
        items={[
          { label: "所属课程", value: "线性代数" },
          { label: "整理日期", value: "2026 年 10 月 19 日" },
          { label: "资料数量", value: "3 份" },
        ]}
      />
    ),
    Timeline: () => (
      <U.Timeline
        items={[
          { title: "阅读课程资料", description: "已整理 3 份资料" },
          { title: "梳理章节结构", description: "提炼 6 个知识点" },
          { title: "补充复习提示", description: "完成笔记整理" },
        ]}
      />
    ),
    Stat: () => (
      <U.Stat
        label="本周学习时间"
        value="12.5 h"
        detail="每天一点，让理解更进一步"
      />
    ),
    Meter: () => <U.Meter label="资料空间" value={36} />,
    BarChart: () => (
      <U.BarChart
        label="本周阅读记录"
        items={[
          { label: "周一", value: 24 },
          { label: "周二", value: 38 },
          { label: "周三", value: 31 },
          { label: "周四", value: 46 },
        ]}
      />
    ),
    Accordion: () => (
      <U.Accordion
        items={[
          {
            title: "如何开始使用组件库？",
            content:
              "在项目中安装组件包，导入基础样式，再按需导入组件。颜色与尺寸可以通过主题变量统一调整。",
          },
          {
            title: "如何切换深浅外观？",
            content:
              "在页面根节点设置 data-theme 属性，组件会使用配套的背景、文字与强调颜色。",
          },
        ]}
      />
    ),
    CodeBlock: () => (
      <U.CodeBlock
        code={"<Button onClick={saveNote}>\n  保存笔记\n</Button>"}
      />
    ),
    ImagePreview: () => (
      <U.ImagePreview src="/brand-scene.svg" alt="五加一的设计花园" />
    ),
    NotificationList: () => (
      <U.NotificationList
        items={[
          {
            id: "1",
            title: "课程笔记已整理",
            detail: "线性代数 · 第二章",
            read,
          },
        ]}
        onRead={() => setRead(true)}
      />
    ),
    Container: () => (
      <U.Container>
        <div className="layout-tile">内容沿着共同的边界展开</div>
      </U.Container>
    ),
    Stack: () => (
      <U.Stack direction="row">
        {["想法", "知识", "创造"].map((t) => (
          <div className="layout-tile" key={t}>
            {t}
          </div>
        ))}
      </U.Stack>
    ),
    Grid: () => (
      <U.Grid minWidth={100}>
        {["01", "02", "03"].map((t) => (
          <div className="layout-tile" key={t}>
            {t}
          </div>
        ))}
      </U.Grid>
    ),
    ScrollArea: () => (
      <U.ScrollArea height={150}>
        {Array.from({ length: 12 }, (_, i) => (
          <p className="fp-muted" key={i}>
            第 {i + 1} 章 · 从阅读走向理解
          </p>
        ))}
      </U.ScrollArea>
    ),
    AspectRatio: () => (
      <U.AspectRatio>
        <div className="ratio-tile">16 : 9</div>
      </U.AspectRatio>
    ),
    ResizablePanel: () => (
      <U.ResizablePanel
        first="章节目录与课程资料"
        second="让阅读拥有合适的空间。拖动分隔线，或聚焦后使用方向键。"
      />
    ),
    PageHeader: () => (
      <U.PageHeader
        eyebrow="MY LIBRARY"
        title="我的笔记"
        description="每个想法，都值得被记住。"
        action={
          <U.Button onClick={() => notify("笔记已创建")}>新建笔记</U.Button>
        }
      />
    ),
    Toolbar: () => (
      <U.Toolbar>
        <U.IconButton label="粗体" onClick={() => notify("已选择粗体")}>
          B
        </U.IconButton>
        <U.IconButton label="斜体" onClick={() => notify("已选择斜体")}>
          <i>I</i>
        </U.IconButton>
        <U.IconButton
          label="插入链接"
          onClick={() => notify("在项目中连接编辑器操作")}
        >
          ↗
        </U.IconButton>
      </U.Toolbar>
    ),
    Footer: () => <U.Footer>五加一 · 让每一次创造都有共同的语言</U.Footer>,
    Callout: () => (
      <U.Callout title="理解，从建立联系开始">
        把新的概念放进已有的知识网络里，找到它的位置与边界。
      </U.Callout>
    ),
    Citation: () => (
      <U.Citation
        title="线性代数 · 向量空间"
        detail="参考资料 · 第二章 · 第 24 页"
        onClick={() => notify("已定位到来源示例")}
      />
    ),
    AIMessage: () => (
      <U.AIMessage role="assistant">
        我已经梳理了这一章的主要概念，接下来可以一起看看它们之间的联系。
      </U.AIMessage>
    ),
    AIComposer: () => <U.AIComposer onSend={(s) => notify(`已收到：${s}`)} />,
    TaskStatus: () => (
      <U.TaskStatus
        title="整理课程笔记"
        steps={["阅读资料", "整理章节", "补充复习提示"]}
        running={on}
        onToggle={() => setOn(!on)}
      />
    ),
    ResultCard: () => (
      <U.ResultCard
        title="第二章 · 向量空间"
        description="已整理章节结构、重要定义与复习提示。"
        onApply={() => notify("内容已应用到示例笔记")}
      />
    ),
    FileCard: () => (
      <U.FileCard
        name="线性代数课程讲义.pdf"
        detail="参考资料 · 24 页"
        onOpen={() => notify("已打开资料示例")}
      />
    ),
    MessageList: () => (
      <div style={{ height: 320 }}>
        <U.MessageList
          messages={[
            {
              id: "1",
              role: "user",
              content: "帮我梳理一下第二章的重点。",
              timestamp: new Date(),
            },
            {
              id: "2",
              role: "assistant",
              content:
                "第二章围绕向量空间展开。先看定义，再理解基与维数，最后做两道综合题。",
              timestamp: new Date(),
            },
            {
              id: "3",
              role: "user",
              content: "基和维数的关系是什么？",
              timestamp: new Date(),
            },
          ]}
          bottomInset={12}
        />
      </div>
    ),
    CollapseTransition: () => (
      <div>
        <U.Button
          variant="secondary"
          size="sm"
          onClick={() => setOn(!on)}
        >
          {on ? "收起内容" : "展开内容"}
        </U.Button>
        <U.CollapseTransition isOpen={on}>
          <U.Callout title="阅读重点">
            折叠会平滑改变高度，内容在收起后仍保留在文档流之外，不影响周围布局。
          </U.Callout>
        </U.CollapseTransition>
      </div>
    ),
    AgentTrace: () => (
      <U.AgentTrace
        title="整理第二章"
        durationMs={4200}
        steps={[
          {
            id: "1",
            title: "阅读课程资料",
            detail: "已读取讲义 24 页与两篇补充阅读。",
            status: "done",
          },
          {
            id: "2",
            title: "提取核心概念",
            detail: "识别出 6 个定义、3 个定理。",
            status: "done",
          },
          {
            id: "3",
            title: "整理章节结构",
            status: "running",
          },
        ]}
      />
    ),
    FlipCard: () => (
      <U.FlipCard
        kind="quiz"
        flipped={flip}
        onFlip={() => setFlip(!flip)}
        front="向量空间的维数是什么？"
        back="向量空间中基所含向量的个数，等于该空间中线性无关向量的最大数量。"
        explanation="维数不随基的选择改变。"
      />
    ),
    SelectionToolbar: () => (
      <div>
        <p className="fp-muted">
          点击下方按钮模拟选中一段文字后出现的工具栏。
        </p>
        <U.Button
          size="sm"
          onClick={() =>
            setAnchor(anchor ? null : { x: 260, y: 220 })
          }
        >
          {anchor ? "收起工具栏" : "显示工具栏"}
        </U.Button>
        <U.SelectionToolbar
          anchor={anchor}
          preview="向量空间是一个..."
          onClose={() => setAnchor(null)}
          actions={[
            { id: "ask", label: "问 AI", onClick: () => notify("已加入对话") },
            { id: "note", label: "记笔记", onClick: () => notify("已记录") },
            {
              id: "copy",
              label: "复制",
              onClick: () => notify("已复制"),
            },
          ]}
        />
      </div>
    ),
    SyncStatus: () => (
      <div className="fp-muted" style={{ fontSize: 13 }}>
        <strong>演示在日常生活中更接近固定位置的提示条：</strong>
        <div style={{ marginTop: 8 }}>
          点击按钮查看同步提示条（会出现在窗口左下角）。
        </div>
        <U.Button
          size="sm"
          variant="secondary"
          style={{ marginTop: 12 }}
          onClick={() => setSyncVisible(!syncVisible)}
        >
          {syncVisible ? "隐藏提示条" : "显示提示条"}
        </U.Button>
        {syncVisible && (
          <U.SyncStatus
            list={async () => [
              { key: "note-1", conflict: true },
              { key: "note-2" },
            ]}
            sync={async () => {}}
            resolve={async () => setSyncVisible(false)}
          />
        )}
      </div>
    ),
    ModelSelector: () => (
      <U.ModelSelector
        value={model}
        onChange={setModel}
        groups={[
          {
            name: "通用模型",
            models: [
              {
                id: "fast",
                label: "快速版",
                contextWindow: 128000,
                description: "响应更快，适合日常问答。",
              },
              {
                id: "deep",
                label: "深度版",
                contextWindow: 200000,
                description: "推理更深入，适合复杂题目。",
              },
            ],
          },
          {
            name: "视觉模型",
            models: [
              {
                id: "vision",
                label: "视觉理解",
                contextWindow: 64000,
                supportsVision: true,
              },
            ],
          },
        ]}
      />
    ),
    TokenDashboard: () => (
      <U.TokenDashboard
        balance={12480}
        onClick={() => notify("已打开积分明细")}
      />
    ),
    CollapsibleSection: () => (
      <U.CollapsibleSection
        label="原文片段"
        meta="128 字"
        defaultOpen
      >
        <p className="fp-muted" style={{ margin: 0, lineHeight: 1.8 }}>
          向量空间是带有加法和数乘两种运算的集合。运算需要满足八条公理，
          这些公理保证了线性组合、基与维数等概念能够成立。
        </p>
      </U.CollapsibleSection>
    ),
    AttachmentGrid: () => (
      <U.AttachmentGrid
        items={[
          { id: "a1", name: "课堂板书.png" },
          { id: "a2", name: "笔记照片.jpg" },
          { id: "a3", name: "缺失预览" },
        ]}
        onRemove={(id) => notify(`已移除附件 ${id}`)}
      />
    ),
    QuizQuestion: () => (
      <U.QuizQuestion
        index={2}
        total={10}
        kind="单项选择"
        difficulty="medium"
        prompt="下列哪一组向量可以构成 R³ 的一组基？"
        options={[
          { id: "a", text: "(1,0,0)、(0,1,0)、(0,0,1)", correct: true },
          { id: "b", text: "(1,0,0)、(2,0,0)、(3,0,0)" },
          { id: "c", text: "(1,1,0)、(2,2,0)、(0,0,1)" },
          { id: "d", text: "(0,0,0)、(1,0,0)、(0,1,0)" },
        ]}
        selected={quizPick}
        onSelect={setQuizPick}
        mode={quizReview ? "review" : "answer"}
        explanation="三个线性无关的向量构成 R³ 的基；重复方向的向量线性相关。"
      />
    ),
    EmbedFallback: () => (
      <div style={{ border: "1px solid var(--fp-line)", borderRadius: 8 }}>
        <U.EmbedFallback
          url="https://example.com/article"
          reason="目标站点设置了 X-Frame-Options: DENY"
          onForce={() => notify("尝试内嵌示例")}
        />
      </div>
    ),
    MediaLightbox: () => (
      <div>
        <p className="fp-muted" style={{ marginTop: 0 }}>
          点击按钮打开灯箱，支持滚轮缩放、拖动与 Esc 关闭。
        </p>
        <U.Button
          size="sm"
          onClick={() => setLightboxOpen(!lightboxOpen)}
        >
          {lightboxOpen ? "关闭灯箱" : "打开灯箱"}
        </U.Button>
        <U.MediaLightbox
          src={
            lightboxOpen
              ? "data:image/svg+xml;utf8," +
                encodeURIComponent(
                  '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420"><rect width="640" height="420" fill="#f4f2ef"/><circle cx="320" cy="210" r="110" fill="#fd8b07" opacity=".35"/><text x="320" y="218" text-anchor="middle" font-size="28" fill="#202124">示例图片</text></svg>',
                )
              : null
          }
          alt="示例图片"
          onClose={() => setLightboxOpen(false)}
        />
      </div>
    ),
    SettingsSection: () => (
      <U.SettingsSection
        title="阅读外观"
        icon={<span aria-hidden="true">A</span>}
        summary="字号、行距与主题"
        open={settingsOpen}
        onToggle={() => setSettingsOpen(!settingsOpen)}
      >
        <U.Stack gap={12}>
          <U.Switch
            label="专注阅读"
            checked={on}
            onChange={setOn}
          />
          <U.Slider
            label={`字号 · ${slider}px`}
            min={12}
            max={24}
            step={0.5}
            value={slider}
            onChange={(e) => setSlider(Number(e.target.value))}
          />
        </U.Stack>
      </U.SettingsSection>
    ),
    ChatEmptyState: () => (
      <U.ChatEmptyState
        subjectName="线性代数"
        topic="第二章 · 向量空间"
        prompts={[
          "帮我解释一下基与维数",
          "出三道基础题练一练",
          "用一句话总结这一章",
        ]}
        onPrompt={(p) => notify(`已提问：${p}`)}
      />
    ),
    SourceFold: () => (
      <U.SourceFold
        label="联网来源"
        sources={[
          {
            url: "https://zh.wikipedia.org/wiki/Vector_space",
            title: "向量空间 · 维基百科",
          },
          {
            url: "https://example.com/linear-algebra",
            title: "线性代数讲义第二章",
          },
          {
            url: "https://example.com/exercises",
            title: "向量空间练习题",
          },
        ]}
        onOpen={(s) => notify(`已打开 ${s.title}`)}
      />
    ),
    SessionHistory: () => (
      <U.SessionHistory
        groups={[
          {
            id: "main",
            label: "对话",
            items: [
              {
                id: "s1",
                title: "向量空间的基与维数",
                detail: "12 条消息",
                time: "今天",
              },
              {
                id: "s2",
                title: "行列式计算练习",
                detail: "8 条消息",
                time: "昨天",
              },
            ],
          },
          {
            id: "selection",
            label: "划词",
            items: [
              {
                id: "s3",
                title: "矩阵秩的性质",
                detail: "3 条消息",
                time: "周二",
              },
            ],
          },
        ]}
        activeId="s1"
        onSelect={(g, s) => notify(`已切换到 ${s}`)}
        onCreate={() => notify("已新建会话")}
        onDelete={(g, s) => notify(`已删除 ${s}`)}
      />
    ),
    ContentImage: () => (
      <U.ContentImage
        src="data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='480' height='200'%3E%3Crect width='480' height='200' fill='%23f4f2ef'/%3E%3Ccircle cx='240' cy='100' r='52' fill='%23fd8b07' opacity='.3'/%3E%3C/svg%3E"
        alt="示意图"
        title="图 2-1 · 向量空间的几何示意"
      />
    ),
    WindowChrome: () => (
      <U.WindowChrome
        title="阅读与创造.pdf"
        icon={<span aria-hidden="true">▤</span>}
        onClose={() => notify("关闭窗口示例")}
        onMinimize={() => notify("最小化窗口示例")}
        onFullscreen={() => notify("全屏窗口示例")}
      >
        <div style={{ padding: 24, minHeight: 160 }}>
          <p className="fp-muted" style={{ margin: 0, lineHeight: 1.8 }}>
            窗口内容放在这里。标题栏支持拖动，左侧按钮可关闭、最小化或全屏。
          </p>
        </div>
      </U.WindowChrome>
    ),
    FilterSelect: () => (
      <U.FilterSelect
        label="筛选课程"
        value={filterValue}
        onChange={setFilterValue}
        options={[
          { value: "all", label: "全部未归档课程" },
          { value: "unfiled", label: "待整理" },
          { value: "archived", label: "已归档" },
        ]}
        groups={[
          {
            label: "学期",
            options: [
              { value: "fall", label: "秋季学期" },
              { value: "spring", label: "春季学期" },
            ],
          },
          {
            label: "我的分类",
            options: [
              { value: "c1", label: "数学基础" },
              { value: "c2", label: "复习计划" },
            ],
          },
        ]}
      />
    ),
    AcademicYearSwitcher: () => (
      <U.AcademicYearSwitcher
        years={[
          { id: "y1-fall", grade: "大一", term: "上学期", label: "大一上" },
          { id: "y1-spring", grade: "大一", term: "下学期", label: "大一下" },
          { id: "y2-fall", grade: "大二", term: "上学期", label: "大二上" },
          { id: "y2-spring", grade: "大二", term: "下学期", label: "大二下" },
          { id: "y3-fall", grade: "大三", term: "上学期", label: "大三上" },
        ]}
        value={academicYear}
        onChange={setAcademicYear}
      />
    ),
    KeyPoint: () => (
      <U.KeyPoint label="核心要点">
        向量空间的维数等于任意一组基所含向量的个数，与基的选择无关。
      </U.KeyPoint>
    ),
    ConceptCard: () => (
      <U.ConceptCard term="线性无关" defaultOpen>
        若一组向量中没有任何一个可以表示为其余向量的线性组合，
        则称这组向量线性无关。
      </U.ConceptCard>
    ),
    CompareTable: () => (
      <U.CompareTable title="基与生成集的区别">
        <table>
          <thead>
            <tr>
              <th>概念</th>
              <th>要求</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>生成集</td>
              <td>空间中每个向量都能由它线性表示</td>
            </tr>
            <tr>
              <td>基</td>
              <td>生成集且线性无关</td>
            </tr>
          </tbody>
        </table>
      </U.CompareTable>
    ),
    CauseEffect: () => (
      <U.CauseEffect
        text={"因：基向量线性无关\n影响：每个向量表示唯一\n结果：坐标是确定的"}
      />
    ),
    Derivation: () => (
      <U.Derivation label="推导：维数唯一">
        <p style={{ margin: 0 }}>
          设两组基分别含 m 与 n 个向量。由替换定理可得 m ≤ n 且 n ≤ m，
          因此 m = n，维数唯一确定。
        </p>
      </U.Derivation>
    ),
    CitationList: () => (
      <U.CitationList
        hits={[
          {
            title: "第二章 · 向量空间",
            path: "线性代数 / 第二章 / 2.3 基与维数",
            snippet: "基所含向量的个数称为维数……",
          },
          {
            title: "复习笔记",
            path: "线性代数 / 复习 / 期末整理",
            snippet: "线性无关与生成集的关系……",
          },
        ]}
        action={{ label: "查看", onClick: () => notify("打开引用视图") }}
        onOpen={(hit) => notify(`打开 ${hit.title}`)}
      />
    ),
    ApprovalCard: () => (
      <U.ApprovalCard
        title="AI 生图"
        prompt="一张表现向量空间几何结构的示意插画，暖色背景。"
        details={[
          { label: "尺寸", value: "1024 × 1024" },
          { label: "数量", value: "1 张" },
          { label: "模型", value: "默认生图模型" },
        ]}
        cost="预计消耗 1 次生图额度"
        status={approvalStatus}
        onApprove={() => {
          setApprovalStatus("done");
          notify("已批准并生成示例");
        }}
        onCancel={() => setApprovalStatus("cancelled")}
      >
        <p className="fp-muted" style={{ margin: 0 }}>
          已生成 1 张示例图片。
        </p>
      </U.ApprovalCard>
    ),
    TocTree: () => (
      <U.TocTree
        activeId="sec-2"
        onSelect={() => {}}
        items={[
          {
            id: "sec-1",
            text: "2.1 向量空间的定义",
            level: 1,
            children: [
              { id: "sec-1-1", text: "加法与数乘", level: 2 },
              { id: "sec-1-2", text: "八条公理", level: 2 },
            ],
          },
          {
            id: "sec-2",
            text: "2.2 基与维数",
            level: 1,
            children: [
              { id: "sec-2-1", text: "线性无关", level: 2 },
              { id: "sec-2-2", text: "维数的唯一性", level: 2 },
            ],
          },
          { id: "sec-3", text: "2.3 坐标与变换", level: 1 },
        ]}
      />
    ),
    SiblingFiles: () => (
      <U.SiblingFiles
        activeId="c2"
        onSelect={(item) => notify(`打开 ${item.title}`)}
        items={[
          { id: "c1", title: "2.1 向量空间的定义", status: "done" },
          { id: "c2", title: "2.2 基与维数", status: "done" },
          { id: "c3", title: "2.3 坐标与变换", status: "draft", detail: "草稿" },
          { id: "c4", title: "2.4 线性映射", status: "stub", detail: "未开始" },
        ]}
      />
    ),
    FormulaSteps: () => (
      <U.FormulaSteps
        interactive
        steps={[
          "设两组基分别为 e₁…eₘ 与 f₁…fₙ。",
          "将 f₁ 用第一组基表示，得到系数不全为零的线性组合。",
          "由替换定理逐次替换，可得 n ≤ m。",
          "对称地重复一次，得到 m ≤ n，因此 m = n。",
        ]}
      />
    ),
    DistributionChart: () => (
      <U.DistributionChart type="normal" interactive />
    ),
    VideoPlayer: () => (
      <U.VideoPlayer
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
        poster="data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360'%3E%3Crect width='640' height='360' fill='%2317181a'/%3E%3Ctext x='320' y='188' text-anchor='middle' font-size='20' fill='%23e8eaed'%3E示例视频%3C/text%3E%3C/svg%3E"
        title="示例视频"
      />
    ),
    ShortcutHelp: () => (
      <div>
        <p className="fp-muted" style={{ marginTop: 0 }}>
          打开快捷键参考面板，按 Esc 关闭。
        </p>
        <U.Button size="sm" onClick={() => setShortcutsOpen(!shortcutsOpen)}>
          {shortcutsOpen ? "关闭参考" : "打开快捷键参考"}
        </U.Button>
        <U.ShortcutHelp
          open={shortcutsOpen}
          onClose={() => setShortcutsOpen(false)}
          categories={[
            {
              id: "global",
              label: "全局",
              items: [
                { keys: "Ctrl K", description: "打开搜索" },
                { keys: "Ctrl /", description: "打开快捷键参考" },
                { keys: "Esc", description: "关闭当前浮层" },
              ],
            },
            {
              id: "reading",
              label: "阅读",
              items: [
                { keys: "J", description: "下一个章节" },
                { keys: "K", description: "上一个章节" },
                { keys: "Ctrl +", description: "放大字号" },
              ],
            },
          ]}
        />
      </div>
    ),
    BottomNav: () => (
      <div style={{ maxWidth: 420, border: "1px solid var(--fp-line)", borderRadius: 12, overflow: "hidden" }}>
        <U.BottomNav
          value={bottomTab}
          onChange={setBottomTab}
          items={[
            { id: "detail", label: "详解", icon: <span aria-hidden="true">▤</span> },
            { id: "video", label: "动画", icon: <span aria-hidden="true">▶</span> },
            { id: "ai", label: "AI 对话", icon: <span aria-hidden="true">✦</span>, badge: 2 },
            { id: "interactive", label: "交互", icon: <span aria-hidden="true">◆</span> },
          ]}
        />
      </div>
    ),
    ImageGallery: () => (
      <U.ImageGallery
        meta="向量空间"
        images={[
          {
            src: "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Crect width='240' height='240' fill='%23f4f2ef'/%3E%3Ccircle cx='120' cy='120' r='70' fill='%23fd8b07' opacity='.3'/%3E%3C/svg%3E",
            alt: "向量空间示意图",
            caption: "图 1 · 基的几何意义",
          },
          {
            src: "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Crect width='240' height='240' fill='%23eef0f3'/%3E%3Crect x='50' y='70' width='140' height='100' fill='%231a73e8' opacity='.25'/%3E%3C/svg%3E",
            alt: "线性映射",
            caption: "图 2 · 线性映射",
          },
          {
            src: "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Crect width='240' height='240' fill='%23f4f2ef'/%3E%3Cpath d='M40 180 L120 60 L200 180 Z' fill='%2313795b' opacity='.25'/%3E%3C/svg%3E",
            alt: "线性组合",
          },
        ]}
      />
    ),
    WindowTaskbar: () => (
      <U.WindowTaskbar
        windows={[
          { id: "w1", title: "阅读与创造.pdf", active: true, icon: <span aria-hidden="true">▤</span> },
          { id: "w2", title: "AI 对话", icon: <span aria-hidden="true">✦</span> },
          { id: "w3", title: "图片生成", icon: <span aria-hidden="true">◉</span> },
          { id: "w4", title: "复习记录", icon: <span aria-hidden="true">◈</span> },
          { id: "w5", title: "引用来源", icon: <span aria-hidden="true">⌕</span> },
          { id: "w6", title: "积分明细", icon: <span aria-hidden="true">◎</span> },
        ]}
        onSelect={(id) => notify(`切换到 ${id}`)}
      />
    ),
  };
  return (
    <div className="demo-inner">
      {examples[name]?.() || <p>选择一个组件开始体验。</p>}
    </div>
  );
}
