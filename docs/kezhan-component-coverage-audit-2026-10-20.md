# 课栈组件覆盖与迁移准备度核查

核查日期：2026-10-20。基线组件库版本：0.3.5。后续交付见 [0.4.0 交付与验收](kezhan-ui-0.4.0-acceptance.md)；本文保留本轮开始时的基线核查结果。

## 结论与口径

课栈所需组件尚未全部完成抽取、重新设计和验收。当前具备基础控件与部分工作区组件，可以开始分批接入；尚不具备一次性替换整个课栈前端的条件。

本次直接检查两个工作目录的当前源码，包括课栈尚未提交的文件。课栈源目录为 `D:/5plus1/DEV/KeZhan/KeZhan-notebook/KeZhan-notebook`，组件库为 `D:/5plus1/DEV/5plus1-ui`。课栈工作区有既有改动，本次仅读取，未修改业务源码。

课栈 `components` 目录排除 `*.test.tsx` 后有 **277 个 TSX 文件，23 个一级目录**。其中包含业务页面、提供器、服务端渲染器和学科实验，不能全部视作应独立发布的 UI 组件。`frontend/SharedPage.tsx`、`ReleaseNotice.tsx` 等界面入口也在此计数之外。组件库设计目录的 **126 个条目** 是展示入口，不能与 277 个文件相除计算完成率。

完成应分别判断：

1. **抽取**：公开导出，具备可受控的接口，覆盖真实任务所需视图与交互。
2. **设计**：主题、密度、状态、响应式、菜单、焦点和尺寸过渡采用统一规范。
3. **验证**：真实内容、异常、键盘、触摸、深浅主题和连续动画均有证据。
4. **接入**：课栈实际调用组件库，并保留原有完整任务能力。

本次在课栈 `package.json`、`frontend`、`components` 中搜索 `@fiveplusone` 和 `5plus1-ui` 均未发现引用。当前依然使用本地组件；库内存在对应组件不代表课栈已完成迁移。

## 按真实源码目录检查

下表中的“已有”只表示组件或组合基础存在；未标记任何区域为完整生产验收通过。

| 课栈区域 | 文件数 | 库内已有能力 | 覆盖缺口与处理方向 |
| --- | ---: | --- | --- |
| account | 12 | MemberAccess、MemberSearch、ShareLink、表单和弹窗 | 登录、账户导航、笔记本管理、目录管理、购买、积分、账单、用户详情和额度编辑尚无完整可复用视图；业务请求留在课栈 |
| admin | 5 | Table、表单、Dialog、SettingsSection | 管理员、容量、平台设置和系统管理页面的组合视图及状态尚未抽取 |
| agent | 2 | AgentTrace、ApprovalCard | AgentWorkspace、运行任务工作区的完整组合与交互尚未覆盖 |
| browser | 3 | EmbedFallback | 浏览器标签、地址与设置、嵌入状态仍需视图适配 |
| canvas | 17 | 通用容器、浮层、图表基础 | CanvasFrame、CanvasControls、版本视图、全屏、DiagramCanvas、FunctionPlot、SVG/HTML/分子及多图渲染尚未形成完整组件族；专用引擎可保留 |
| chat | 44 | MessageList、ChatComposer、ModelSelector、AgentTrace、TokenDashboard、SourceFold、SessionHistory、图片与引用组件 | 复杂消息正文、推理/工具步骤、Artifact/Document/引用查看器、思考设置、技能管理、浮动对话窗口仍需抽取或组合；普通消息气泡不能覆盖这些内容 |
| examples | 1 | 示例容器和内容控件 | ExampleTab 的实际内容导航尚未核实为等价组合 |
| icons | 3 | Lucide 图标 | 模型品牌、Agent 和产品图标需统一资源与映射，不能仅按通用图标替换 |
| interactives | 68 | 基础表单、图表、容器 | 学科实验、InteractiveStudio、InteractivePlatform、LabWorkbench、录制与源码查看尚未统一设计；计算逻辑无需全部搬库，工作台外壳和操作控件应复用 |
| keyboard | 2 | ShortcutHelp、播放器局部快捷键 | 全局快捷键提供器、用户配置、浮层优先级和冲突处理仍需接入；帮助面板不等于快捷键系统 |
| layout | 30 | WorkspaceLayout、FileTree、TocTree、SiblingFiles、BottomNav、SettingsSection、AcademicYearSwitcher | NoteTabStrip 拖动排序/跨分屏移动、书架、筛选、学科侧栏、移动章节/顶部导航、产品切换、全局设置、工作区活动视图尚未完整抽取 |
| notes | 31 | MarkdownEditor、公式/矩阵/Mermaid/表格工具、AttachmentPicker、UploadQueue、MemberSearch、SelectionToolbar | 双链与关系图、图片粘贴/转换视图、上传占位视图、版本差异/恢复面板、块拖动、链接/标签补全、导入视图、完整阅读器仍有缺口，见下文 |
| quiz | 5 | QuizQuestion | 主观题自评、整卷导航、评分明细、结果总结、答题恢复与 Markdown 题目渲染尚未完整覆盖 |
| resources | 2 | ResourceExplorer、ResourcePreview、PdfPreview | 资源中心组合、真实转换/授权/上传/回收站接入尚待完成；大目录和高级选择能力未覆盖 |
| review | 5 | FlipCard、CollapsibleSection、窗口外壳 | ReviewPage 的复习计划、记录预览窗口和状态组合仍需适配 |
| search | 1 | CommandMenu、搜索输入基础 | GlobalSearchButton 的权限过滤、本地与远程结果合并、正文摘要与定位没有等价的完整搜索结果组件 |
| setup | 1 | 表单、步骤与弹窗基础 | SetupWizard 的步骤布局、错误恢复与完成状态尚未抽取为完整视图 |
| shared | 28 | CodeBlock、ContentImage、Callout、五种 NoteBlocks、HorizontalScrollbar、MediaLightbox、PdfPreview、ContextMenu | EventCard、HistoryMap、Figure、LearningAnimation、完整 MediaEmbed/MemoryCard 等语义视图及阅读映射尚不齐全；Timeline 只有通用条目视图 |
| ui | 4 | CollapseTransition、Tooltip 等基础 | LazyVisible 与宿主内容懒加载仍需适配；独立控件通过不代表嵌套场景通过 |
| video | 6 | VideoPlayer，支持授权解析接口、位置事件、字幕与常用快捷键 | LecturePlayer 的鉴权刷新、缓冲看门狗、课堂进度、LectureDock、PipPlayer 及视频与笔记联动仍需控制器与视图适配 |
| visualizations | 4 | FormulaSteps、DistributionChart、VideoPlayer | VennDiagram 没有对应公开入口；库内图表参数覆盖仍需逐场景比较 |
| window | 3 | WindowChrome、WindowTaskbar、共用浮层 | 拖动、缩放、层级、最小化、几何恢复和窗口内容组合仍依赖课栈控制器，需迁移验证 |

## 关键模块的接口与行为差距

### 工作区、文件树和资源管理

`src/lib/workspace/WorkspaceLayout.tsx` 已提供多面板、折叠、持久化键和命令式控制，不能再按早期两栏 ResizablePanel 的限制评价它。嵌套布局可承载分屏，但没有覆盖 `components/layout/NoteTabStrip.tsx` 的标签重排、跨侧拖动和路由/保存联动。

`src/lib/workspace/FileTree.tsx` 已有受控展开、预取、中键、修饰键打开、拖放回调与节点菜单。课栈 `components/layout/FileTree.tsx` 的学科/分类路径、排序、状态存储需适配，不能把库中的 namespace 参数视作完整的业务路径转换。

`src/lib/ResourceExplorer.tsx` 已有列表/网格、路径、搜索、排序、复选多选和菜单；缺少框选、Shift 连续选择、拖放上传/移动、大目录虚拟化及完整回收站视图。存储请求留在课栈，但这些交互与视图是组件覆盖问题。

### Markdown 编辑与阅读

`src/lib/editor/MarkdownEditor.tsx` 已有完整编辑器主体、工具栏、公式/矩阵、代码语言、Mermaid、卡片、附件与 `/` 菜单；`CollaborativeEditor` 确实复用它，已不是独立的简化文本输入。

与 `components/notes/VisualNoteEditor.tsx` 对照仍有下列差距：

- 课栈快捷输入区分 command、tag、link、wikilink；库内当前主要是固定 slash 命令，尚无标签/笔记链接结果的数据契约。附件与视频可从工具栏回调插入，但未出现在当前 slash 命令集合中。
- 库内 schema 包含 ImageConversion、UploadPlaceholder，当前 MarkdownEditor 没有像课栈一样装配 ImageConversionView、UploadPlaceholderView。底层节点存在不能算相应视图已经迁入。
- 课栈具有块拖动、图片粘贴处理、版本列表、差异、恢复、本地草稿保留和保存冲突界面。库内 onHistory/onSnapshot/onFiles 是接入点，尚未提供这些完整视图。保存/鉴权留在宿主，面板与交互可以复用。
- BacklinksPanel、GraphView、ImportVaultDialog、DynamicRecording 等尚无对应完整公开组件。
- 库内默认 DirectiveView 采用嵌套编辑器；课栈默认阅读态调用 NoteRenderer，并区分 video/interactive/figure/plot 等叶子指令。renderDirective 可注入，但默认视图与专用资源编辑并未等价覆盖。
- NOTE_SCHEMA_VERSION 都是 2，仅说明版本标记相同。仍需使用真实历史文档验证节点、属性、指令渲染、链接与附件往返，不能据此判断完整兼容。

课栈 `lib/markdown/directiveComponents.ts` 注册了 16 个渲染映射。库内五种 NoteBlocks 和通用 Timeline 尚不能覆盖全部语义。需要补齐独立阅读视图或提供明确的宿主渲染适配表，再用同一篇笔记检验阅读态、编辑态与协作态。

### 协作编辑

`src/lib/workspace/CollaborativeEditor.tsx` 已有 Y.Doc/provider 接入、协作身份与连接状态；本次复跑的测试包含共享编辑内容验证。尚未完成真实服务端登录过期、只读权限变更、断线重连、多人同时编辑同一卡片正文、历史恢复与并发保存的端到端验收。这些是迁移闸门，不应全部计作“组件还没有”。

### AI 对话

`src/lib/MessageList.tsx` 已有虚拟列表、粘底、历史加载与实例内会话位置恢复。跨卸载恢复由宿主负责；需要将课栈 `ChatThread.tsx` 的真实长消息和延迟加载内容接入后检验锚点稳定性。

`ChatComposer.tsx` 已支持受控草稿、引用、附件状态、粘贴/拖放、停止回复及工具插槽。课栈 `ChatInput.tsx` 的模型、思考档位、联网、配额与独立浮窗会话应由适配器组合。当前提供 tools 插槽不等于这些组合已经完成设计。

`components/chat/MessageContent.tsx` 仍负责专用 Markdown、可视化、内容块操作等；ArtifactViewer 还连接拖动/缩放/窗口管理与交互保存。需要优先抽取这些展示层，避免接入时继续使用大块旧外观。

### 文件预览与课堂播放

Office 示例使用预制页面，不能证明真实 DOCX/PPTX/XLSX 转换完成；转换服务在课栈。ResourcePreview/PdfPreview 的等待、转换失败、授权过期、大文件和跨格式切换需用真实服务验收。

VideoPlayer 公开 resolveSource、videoRef、位置/播放速度事件与字幕接口。课栈 `components/video/LecturePlayer.tsx` 另有授权源解析、超时、缓冲看门狗和重载；应保留控制器，补充课堂操作视图并验证接口匹配。ResourcePreview 目前只将 URL 传入 VideoPlayer，宿主要接授权控制器时还需要明确的组合接口。

### 分享、权限、账户和后台

MemberSearch 已支持用户/用户组搜索，MemberAccess 支持受控角色与成员操作，ShareLink 提供链接分享基础。课栈目录继承、笔记本级与笔记级权限、邀请、用户组与账户额度是更完整的业务任务。服务端权限不搬入 UI 库，但共享的权限摘要、继承状态、目录选择、管理列表与确认视图仍应抽取。

## 重新设计与交互验收中的具体待办

以下是源码可直接确认的问题或明确缺口；本次未对所有组件进行浏览器视觉复验。

| 项目 | 源码证据 | 验收要求 |
| --- | --- | --- |
| 音频外观 | ResourcePreview 仍直接使用 `<audio controls>` | 提供主题化 AudioPlayer，保留键盘、进度、音量及错误状态 |
| 资源复选框 | ResourceExplorer 使用原生 checkbox；styles.css 仅设置 accent-color 和尺寸 | 复用统一 Checkbox，检查深浅主题、禁用、半选与焦点 |
| 卡片编辑尺寸 | MarkdownEditor 默认 DirectiveView 直接切换 toolbar/editable 与操作状态，未建立该区域连续尺寸过渡 | 用长正文、嵌套公式与窄屏检查展开/完成全过程，再补相应高度过渡 |
| 输入框自动高度 | ChatComposer 直接写入 textarea.style.height | 验证多行输入、附件增减与 notice 出现时是否符合连续过渡规范，避免只检查外层 |
| 滚动条宿主影响 | styles.css 的 `*` 与全局 `::-webkit-scrollbar` 会作用于宿主页面 | 明确全局主题与组件局部样式边界，在课栈同时加载旧样式时验证 |
| 选择控件接口 | ChoiceInputs 的 Select 以隐藏 select 桥接 SelectField，显式传递的是值、禁用与选项 | 复核原生 required、name、label、焦点与表单错误能否一致传递；隐藏 select 本身不属于视觉问题 |
| 内容组件对应 | 通用 Timeline 的条目接口不同于课栈多种语义指令 | 用真实正文验证属性与交互，补齐阅读映射 |
| 动画完成度 | 公式有 220ms 收起及快速重开清理测试；并非所有容器都有同等覆盖 | 逐帧检查同行文字回流、动态公式宽度、PDF 页图加载、菜单定位与快速连续操作 |

仍须执行桌面/平板/手机、浅色/深色、各产品主题、键盘/触摸、减少动态效果、空/加载/失败/禁用/长内容状态矩阵。代码使用设计变量和过渡并不能单独证明视觉已验收。

## 本次验证与证据边界

本次重新运行组件库测试：**11 个测试文件，65 项测试全部通过**。覆盖目录渲染、按钮表单行为、受控工作区/树、消息粘底、输入法与重复发送、分享搜索、编辑序列化、Yjs 同步、Mermaid、表格菜单、预览乱序、公式收起生命周期和播放器快捷键等。

测试位于 `tests/`。`catalog.test.tsx` 遍历多个示例，但用例数量不是独立组件验收数量；jsdom 也不能确认像素、实际布局、触摸手势和动画帧。当前结果证明已有契约回归通过，不证明全部业务任务、全部视觉和真实服务已通过。本次未修改运行代码，未重新部署站点，也未修改课栈既有工作区改动。

## 建议的完成顺序与闸门

1. **迁移前必备**：补齐阅读/编辑指令映射、链接与标签补全、上传/图片转换视图、块操作和版本/冲突面板；补齐工作区标签栏、复杂消息展示与课堂控制视图。用真实文档及长会话验证。
2. **共享业务视图**：完成权限与邀请组合、账户/管理列表、全局搜索、书架与移动导航、资源管理高级交互、音频播放器。接口覆盖权限失败和异步操作。
3. **专业内容与辅助流程**：统一画布/实验工作台外壳、习题评分与复习、学习动画/历史地图等语义组件、导入/初始化和录制视图。学科引擎与业务服务继续留在课栈。
4. **逐模块接入验收**：安装锁定的库版本，确保 React/Yjs/Tiptap 实例兼容；逐模块切换，检查原任务能力、真实数据、异常、主题、移动端与动画，再完成该模块迁移。

每一项以“源码入口 + 公开接口 + 完整示例 + 状态/主题检查 + 真实业务接入证据”登记。完成这些闸门后，才能宣称对应模块已抽取、重新设计并适合课栈采用。
