/** 设计原则与组件映射：每个组件至少对应一条原则，供设计网站直接引用。 */

export type Principle = {
  id: string;
  index: string;
  title: string;
  summary: string;
  body: string;
  rules: string[];
};

export const principles: Principle[] = [
  {
    id: "content-first",
    index: "01",
    title: "内容成为主角",
    summary: "把注意力留给真正重要的事。",
    body: "阅读区保持清楚的文字层级与舒适的行距。用布局、留白与边界组织信息，让用户轻松找到需要的内容。",
    rules: [
      "正文 16px、行高 1.7–1.9，行长约 36–46 个汉字",
      "装饰不遮挡内容，浮层按需出现",
      "关键内容不使用浅色小字",
    ],
  },
  {
    id: "clear-action",
    index: "02",
    title: "行动一目了然",
    summary: "在需要的地方，出现合适的操作。",
    body: "一个任务区域突出一个主要行动。按钮用具体动词表达结果，选中状态与操作状态各有清楚的意义。",
    rules: [
      "每个区域只保留一个主按钮",
      "危险操作用独立颜色并说明对象",
      "选中、悬停、按下、禁用四种状态必须可区分",
    ],
  },
  {
    id: "feedback",
    index: "03",
    title: "每一步都有回应",
    summary: "正在发生什么，接下来做什么。",
    body: "长任务展示真实进展并允许暂停。出现问题时保留用户的工作，说明可执行的恢复路径。",
    rules: [
      "已知比例用进度条，未知等待用加载指示",
      "错误说明原因并给出恢复入口",
      "成功反馈短暂、明确、不打断流程",
    ],
  },
  {
    id: "consistency",
    index: "04",
    title: "一致中保留个性",
    summary: "熟悉的秩序，自由的表达。",
    body: "品牌、颜色语义、组件行为保持一致。不同产品根据任务选择布局密度与内容表达。",
    rules: [
      "只使用 --fp-* 语义变量，不写死颜色",
      "同类操作用同一种组件",
      "产品主题只改变操作色，不改变品牌识别",
    ],
  },
  {
    id: "accessibility",
    index: "05",
    title: "自然地服务每个人",
    summary: "让使用更舒适，也更平等。",
    body: "将键盘、触控、读屏、缩放与减少动态效果纳入日常设计。每个状态都能被理解，每个任务都有可达路径。深色模式下的对比度与边框需要独立调整，确保在任何环境都清晰可辨。",
    rules: [
      "所有交互元素有可见键盘焦点",
      "主要触控目标至少 44px",
      "图标按钮必须有可访问名称",
      "深浅色模式各自检查对比度与边框视觉效果",
      "不依赖浏览器默认样式，自绘关键控件避免主题冲突",
    ],
  },
  {
    id: "evolution",
    index: "06",
    title: "让创造持续生长",
    summary: "一次建立，处处可靠。",
    body: "把共同决定沉淀为变量、组件与模式。在真实产品中检验，让设计与实现一起演进。",
    rules: [
      "新组件先复用语义变量与现有组件",
      "组件提供受控状态、加载与错误状态",
      "改动同步更新文档与回归测试",
    ],
  },
];

/** 分组级默认归属 */
const byGroup: Record<string, string[]> = {
  基础: ["consistency", "clear-action"],
  表单: ["accessibility", "feedback"],
  导航: ["clear-action", "consistency"],
  反馈: ["feedback", "accessibility"],
  数据展示: ["content-first", "consistency"],
  布局: ["content-first", "consistency"],
  业务模式: ["content-first", "feedback"],
};

/** 单个组件的专属归属，覆盖分组默认值 */
const overrides: Record<string, string[]> = {
  Button: ["clear-action", "accessibility", "consistency"],
  IconButton: ["accessibility", "clear-action"],
  Link: ["accessibility", "content-first"],
  Badge: ["feedback", "consistency"],
  Chip: ["clear-action", "accessibility"],
  Avatar: ["consistency"],
  AvatarGroup: ["consistency", "accessibility"],
  Divider: ["content-first"],
  Kbd: ["accessibility"],
  VisuallyHidden: ["accessibility"],
  Input: ["accessibility", "feedback"],
  Textarea: ["accessibility", "content-first"],
  Field: ["accessibility", "feedback"],
  Checkbox: ["accessibility", "clear-action"],
  Radio: ["accessibility", "clear-action"],
  Switch: ["clear-action", "feedback"],
  Select: ["accessibility", "clear-action"],
  Combobox: ["accessibility", "feedback"],
  MultiSelect: ["accessibility", "feedback"],
  PasswordInput: ["accessibility", "feedback"],
  NumberInput: ["clear-action", "accessibility"],
  Slider: ["accessibility", "feedback"],
  DatePicker: ["accessibility", "consistency"],
  TimePicker: ["accessibility", "consistency"],
  Calendar: ["clear-action", "accessibility"],
  ColorPicker: ["accessibility", "consistency"],
  Rating: ["clear-action", "accessibility"],
  SearchInput: ["accessibility", "clear-action"],
  FileUpload: ["feedback", "accessibility"],
  Tabs: ["clear-action", "accessibility"],
  SegmentedControl: ["clear-action", "consistency"],
  Breadcrumbs: ["clear-action", "content-first"],
  Pagination: ["clear-action", "feedback"],
  Steps: ["feedback", "clear-action"],
  Navigation: ["clear-action", "consistency"],
  Tree: ["accessibility", "content-first"],
  Dropdown: ["clear-action", "accessibility"],
  CommandMenu: ["accessibility", "clear-action"],
  Alert: ["feedback", "accessibility"],
  Banner: ["feedback", "clear-action"],
  Toast: ["feedback"],
  Dialog: ["accessibility", "clear-action"],
  ConfirmDialog: ["clear-action", "feedback"],
  Drawer: ["content-first", "accessibility"],
  Popover: ["content-first", "accessibility"],
  Tooltip: ["accessibility", "content-first"],
  Progress: ["feedback"],
  Spinner: ["feedback", "accessibility"],
  Skeleton: ["feedback", "content-first"],
  EmptyState: ["feedback", "clear-action"],
  ErrorState: ["feedback", "clear-action"],
  Card: ["content-first"],
  Table: ["content-first", "accessibility"],
  DescriptionList: ["content-first"],
  Timeline: ["content-first", "feedback"],
  Stat: ["content-first"],
  Meter: ["feedback"],
  BarChart: ["content-first", "accessibility"],
  Accordion: ["content-first", "clear-action"],
  CodeBlock: ["content-first", "accessibility"],
  ImagePreview: ["content-first", "accessibility"],
  NotificationList: ["feedback", "clear-action"],
  Container: ["content-first"],
  Stack: ["consistency"],
  Grid: ["content-first", "consistency"],
  ScrollArea: ["accessibility", "content-first"],
  AspectRatio: ["content-first"],
  ResizablePanel: ["accessibility", "clear-action"],
  PageHeader: ["content-first", "clear-action"],
  Toolbar: ["clear-action", "consistency"],
  Footer: ["content-first"],
  Callout: ["content-first"],
  Citation: ["content-first"],
  AIMessage: ["feedback", "content-first"],
  AIComposer: ["accessibility", "feedback"],
  TaskStatus: ["feedback"],
  ResultCard: ["clear-action", "feedback"],
  FileCard: ["content-first", "clear-action"],
  ResourcePreview: ["content-first", "feedback"],
  PdfPreview: ["content-first", "feedback"],
  HorizontalScrollbar: ["accessibility", "content-first"],
  CollaborativeEditor: ["feedback", "accessibility"],
  FileTree: ["accessibility", "content-first"],
};

export function principlesFor(name: string, group: string): string[] {
  return overrides[name] ?? byGroup[group] ?? ["consistency"];
}

export const principleById = Object.fromEntries(
  principles.map((p) => [p.id, p]),
);
