# 课栈组件接入对应表

2026-10-20，组件库 0.4.1。登记课栈 components 下 277 个非测试 TSX 源文件。完整范围另含 frontend 的 8 个及 lib 的 3 个 TSX 文件，见 kezhan-source-inventory.json。

本表的组件列是候选接入入口。文件有映射、存在插槽或有相近组件，都不能证明原功能已经抽取完毕。状态列区分通用外壳、部分视图、宿主上下文和本轮专项验收。详见 [抽取与设计复核](kezhan-ui-0.4.1-review.md)。

| 课栈源文件 | 候选组件 | 当前状态 | 接入与能力差距 |
| --- | --- | --- | --- |
| `components/account/AccountCenter.tsx` | `AccountLayout`、`ProductNavigation`、`UserProfile` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/account/CommerceManager.tsx` | `PlanPicker`、`SettingsForm` | 部分视图可用，完整界面待抽取与验收 | PlanPicker 仅选择方案；充值规则、服务价格、会员编辑、支付配置、模型价格同步与覆盖编辑仍需专用视图。 |
| `components/account/CreditsPanel.tsx` | `CreditsOverview`、`LedgerView`、`CapacityOverview` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/account/DirectoryManager.tsx` | `ManagementTable`、`MemberSearch`、`MemberAccess` | 部分视图可用，完整界面待抽取与验收 | 成员和用户组管理、组内成员增删、候选搜索与授权明细尚未形成完整管理视图。 |
| `components/account/ImportLocalStudy.tsx` | `ImportPanel`、`DirectoryPicker` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/account/LedgerView.tsx` | `LedgerView` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/account/LoginScreen.tsx` | `LoginForm` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/account/NotebookManager.tsx` | `ManagementTable`、`VersionHistory`、`VersionDiff`、`ImportPanel` | 部分视图可用，完整界面待抽取与验收 | 笔记本发布状态、来源更新、清单预检、草稿预览、发布与历史恢复组合界面仍需提取。 |
| `components/account/ShareCurrentNotebook.tsx` | `ShareAccessPanel`、`MemberSearch`、`MemberAccess`、`ShareLink`、`PermissionSummary`、`DirectoryPicker` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/account/ShareNotebook.tsx` | `ShareAccessPanel`、`MemberSearch`、`MemberAccess`、`ShareLink`、`PermissionSummary`、`DirectoryPicker` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/account/UserCreditsEditor.tsx` | `CreditAdjustment` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/account/UserDetails.tsx` | `UserProfile`、`CreditAdjustment`、`CapacityOverview`、`PermissionSummary` | 部分视图可用，完整界面待抽取与验收 | 个人资料已有展示；容量调整、管理员状态和组成员编辑仍需完整组合视图。 |
| `components/admin/AdminCenter.tsx` | `AccountLayout`、`ProductNavigation`、`UserProfile` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/admin/AdministratorManager.tsx` | `ManagementTable`、`SettingsForm`、`AsyncAction` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/admin/CapacityManager.tsx` | `ManagementTable`、`SettingsForm`、`AsyncAction` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/admin/PlatformSettingsManager.tsx` | `ManagementTable`、`SettingsForm`、`AsyncAction` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/admin/SystemManager.tsx` | `ManagementTable`、`SettingsForm`、`AsyncAction` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/agent/AgentRunTrace.tsx` | `MessageContentView`、`AgentTrace`、`MarkdownContent`、`ContextMenu` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/agent/AgentWorkspace.tsx` | `RunWorkspace`、`ProductNavigation`、`SessionHistory`、`MessageList`、`ChatComposer` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/browser/BrowserSettingsButton.tsx` | `BrowserSurface`、`SettingsForm`、`EmbedFallback` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/browser/BrowserTab.tsx` | `BrowserSurface`、`SettingsForm`、`EmbedFallback` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/browser/EmbedFallback.tsx` | `EmbedFallback` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/canvas/CanvasBlockRenderer.tsx` | `CanvasWorkbench`、`MarkdownContent` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/canvas/CanvasControls.tsx` | `CanvasWorkbench`、`VersionHistory`、`VersionDiff`、`ErrorState` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/canvas/CanvasDiagnosticPanel.tsx` | `CanvasWorkbench`、`VersionHistory`、`VersionDiff`、`ErrorState` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/canvas/CanvasDirective.tsx` | `CanvasWorkbench`、`MarkdownContent` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/canvas/CanvasFrame.tsx` | `CanvasWorkbench`、`VersionHistory`、`VersionDiff`、`ErrorState` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/canvas/CanvasFullscreenPortal.tsx` | `CanvasWorkbench`、`VersionHistory`、`VersionDiff`、`ErrorState` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/canvas/CanvasRevisionPanel.tsx` | `CanvasWorkbench`、`VersionHistory`、`VersionDiff`、`ErrorState` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/canvas/DiagramCanvas.tsx` | `CanvasWorkbench`、`MarkdownContent` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/canvas/FunctionPlot.tsx` | `CanvasWorkbench`、`MarkdownContent` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/canvas/PlotDirective.tsx` | `CanvasWorkbench`、`MarkdownContent` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/canvas/RawSvgViewer.tsx` | `CanvasWorkbench`、`MarkdownContent` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/canvas/renderers/HtmlRenderer.tsx` | `CanvasWorkbench`、`MarkdownContent` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/canvas/renderers/MoleculeRenderer.tsx` | `CanvasWorkbench`、`MarkdownContent` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/canvas/renderers/MultiPlotRenderer.tsx` | `CanvasWorkbench`、`MarkdownContent` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/canvas/renderers/PlotRenderer.tsx` | `CanvasWorkbench`、`MarkdownContent` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/canvas/renderers/RawSvgRenderer.tsx` | `CanvasWorkbench`、`MarkdownContent` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/canvas/SvgCanvas.tsx` | `CanvasWorkbench`、`MarkdownContent` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/chat/AgentFoldHeader.tsx` | `MessageContentView`、`AgentTrace`、`MarkdownContent`、`ContextMenu` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/AgentTrace.tsx` | `MessageContentView`、`AgentTrace`、`MarkdownContent`、`ContextMenu` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/AgentTraceStep.tsx` | `MessageContentView`、`AgentTrace`、`MarkdownContent`、`ContextMenu` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/ArtifactCard.tsx` | `ArtifactCard`、`Citation`、`FileCard` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/ArtifactViewer.tsx` | `ArtifactPreview`、`MarkdownContent`、`ResourcePreview`、`FloatingWindow` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/AttachmentThumbnails.tsx` | `MediaLightbox`、`AttachmentGrid`、`ContentImage` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/BillingDashboard.tsx` | `CreditsOverview`、`LedgerView`、`CapacityOverview` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/ChatEmptyState.tsx` | `WorkspaceEmpty`、`AIMessage` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/ChatHistoryOverlay.tsx` | `RunWorkspace`、`ProductNavigation`、`SessionHistory`、`MessageList`、`ChatComposer` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/ChatImage.tsx` | `MediaLightbox`、`AttachmentGrid`、`ContentImage` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/ChatInput.tsx` | `ChatComposer`、`ModelSelector`、`ChatPreferencesPanel` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/ChatMessage.tsx` | `MessageContentView`、`AgentTrace`、`MarkdownContent`、`ContextMenu` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/ChatMessageVisualizations.tsx` | `SourceFold`、`MessageContentView`、`CanvasWorkbench` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/ChatPanel.tsx` | `RunWorkspace`、`ProductNavigation`、`SessionHistory`、`MessageList`、`ChatComposer` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/ChatPanelHeader.tsx` | `RunWorkspace`、`ProductNavigation`、`SessionHistory`、`MessageList`、`ChatComposer` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/ChatQuizCard.tsx` | `AttachmentGrid`、`QuizWorkspace`、`QuizQuestion` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/ChatSettings.tsx` | `ChatPreferencesPanel`、`SkillsPanel`、`ModelSelector`、`SelectField` | 部分视图可用，完整界面待抽取与验收 | 模型/API 分组增改删、协议与思考参数、图像模型、默认提示、工具默认值和数据导入导出仍缺完整设置面板。 |
| `components/chat/ChatThread.tsx` | `RunWorkspace`、`ProductNavigation`、`SessionHistory`、`MessageList`、`ChatComposer` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/DocumentCard.tsx` | `ArtifactCard`、`Citation`、`FileCard` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/DocumentViewer.tsx` | `ArtifactPreview`、`MarkdownContent`、`ResourcePreview`、`FloatingWindow` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/FloatingChatBody.tsx` | `FloatingWindow`、`WindowChrome`、`WindowTaskbar`、`ArtifactPreview` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/FloatingChatLayer.tsx` | `FloatingWindow`、`WindowChrome`、`WindowTaskbar`、`ArtifactPreview` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/FloatingChatWindow.tsx` | `FloatingWindow`、`WindowChrome`、`WindowTaskbar`、`ArtifactPreview` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/FollowUpQuestions.tsx` | `WorkspaceEmpty`、`AIMessage` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/ImageGenCard.tsx` | `ArtifactCard`、`Citation`、`FileCard` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/ImageGenViewer.tsx` | `ArtifactPreview`、`MarkdownContent`、`ResourcePreview`、`FloatingWindow` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/ImageStrip.tsx` | `MediaLightbox`、`AttachmentGrid`、`ContentImage` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/MessageContent.tsx` | `MessageContentView`、`AgentTrace`、`MarkdownContent`、`ContextMenu` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/ModelMenu.tsx` | `ChatPreferencesPanel`、`SkillsPanel`、`ModelSelector`、`SelectField` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/NoteCitationCard.tsx` | `ArtifactCard`、`Citation`、`FileCard` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/NoteCitationViewer.tsx` | `ArtifactPreview`、`MarkdownContent`、`ResourcePreview`、`FloatingWindow` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/NoteImageGallery.tsx` | `AttachmentGrid`、`QuizWorkspace`、`QuizQuestion` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/ProcessingSteps.tsx` | `MessageContentView`、`AgentTrace`、`MarkdownContent`、`ContextMenu` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/ReasoningTraceStep.tsx` | `MessageContentView`、`AgentTrace`、`MarkdownContent`、`ContextMenu` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/SkillsManager.tsx` | `SkillsPanel` | 部分视图可用，完整界面待抽取与验收 | SkillsPanel 仅列出技能与启停；技能文件导入、正文和描述编辑、删除、体积信息仍需提取。 |
| `components/chat/SourcePreviewViewer.tsx` | `ArtifactPreview`、`MarkdownContent`、`ResourcePreview`、`FloatingWindow` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/SourceTraceViewer.tsx` | `ArtifactPreview`、`MarkdownContent`、`ResourcePreview`、`FloatingWindow` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/ThinkingMenu.tsx` | `ChatPreferencesPanel`、`SkillsPanel`、`ModelSelector`、`SelectField` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/TokenDashboard.tsx` | `TokenDashboard` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/ToolCallDashboard.tsx` | `MessageContentView`、`AgentTrace`、`MarkdownContent`、`ContextMenu` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/ToolTraceStep.tsx` | `MessageContentView`、`AgentTrace`、`MarkdownContent`、`ContextMenu` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/VizErrorBoundary.tsx` | `ErrorState` | 已有共享组件，完整能力待验收 | 业务异常边界与错误采集保留课栈，错误展示复用组件库。 |
| `components/chat/VizFold.tsx` | `SourceFold`、`MessageContentView`、`CanvasWorkbench` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/WebSourceFold.tsx` | `SourceFold`、`MessageContentView`、`CanvasWorkbench` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/examples/ExampleTab.tsx` | `Bookshelf`、`ProductNavigation`、`MarkdownContent` | 已有共享组件，完整能力待验收 | 例题内容、课程目录与打开路由保留课栈。 |
| `components/icons/AgentIcons.tsx` | `IconButton`、`ModelSelector`、`ProductNavigation` | 已有共享组件，完整能力待验收 | 图标和品牌资源保留宿主映射，通过 icon 插槽接入；五加一 Logo 使用统一地址。 |
| `components/icons/ModelBrandIcons.tsx` | `IconButton`、`ModelSelector`、`ProductNavigation` | 已有共享组件，完整能力待验收 | 图标和品牌资源保留宿主映射，通过 icon 插槽接入；五加一 Logo 使用统一地址。 |
| `components/icons/PencilSparklesIcon.tsx` | `IconButton`、`ModelSelector`、`ProductNavigation` | 已有共享组件，完整能力待验收 | 图标和品牌资源保留宿主映射，通过 icon 插槽接入；五加一 Logo 使用统一地址。 |
| `components/interactives/chemistry/ch01/BondPolarityExplorer.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/chemistry/ch02/IUPACNamingPractice.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/chemistry/ch03/BoilingPointComparator.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/chemistry/ch04/ChairFlip.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/chemistry/ch04/NewmanProjection.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/chemistry/ch05/CarbocationStability.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/chemistry/ch06/MarkovnikovPredictor.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/chemistry/ch07/DieneAddition.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/chemistry/ch08/DirectingEffect.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/chemistry/ch09/ChiralityMirror.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/chemistry/ch09/RSConfigPractice.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/chemistry/ch10/EliminationZaitsev.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/chemistry/ch10/SN1SN2Compare.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/chemistry/ch11/EpoxideOpening.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/chemistry/ch12/CarbonylAddition.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/chemistry/ch13/AcylReactivity.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/chemistry/ch14/AmineBasicity.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/chemistry/ch14/DiazoniumNetwork.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/CustomInteractive.tsx` | `Bookshelf`、`CanvasWorkbench`、`RunWorkspace`、`ImportPanel`、`DirectoryPicker` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/discrete-math/LogicRelationsLabs.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/discrete-math/StructureLabs.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/InteractivePlatform.tsx` | `Bookshelf`、`CanvasWorkbench`、`RunWorkspace`、`ImportPanel`、`DirectoryPicker` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/InteractiveStudio.tsx` | `Bookshelf`、`CanvasWorkbench`、`RunWorkspace`、`ImportPanel`、`DirectoryPicker` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/InteractiveTab.tsx` | `Bookshelf`、`CanvasWorkbench`、`RunWorkspace`、`ImportPanel`、`DirectoryPicker` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/LabWorkbench.tsx` | `Bookshelf`、`CanvasWorkbench`、`RunWorkspace`、`ImportPanel`、`DirectoryPicker` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/numerical-methods/ExtensionLabs.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/numerical-methods/FactorizationLabs.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/numerical-methods/Labs.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/numerical-methods/RecordingPlayer.tsx` | `RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/numerical-methods/SourceViewer.tsx` | `CanvasWorkbench`、`CodeBlock` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/physics/ElectrostaticsLab.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/probability/ch01/BayesExplorer.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/probability/ch01/ClassicalProbLab.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/probability/ch01/FrequencyConvergence.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/probability/ch01/ReliabilityExplorer.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/probability/ch01/SampleSpaceBuilder.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/probability/ch01/VennPlayground.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/probability/ch02/BinomialExplorer.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/probability/ch02/CDFVisualizer.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/probability/ch02/FuncDistDemo.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/probability/ch02/PDFExplorer.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/probability/ch02/RVMapper.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/probability/ch03/ConditionalExplorer.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/probability/ch03/ConvolutionDemo.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/probability/ch03/IndependenceChecker.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/probability/ch03/JointDistExplorer.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/probability/ch03/MarginalExplorer.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/probability/ch04/CorrelationExplorer.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/probability/ch04/CovMatrixDemo.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/probability/ch04/ExpectationExplorer.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/probability/ch04/VarianceExplorer.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/probability/ch05/ChebyshevDemo.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/probability/ch05/CLTSimulator.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/probability/ch05/LLNSimulator.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/probability/ch06/NormalSamplingDemo.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/probability/ch06/QuantileExplorer.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/probability/ch06/SamplingDistExplorer.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/probability/ch06/StatisticCalculator.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/probability/ch07/ConfidenceIntervalExplorer.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/probability/ch07/EstimatorComparator.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/probability/ch07/MLEExplorer.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/probability/ch07/MomentEstimator.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/probability/ch08/ErrorTypeDemo.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/probability/ch08/HypTestDemo.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/probability/ch08/MeanTestExplorer.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/probability/ch08/VarianceTestExplorer.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/probability/ReviewLabs.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/interactives/SaveInteractiveButton.tsx` | `AsyncAction`、`DirectoryPicker` | 共用外壳已提供，专用界面待抽取与验收 | 计算及专用渲染引擎保留宿主；参数面板、编辑与录制界面需逐项抽取。CanvasWorkbench 插槽不代表这些界面已完成。 |
| `components/keyboard/KeyboardShortcutProvider.tsx` | `ShortcutProvider`、`useShortcut` | 已有共享组件，完整能力待验收 | 快捷键注册与可配置界面已提供；宿主连接操作、作用域与持久化。 |
| `components/keyboard/ShortcutHelpOverlay.tsx` | `ShortcutHelp`、`ShortcutSettings`、`ShortcutProvider` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/layout/AcademicYearSwitcher.tsx` | `AcademicYearSwitcher` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/layout/AccessContext.tsx` |  | 宿主上下文保留，相关视图单独接入 | 此文件承担宿主上下文或同步状态，不作为展示组件完成项计数。 |
| `components/layout/AppearanceSettingsControls.tsx` | `SelectField`、`ColorPicker` | 部分视图可用，完整界面待抽取与验收 | 基础主题控件可用；字体、字号及各内容区外观继承设置尚未形成完整配置视图。 |
| `components/layout/AppShell.tsx` | `WorkspaceLayout`、`WorkspaceTabs`、`RunWorkspace` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/layout/BookshelfFilter.tsx` | `Bookshelf`、`SearchInput`、`SelectField` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/layout/BrandLogo.tsx` | `IconButton`、`ModelSelector`、`ProductNavigation` | 已有共享组件，完整能力待验收 | 图标和品牌资源保留宿主映射，通过 icon 插槽接入；五加一 Logo 使用统一地址。 |
| `components/layout/FileTree.tsx` | `FileTree`、`ContextMenu`、`CollapseTransition` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/layout/FileTreeItem.tsx` | `FileTree`、`ContextMenu`、`CollapseTransition` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/layout/GlobalSettings.tsx` | `SettingsForm`、`ShortcutSettings` | 部分视图可用，完整界面待抽取与验收 | 基础控件可复用；实际各分区、外观继承和应用范围需专项组合。 |
| `components/layout/HomeBookshelf.tsx` | `Bookshelf`、`SearchInput`、`SelectField` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/layout/KeyboardShortcutsSettings.tsx` | `ShortcutHelp`、`ShortcutSettings`、`ShortcutProvider` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/layout/MobileBottomNav.tsx` | `ProductNavigation`、`BottomNav` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/layout/MobileChapterPicker.tsx` | `SelectField`、`TocTree` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/layout/MobileProductNav.tsx` | `ProductNavigation`、`BottomNav` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/layout/MobileTopBar.tsx` | `MobileTopBar` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/layout/MobileViewport.tsx` | `Container`、`BottomNav`、`MobileTopBar` | 已有共享组件，完整能力待验收 | 视口、安全区和页面路由由宿主保留。 |
| `components/layout/NewTabPlaceholder.tsx` | `WorkspaceEmpty` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/layout/NotePane.tsx` | `WorkspaceLayout`、`WorkspaceTabs`、`RunWorkspace` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/layout/NoteSplitPane.tsx` | `WorkspaceLayout`、`WorkspaceTabs`、`RunWorkspace` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/layout/NoteTabStrip.tsx` | `WorkspaceTabs` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/layout/ProductSwitcher.tsx` | `ProductNavigation`、`BottomNav` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/layout/RightPanel.tsx` | `WorkspaceLayout`、`WorkspaceTabs`、`RunWorkspace` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/layout/RuntimeCatalogProvider.tsx` |  | 宿主上下文保留，相关视图单独接入 | 此文件承担宿主上下文或同步状态，不作为展示组件完成项计数。 |
| `components/layout/SettingsSection.tsx` | `SettingsForm`、`SettingsSection`、`SelectField` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/layout/SharedNoteToolbar.tsx` | `Toolbar`、`SelectionActions`、`ShareAccessPanel` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/layout/SiblingFilesPanel.tsx` | `SiblingFiles` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/layout/SubjectSidebar.tsx` | `ProductNavigation`、`BottomNav` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/layout/TocTree.tsx` | `TocTree` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/layout/WorkspaceActivity.tsx` | `TaskProgress`、`TaskStatus`、`NotificationList` | 宿主上下文保留，相关视图单独接入 | 此文件承担宿主上下文或同步状态，不作为展示组件完成项计数。 |
| `components/layout/WorkspaceTreeContextMenu.tsx` | `FileTree`、`ContextMenu`、`CollapseTransition` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/notes/AnimatedInlineCard.tsx` | `MarkdownEditor`、`useMathEditor`、`configureMathPreferences`、`ShortcutSettings` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/notes/AttachmentPicker.tsx` | `AttachmentPicker`、`ResourcePreview`、`FileCard` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/notes/AttachmentView.tsx` | `AttachmentPicker`、`ResourcePreview`、`FileCard` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/notes/BacklinksPanel.tsx` | `BacklinksPanel` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/notes/CodeBlockLanguageSelect.tsx` | `MermaidPreview`、`CodeBlock`、`MarkdownEditor`、`SelectField` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/notes/ContentPageClient.tsx` | `MarkdownContent`、`LazyVisible` | 已有共享组件，完整能力待验收 | 服务端读取、流式传输、资源授权和专用渲染器由宿主连接。 |
| `components/notes/DirectiveBlockView.tsx` | `MarkdownEditor`、`DirectiveFields`、`moveEditorBlock`、`deleteEditorBlock` | 已有共享组件，完整能力待验收 | 本地草稿、保存版本与编辑文档身份由宿主连接；节点与通用交互在组件库。 |
| `components/notes/DynamicRecording.tsx` | `RecordingPlayback` | 已有共享组件，完整能力待验收 | 录制事件生成、时钟推进与沙箱场景由课栈连接；回放视图和关键帧导航在组件库。 |
| `components/notes/GraphView.tsx` | `GraphView` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/notes/ImageConversionView.tsx` | `ImagePasteOptions`、`MarkdownEditor`、`UploadPlaceholder`、`ImageConversion` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/notes/ImagePasteDialog.tsx` | `ImagePasteOptions`、`MarkdownEditor`、`UploadPlaceholder`、`ImageConversion` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/notes/ImportVaultDialog.tsx` | `ImportPanel`、`DirectoryPicker` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/notes/MathEditor.tsx` | `MarkdownEditor`、`useMathEditor`、`configureMathPreferences`、`ShortcutSettings` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/notes/MathShortcutSettings.tsx` | `MarkdownEditor`、`useMathEditor`、`configureMathPreferences`、`ShortcutSettings` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/notes/MathSymbolPalette.tsx` | `MarkdownEditor`、`useMathEditor`、`configureMathPreferences`、`ShortcutSettings` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/notes/MemberSearch.tsx` | `ShareAccessPanel`、`MemberSearch`、`MemberAccess`、`ShareLink`、`PermissionSummary`、`DirectoryPicker` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/notes/MermaidCodeBlockView.tsx` | `MermaidPreview`、`CodeBlock`、`MarkdownEditor`、`SelectField` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/notes/MermaidEditor.tsx` | `MermaidPreview`、`CodeBlock`、`MarkdownEditor`、`SelectField` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/notes/NoteAttachmentCard.tsx` | `AttachmentPicker`、`ResourcePreview`、`FileCard` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/notes/NoteLink.tsx` | `NoteLink` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/notes/NoteRenderer.tsx` | `MarkdownContent` | 部分视图可用，完整界面待抽取与验收 | 公式、表格、卡片已提供；双链、标题锚点、内联颜色/高亮及全部专用指令的阅读等价性仍需对照。 |
| `components/notes/NoteRendererServer.tsx` | `MarkdownContent` | 部分视图可用，完整界面待抽取与验收 | 服务端与客户端渲染一致性、专用指令和授权资源仍需宿主集成验证。 |
| `components/notes/NoteSkeleton.tsx` | `Skeleton`、`TaskProgress` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/notes/NoteToolbar.tsx` | `Toolbar`、`SelectionActions`、`ShareAccessPanel` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/notes/NoteWorkspaceActions.tsx` | `Toolbar`、`SelectionActions`、`ShareAccessPanel` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/notes/ProgressiveNoteRenderer.tsx` | `MarkdownContent`、`LazyVisible` | 已有共享组件，完整能力待验收 | 服务端读取、流式传输、资源授权和专用渲染器由宿主连接。 |
| `components/notes/SelectionPopover.tsx` | `SelectionToolbar`、`SelectionActions`、`ColorPicker` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/notes/ToolbarColorPicker.tsx` | `SelectionToolbar`、`SelectionActions`、`ColorPicker` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/notes/UploadPlaceholderView.tsx` | `ImagePasteOptions`、`MarkdownEditor`、`UploadPlaceholder`、`ImageConversion` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/notes/UploadQueue.tsx` | `UploadQueue` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/notes/VisualNoteEditor.tsx` | `MarkdownEditor`、`VersionHistory`、`VersionDiff`、`SaveConflict` | 部分视图可用，完整界面待抽取与验收 | 核心富文本及协作接口可用；保存导航、真实版本恢复、块拖动和既有扩展文档完整往返需产品集成验收。 |
| `components/quiz/QuizMarkdown.tsx` | `MarkdownContent`、`LazyVisible` | 已有共享组件，完整能力待验收 | 服务端读取、流式传输、资源授权和专用渲染器由宿主连接。 |
| `components/quiz/QuizQuestion.tsx` | `QuizQuestion` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/quiz/QuizScoring.tsx` | `QuizScoring` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/quiz/QuizSummary.tsx` | `QuizSummary` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/quiz/QuizTab.tsx` | `QuizWorkspace`、`QuizQuestion`、`MarkdownContent` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/resources/ResourceCenter.tsx` | `ResourceWorkspace`、`ResourceExplorer`、`ResourcePreview`、`RecycleBin` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/resources/ResourcePreview.tsx` | `ResourcePreview`、`PdfPreview`、`AudioPlayer`、`VideoPlayer` | 已有共享组件，完整能力待验收 | 转换服务、鉴权源和真实预览文件由宿主提供。 |
| `components/review/CollapsibleSection.tsx` | `CollapsibleSection`、`CollapseTransition` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/review/FlipCard.tsx` | `FlipCard`、`RecallContent` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/review/RecordPreviewLayer.tsx` | `FloatingWindow`、`WindowChrome`、`WindowTaskbar`、`ArtifactPreview` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/review/RecordPreviewWindow.tsx` | `FloatingWindow`、`WindowChrome`、`WindowTaskbar`、`ArtifactPreview` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/review/ReviewPage.tsx` | `ReviewDashboard`、`MemoryCard` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/search/GlobalSearchButton.tsx` | `SearchResults`、`CommandMenu` | 已有共享组件，完整能力待验收 | 搜索权限、远程与本地合并、定位路由由课栈提供。 |
| `components/setup/SetupWizard.tsx` | `SetupWizard` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/shared/ChoiceMenu.tsx` | `SelectField`、`Popup` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/shared/CodeBlock.tsx` | `MermaidPreview`、`CodeBlock`、`MarkdownEditor`、`SelectField` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/shared/ContentImage.tsx` | `ContentImage` | 本轮视图验收通过，待课栈接入 | 本轮验证失败占位、更换地址恢复及宿主错误回调。 |
| `components/shared/directives/Callout.tsx` | `Callout`、`MarkdownContent` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/shared/directives/CauseEffect.tsx` | `CauseEffect` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/shared/directives/CompareTable.tsx` | `CompareTable` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/shared/directives/ConceptCard.tsx` | `ConceptCard` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/shared/directives/Derivation.tsx` | `Derivation`、`FormulaSteps` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/shared/directives/EventCard.tsx` | `EventCard` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/shared/directives/Figure.tsx` | `Figure`、`ContentImage` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/shared/directives/HistoryMap.tsx` | `HistoryLocationMap`、`HistoryMap` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/shared/directives/KeyPoint.tsx` | `KeyPoint` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/shared/directives/LearningAnimation.tsx` | `LearningAnimation`、`VideoPlayer` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/shared/directives/MediaEmbed.tsx` | `VideoPlayer`、`AudioPlayer`、`EmbedFallback` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/shared/directives/MemoryCard.tsx` | `MemoryCard`、`RecallContent` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/shared/directives/Timeline.tsx` | `ReadingTimeline`、`Timeline` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/shared/FloatingPanel.tsx` | `Popup` | 部分视图可用，完整界面待抽取与验收 | 源组件是锚点定位的受控浮层，需补齐外部 anchor/open 控制契约；FloatingWindow 是拖动窗口，不能直接替代。 |
| `components/shared/HorizontalScrollbar.tsx` | `HorizontalScrollbar` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/shared/ImageLightbox.tsx` | `MediaLightbox` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/shared/MermaidBlock.tsx` | `MermaidPreview`、`CodeBlock`、`MarkdownEditor`、`SelectField` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/shared/MessageContextMenu.tsx` | `ContextMenu`、`SelectionActions` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/shared/PdfPreview.tsx` | `ResourcePreview`、`PdfPreview`、`AudioPlayer`、`VideoPlayer` | 已有共享组件，完整能力待验收 | 转换服务、鉴权源和真实预览文件由宿主提供。 |
| `components/shared/ResizeLoader.tsx` | `Skeleton`、`TaskProgress` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/shared/SubjectIcon.tsx` | `IconButton`、`ModelSelector`、`ProductNavigation` | 已有共享组件，完整能力待验收 | 图标和品牌资源保留宿主映射，通过 icon 插槽接入；五加一 Logo 使用统一地址。 |
| `components/shared/SurfaceBoundary.tsx` | `SurfaceBoundary` | 本轮视图验收通过，待课栈接入 | 本轮提供局部异常恢复、重新挂载和 resetKey 切换；错误诊断交给 onError。验证见 window-recovery.test.tsx。 |
| `components/shared/TaskDialog.tsx` | `Dialog`、`TaskProgress` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/shared/TreeDisclosure.tsx` | `FileTree`、`ContextMenu`、`CollapseTransition` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/shared/WorkspaceLoading.tsx` | `Skeleton`、`TaskProgress` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/ui/AnimatedCollapse.tsx` | `CollapseTransition`、`AnimatedSize` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/ui/LazyVisible.tsx` | `LazyVisible` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/ui/Tip.tsx` | `Tooltip` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/ui/Tooltip.tsx` | `Tooltip` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/video/ClassroomProgress.tsx` | `ClassroomTimeline`、`Progress` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/video/InlinePlayer.tsx` | `VideoPlayer`、`LectureDock`、`ClassroomTimeline` | 已有共享组件，完整能力待验收 | 授权刷新、缓冲看门狗、播放位置持久化与课堂路由保留宿主；播放器提供 videoRef 和事件接入。 |
| `components/video/LectureDock.tsx` | `LectureDock` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/video/LecturePlayer.tsx` | `VideoPlayer`、`LectureDock`、`ClassroomTimeline` | 已有共享组件，完整能力待验收 | 授权刷新、缓冲看门狗、播放位置持久化与课堂路由保留宿主；播放器提供 videoRef 和事件接入。 |
| `components/video/PipPlayer.tsx` | `VideoPlayer`、`FloatingWindow`、`LectureDock` | 部分视图可用，完整界面待抽取与验收 | 播放及窗口已有独立组件；画中画几何、鉴权刷新、时间恢复、字幕与课堂联动仍需组合验收。 |
| `components/video/VideoTab.tsx` | `VideoPlayer`、`LectureDock`、`ClassroomTimeline` | 已有共享组件，完整能力待验收 | 授权刷新、缓冲看门狗、播放位置持久化与课堂路由保留宿主；播放器提供 videoRef 和事件接入。 |
| `components/visualizations/primitives/DistributionChart.tsx` | `DistributionChart` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/visualizations/primitives/FormulaSteps.tsx` | `Derivation`、`FormulaSteps` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/visualizations/primitives/VennDiagram.tsx` | `VennDiagram` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/visualizations/primitives/VideoPlayer.tsx` | `VideoPlayer`、`LectureDock`、`ClassroomTimeline` | 已有共享组件，完整能力待验收 | 授权刷新、缓冲看门狗、播放位置持久化与课堂路由保留宿主；播放器提供 videoRef 和事件接入。 |
| `components/window/OverflowMenu.tsx` | `WindowTaskbar`、`Dropdown` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
| `components/window/WindowChrome.tsx` | `WindowChrome` | 本轮视图验收通过，待课栈接入 | 标题在左，操作位于右侧，关闭按钮在最右；验证键盘、拖动隔离和窄容器位置。外部打开操作通过 actions 接入。 |
| `components/window/WindowTaskbar.tsx` | `WindowTaskbar`、`Dropdown` | 已有共享组件，完整能力待验收 | 业务数据、授权和持久化由课栈连接。 |
