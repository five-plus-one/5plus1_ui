# 课栈组件设计与接入审计

版本 0.3.5，2026-10-20。直接扫描当前 components 目录，排除测试文件，共 277 个 TSX 文件；文件数不等于独立产品组件数。设计目录提供 126 项入口。

## 本轮统一机制

- 基础树的分支与子项纵向排列；展开与收起保留高度过渡。
- FileTree 在节点上提供打开、展开、改名和移除菜单；MarkdownEditor 根据文字、链接和表格位置提供编辑菜单。
- CollaborativeEditor 复用完整 MarkdownEditor，公式、表格、卡片与 Markdown 序列化共享同一编辑结构。
- VideoPlayer 在播放器获得焦点时响应快捷键，文件资源中的视频复用同一播放器；表单控件保留自己的键盘行为。

- 行内公式按所在段落完成收起过渡，覆盖后续文字回到同行时的重排；独立公式按当前渲染高度收拢。收起时以 220ms 过渡同步卡片快照和段落高度，减少动态效果时直接切换。
- MemberSearch 与 SegmentedControl 共享短时移动底色和文字颜色过渡。
- SelectField 超过 8 项自动显示搜索，列表高度限制 224px；卡片类型切换迁移标题属性，保留正文。
- ContextMenu 支持指针、Shift+F10、方向键、子菜单、Escape、外部点击及视口约束。
- ResourceExplorer 提供列表与网格、路径、上级导航、当前目录搜索、排序、多选、文件与空白区域菜单。真实下载、分享、改名和回收由宿主实现。当前不包含拖放上传、框选和大目录虚拟滚动。

- 文件树、基础树、手风琴、推导使用连续高度过渡；来源、工作记录、设置和概念卡片的收起内容退出键盘路径。
- 共用浮层支持外部点击、Escape、焦点恢复、方向键和退出过渡；窗口任务栏溢出菜单复用该机制。
- 编辑器正文使用适合连续写作的焦点样式；公式在正文内展开，连续测量高度；矩阵、卡片、代码语言和快捷输入规则采用 SelectField。
- Mermaid 支持严格模式 SVG 预览、模板、源码修改和 Markdown 保存，主题切换同步图表。
- 分享补齐 MemberSearch、ShareLink；资料补齐 AttachmentPicker、UploadQueue。搜索、权限、上传和保存均通过宿主回调接入。
- 横向滚动条拖动直接跟手，悬停和键盘聚焦扩展握持区域；动画尊重减少动态效果。

## 迁移映射与边界

### 0.3.5 编辑与动画专项

| 项目 | 本轮处理与验证 |
| --- | --- |
| 行内公式 | 浏览器确认收起后公式与后续文字回到同行；保留 220ms 段落与卡片过渡。重新展开时取消上一轮的高度、透明度和快照，自动检查动画结束与快速重开清理。 |
| Markdown 快捷插入 | 浏览器输入 `/mermaid` 并按回车，插入图表且移除命令文本。 |
| Mermaid 编辑 | 浏览器修改源码、Escape 完成并看到图表更新；进入源码时聚焦输入，结束后返回编辑按钮；源码展示采用高度过渡。 |
| 多人编辑 | 浏览器验证两个视图同步文字和 Mermaid 节点；既有自动检查覆盖公式、卡片和表格共享。 |
| 文本文件预览 | 较慢返回的上一份文件不会覆盖当前文件，自动检查请求响应乱序。 |
| 文档切换 | 示例中的 PDF、Word、演示文稿、表格复用预览容器，保留展开状态；新文件回到第一页。自动检查状态保持，浏览器验证 PDF 与 Word 切换。 |
| 尺寸测量 | ResizeObserver 不可用时仍执行首次测量。连续尺寸变化使用既有测量过渡；PDF 页图加载、触摸缩放和跨类型文件切换的逐帧效果继续保留专项验收项。 |

本轮 65 项自动检查通过。浏览器静态结果与动画生命周期检查分别记录，尚未以高帧率录像核验逐帧过渡。

### 0.3.4 逐项验收记录

| 组件 | 本批检查与结果 | 证据范围 |
| --- | --- | --- |
| Tabs、SegmentedControl | 标签按钮明确使用普通操作类型；空列表和组合按键保留正常行为 | 自动检查、源码检查 |
| Switch、Rating | 表单内切换与评分只触发自身操作 | 真实点击自动检查 |
| Navigation、Citation、FileCard、Calendar、CommandMenu、NotificationList、ImagePreview | 明确声明按钮的表单行为 | 全目录示例按钮扫描、源码检查 |
| DatePicker | 外部日期更新后定位对应月份；输入的日期与范围参与表单校验；选择后关闭并恢复焦点 | 自动检查、浏览器手机预览 |
| TimePicker | 超范围选项禁用；切换小时自动落在可用分钟内；手输值参与校验 | 自动检查 |
| ColorPicker | HEX 草稿跟随受控颜色更新 | 自动检查 |
| Select、SelectField | 搜索打开时聚焦输入框；回车选择匹配的可用项；选择后关闭菜单 | 自动检查、浏览器键盘选择 |
| Combobox | 保留现有键盘选择与外部点击行为 | 现有自动检查，本批未做完整浏览器复验 |
| Accordion | 多项可分别展开；收起内容退出键盘路径 | 自动检查、浏览器手机预览 |
| MemberSearch | 方向键跳过禁用成员；当前项滚动进入视野；组件禁用时关闭结果展示；头像避免重复朗读姓名 | 自动检查、源码检查 |
| FileTree | 右键打开与点击打开均通知宿主；右键本身不打开文件 | 自动检查 |
| VideoPlayer | 全屏失败提示与播放错误分别展示，视频仍保持可操作 | 自动检查、浏览器手机预览控制栏 |

本批共 64 项自动检查通过，其中包含全目录渲染与按钮行为扫描。表格仅记录实际覆盖范围；动画的连续视觉效果、触摸设备、真实鉴权媒体以及业务接入仍需专项验收。

| 区域 | 共用入口 | 接入时的工作 |
| --- | --- | --- |
| 布局与窗口 | WorkspaceLayout、WindowChrome、WindowTaskbar | 账户宽度、窗口生命周期和移动导航 |
| 文件与资源 | FileTree、ResourcePreview、PdfPreview、AttachmentPicker、UploadQueue | 全路径标识、预取、鉴权、转换、上传重试 |
| 笔记编辑 | MarkdownEditor、公式工具、Mermaid 与代码视图 | 草稿保存、冲突、历史、专有指令和资源解析 |
| 分享与账户 | MemberSearch、MemberAccess、ShareLink、表单与 Dialog | 搜索服务、权限校验、真实分享地址、积分和管理流程 |
| AI 对话 | MessageList、ChatComposer、ModelSelector、AgentTrace、SourceFold | SSE、复杂消息、历史恢复与业务事件 |
| 播放与课堂 | VideoPlayer、嵌入与媒体控件 | 授权刷新、播放记录、课程时间轴 |
| 内容与复习 | NoteBlocks、FormulaSteps、FlipCard、QuizQuestion 等 | 专用阅读器、复习存储与评分 |
| 画布与交互实验 | 图表及交互容器 | 课栈 canvas 与 interactives 仍包含专用引擎和学科场景，应保留业务渲染器并接入主题与操作控件 |

全部组件目录渲染通过不能代替生产业务验收。画布、学科交互、管理页和完整任务流程尚须在课栈迁移时逐页验证。当前清单提供真实源码范围，不把整页服务流程计为已完成迁移。

## 当前源码清单

### account（12）

`AccountCenter`, `CommerceManager`, `CreditsPanel`, `DirectoryManager`, `ImportLocalStudy`, `LedgerView`, `LoginScreen`, `NotebookManager`, `ShareCurrentNotebook`, `ShareNotebook`, `UserCreditsEditor`, `UserDetails`

### admin（5）

`AdminCenter`, `AdministratorManager`, `CapacityManager`, `PlatformSettingsManager`, `SystemManager`

### agent（2）

`AgentRunTrace`, `AgentWorkspace`

### browser（3）

`BrowserSettingsButton`, `BrowserTab`, `EmbedFallback`

### canvas（17）

`CanvasBlockRenderer`, `CanvasControls`, `CanvasDiagnosticPanel`, `CanvasDirective`, `CanvasFrame`, `CanvasFullscreenPortal`, `CanvasRevisionPanel`, `DiagramCanvas`, `FunctionPlot`, `PlotDirective`, `RawSvgViewer`, `HtmlRenderer`, `MoleculeRenderer`, `MultiPlotRenderer`, `PlotRenderer`, `RawSvgRenderer`, `SvgCanvas`

### chat（44）

`AgentFoldHeader`, `AgentTrace`, `AgentTraceStep`, `ArtifactCard`, `ArtifactViewer`, `AttachmentThumbnails`, `BillingDashboard`, `ChatEmptyState`, `ChatHistoryOverlay`, `ChatImage`, `ChatInput`, `ChatMessage`, `ChatMessageVisualizations`, `ChatPanel`, `ChatPanelHeader`, `ChatQuizCard`, `ChatSettings`, `ChatThread`, `DocumentCard`, `DocumentViewer`, `FloatingChatBody`, `FloatingChatLayer`, `FloatingChatWindow`, `FollowUpQuestions`, `ImageGenCard`, `ImageGenViewer`, `ImageStrip`, `MessageContent`, `ModelMenu`, `NoteCitationCard`, `NoteCitationViewer`, `NoteImageGallery`, `ProcessingSteps`, `ReasoningTraceStep`, `SkillsManager`, `SourcePreviewViewer`, `SourceTraceViewer`, `ThinkingMenu`, `TokenDashboard`, `ToolCallDashboard`, `ToolTraceStep`, `VizErrorBoundary`, `VizFold`, `WebSourceFold`

### examples（1）

`ExampleTab`

### icons（3）

`AgentIcons`, `ModelBrandIcons`, `PencilSparklesIcon`

### interactives（68）

`BondPolarityExplorer`, `IUPACNamingPractice`, `BoilingPointComparator`, `ChairFlip`, `NewmanProjection`, `CarbocationStability`, `MarkovnikovPredictor`, `DieneAddition`, `DirectingEffect`, `ChiralityMirror`, `RSConfigPractice`, `EliminationZaitsev`, `SN1SN2Compare`, `EpoxideOpening`, `CarbonylAddition`, `AcylReactivity`, `AmineBasicity`, `DiazoniumNetwork`, `CustomInteractive`, `LogicRelationsLabs`, `StructureLabs`, `InteractivePlatform`, `InteractiveStudio`, `InteractiveTab`, `LabWorkbench`, `ExtensionLabs`, `FactorizationLabs`, `Labs`, `RecordingPlayer`, `SourceViewer`, `ElectrostaticsLab`, `BayesExplorer`, `ClassicalProbLab`, `FrequencyConvergence`, `ReliabilityExplorer`, `SampleSpaceBuilder`, `VennPlayground`, `BinomialExplorer`, `CDFVisualizer`, `FuncDistDemo`, `PDFExplorer`, `RVMapper`, `ConditionalExplorer`, `ConvolutionDemo`, `IndependenceChecker`, `JointDistExplorer`, `MarginalExplorer`, `CorrelationExplorer`, `CovMatrixDemo`, `ExpectationExplorer`, `VarianceExplorer`, `ChebyshevDemo`, `CLTSimulator`, `LLNSimulator`, `NormalSamplingDemo`, `QuantileExplorer`, `SamplingDistExplorer`, `StatisticCalculator`, `ConfidenceIntervalExplorer`, `EstimatorComparator`, `MLEExplorer`, `MomentEstimator`, `ErrorTypeDemo`, `HypTestDemo`, `MeanTestExplorer`, `VarianceTestExplorer`, `ReviewLabs`, `SaveInteractiveButton`

### keyboard（2）

`KeyboardShortcutProvider`, `ShortcutHelpOverlay`

### layout（30）

`AcademicYearSwitcher`, `AccessContext`, `AppearanceSettingsControls`, `AppShell`, `BookshelfFilter`, `BrandLogo`, `FileTree`, `FileTreeItem`, `GlobalSettings`, `HomeBookshelf`, `KeyboardShortcutsSettings`, `MobileBottomNav`, `MobileChapterPicker`, `MobileProductNav`, `MobileTopBar`, `MobileViewport`, `NewTabPlaceholder`, `NotePane`, `NoteSplitPane`, `NoteTabStrip`, `ProductSwitcher`, `RightPanel`, `RuntimeCatalogProvider`, `SettingsSection`, `SharedNoteToolbar`, `SiblingFilesPanel`, `SubjectSidebar`, `TocTree`, `WorkspaceActivity`, `WorkspaceTreeContextMenu`

### notes（31）

`AnimatedInlineCard`, `AttachmentPicker`, `AttachmentView`, `BacklinksPanel`, `CodeBlockLanguageSelect`, `ContentPageClient`, `DirectiveBlockView`, `DynamicRecording`, `GraphView`, `ImageConversionView`, `ImagePasteDialog`, `ImportVaultDialog`, `MathEditor`, `MathShortcutSettings`, `MathSymbolPalette`, `MemberSearch`, `MermaidCodeBlockView`, `MermaidEditor`, `NoteAttachmentCard`, `NoteLink`, `NoteRenderer`, `NoteRendererServer`, `NoteSkeleton`, `NoteToolbar`, `NoteWorkspaceActions`, `ProgressiveNoteRenderer`, `SelectionPopover`, `ToolbarColorPicker`, `UploadPlaceholderView`, `UploadQueue`, `VisualNoteEditor`

### quiz（5）

`QuizMarkdown`, `QuizQuestion`, `QuizScoring`, `QuizSummary`, `QuizTab`

### resources（2）

`ResourceCenter`, `ResourcePreview`

### review（5）

`CollapsibleSection`, `FlipCard`, `RecordPreviewLayer`, `RecordPreviewWindow`, `ReviewPage`

### search（1）

`GlobalSearchButton`

### setup（1）

`SetupWizard`

### shared（28）

`ChoiceMenu`, `CodeBlock`, `ContentImage`, `Callout`, `CauseEffect`, `CompareTable`, `ConceptCard`, `Derivation`, `EventCard`, `Figure`, `HistoryMap`, `KeyPoint`, `LearningAnimation`, `MediaEmbed`, `MemoryCard`, `Timeline`, `FloatingPanel`, `HorizontalScrollbar`, `ImageLightbox`, `MermaidBlock`, `MessageContextMenu`, `PdfPreview`, `ResizeLoader`, `SubjectIcon`, `SurfaceBoundary`, `TaskDialog`, `TreeDisclosure`, `WorkspaceLoading`

### ui（4）

`AnimatedCollapse`, `LazyVisible`, `Tip`, `Tooltip`

### video（6）

`ClassroomProgress`, `InlinePlayer`, `LectureDock`, `LecturePlayer`, `PipPlayer`, `VideoTab`

### visualizations（4）

`DistributionChart`, `FormulaSteps`, `VennDiagram`, `VideoPlayer`

### window（3）

`OverflowMenu`, `WindowChrome`, `WindowTaskbar`
