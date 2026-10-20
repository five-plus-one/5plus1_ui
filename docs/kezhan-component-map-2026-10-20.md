# 课栈组件接入对应表

2026-10-20，组件库工作版本 0.4.0。逐文件登记课栈 components 下的展示层、业务容器、数据提供器与学科内容。

“视图接口已提供”表示可复用入口已经存在，不表示该课栈文件已完成替换或真实服务验收。业务数据、算法内容和专用渲染引擎的保留属于明确的接入边界。学科实验还需在课栈重构阶段替换其参数控件。

| 课栈源文件 | 组件库入口 | 接入说明 |
| --- | --- | --- |
| `components/account/AccountCenter.tsx` | `AccountLayout`、`ProductNavigation`、`UserProfile` | 业务数据、授权和持久化由课栈连接。 |
| `components/account/CommerceManager.tsx` | `PlanPicker` | 业务数据、授权和持久化由课栈连接。 |
| `components/account/CreditsPanel.tsx` | `CreditsOverview`、`LedgerView`、`CapacityOverview` | 业务数据、授权和持久化由课栈连接。 |
| `components/account/DirectoryManager.tsx` | `ManagementTable`、`SettingsForm`、`AsyncAction` | 业务数据、授权和持久化由课栈连接。 |
| `components/account/ImportLocalStudy.tsx` | `ImportPanel`、`DirectoryPicker` | 业务数据、授权和持久化由课栈连接。 |
| `components/account/LedgerView.tsx` | `LedgerView` | 业务数据、授权和持久化由课栈连接。 |
| `components/account/LoginScreen.tsx` | `LoginForm` | 业务数据、授权和持久化由课栈连接。 |
| `components/account/NotebookManager.tsx` | `ManagementTable`、`SettingsForm`、`AsyncAction` | 业务数据、授权和持久化由课栈连接。 |
| `components/account/ShareCurrentNotebook.tsx` | `ShareAccessPanel`、`MemberSearch`、`MemberAccess`、`ShareLink`、`PermissionSummary`、`DirectoryPicker` | 业务数据、授权和持久化由课栈连接。 |
| `components/account/ShareNotebook.tsx` | `ShareAccessPanel`、`MemberSearch`、`MemberAccess`、`ShareLink`、`PermissionSummary`、`DirectoryPicker` | 业务数据、授权和持久化由课栈连接。 |
| `components/account/UserCreditsEditor.tsx` | `CreditAdjustment` | 业务数据、授权和持久化由课栈连接。 |
| `components/account/UserDetails.tsx` | `UserProfile` | 业务数据、授权和持久化由课栈连接。 |
| `components/admin/AdminCenter.tsx` | `AccountLayout`、`ProductNavigation`、`UserProfile` | 业务数据、授权和持久化由课栈连接。 |
| `components/admin/AdministratorManager.tsx` | `ManagementTable`、`SettingsForm`、`AsyncAction` | 业务数据、授权和持久化由课栈连接。 |
| `components/admin/CapacityManager.tsx` | `ManagementTable`、`SettingsForm`、`AsyncAction` | 业务数据、授权和持久化由课栈连接。 |
| `components/admin/PlatformSettingsManager.tsx` | `ManagementTable`、`SettingsForm`、`AsyncAction` | 业务数据、授权和持久化由课栈连接。 |
| `components/admin/SystemManager.tsx` | `ManagementTable`、`SettingsForm`、`AsyncAction` | 业务数据、授权和持久化由课栈连接。 |
| `components/agent/AgentRunTrace.tsx` | `MessageContentView`、`AgentTrace`、`MarkdownContent`、`ContextMenu` | 业务数据、授权和持久化由课栈连接。 |
| `components/agent/AgentWorkspace.tsx` | `RunWorkspace`、`ProductNavigation`、`SessionHistory`、`MessageList`、`ChatComposer` | 业务数据、授权和持久化由课栈连接。 |
| `components/browser/BrowserSettingsButton.tsx` | `BrowserSurface`、`SettingsForm`、`EmbedFallback` | 业务数据、授权和持久化由课栈连接。 |
| `components/browser/BrowserTab.tsx` | `BrowserSurface`、`SettingsForm`、`EmbedFallback` | 业务数据、授权和持久化由课栈连接。 |
| `components/browser/EmbedFallback.tsx` | `EmbedFallback` | 业务数据、授权和持久化由课栈连接。 |
| `components/canvas/CanvasBlockRenderer.tsx` | `CanvasWorkbench`、`MarkdownContent` | SVG/HTML/函数图/分子与多图渲染引擎保留宿主，通过 renderDirective 和工作台内容插槽接入。 |
| `components/canvas/CanvasControls.tsx` | `CanvasWorkbench`、`VersionHistory`、`VersionDiff`、`ErrorState` | 保留专用画布数据与渲染引擎，挂接工作台的 tools、inspector、source、children、onRun/onSave。 |
| `components/canvas/CanvasDiagnosticPanel.tsx` | `CanvasWorkbench`、`VersionHistory`、`VersionDiff`、`ErrorState` | 保留专用画布数据与渲染引擎，挂接工作台的 tools、inspector、source、children、onRun/onSave。 |
| `components/canvas/CanvasDirective.tsx` | `CanvasWorkbench`、`MarkdownContent` | SVG/HTML/函数图/分子与多图渲染引擎保留宿主，通过 renderDirective 和工作台内容插槽接入。 |
| `components/canvas/CanvasFrame.tsx` | `CanvasWorkbench`、`VersionHistory`、`VersionDiff`、`ErrorState` | 保留专用画布数据与渲染引擎，挂接工作台的 tools、inspector、source、children、onRun/onSave。 |
| `components/canvas/CanvasFullscreenPortal.tsx` | `CanvasWorkbench`、`VersionHistory`、`VersionDiff`、`ErrorState` | 保留专用画布数据与渲染引擎，挂接工作台的 tools、inspector、source、children、onRun/onSave。 |
| `components/canvas/CanvasRevisionPanel.tsx` | `CanvasWorkbench`、`VersionHistory`、`VersionDiff`、`ErrorState` | 保留专用画布数据与渲染引擎，挂接工作台的 tools、inspector、source、children、onRun/onSave。 |
| `components/canvas/DiagramCanvas.tsx` | `CanvasWorkbench`、`MarkdownContent` | SVG/HTML/函数图/分子与多图渲染引擎保留宿主，通过 renderDirective 和工作台内容插槽接入。 |
| `components/canvas/FunctionPlot.tsx` | `CanvasWorkbench`、`MarkdownContent` | SVG/HTML/函数图/分子与多图渲染引擎保留宿主，通过 renderDirective 和工作台内容插槽接入。 |
| `components/canvas/PlotDirective.tsx` | `CanvasWorkbench`、`MarkdownContent` | SVG/HTML/函数图/分子与多图渲染引擎保留宿主，通过 renderDirective 和工作台内容插槽接入。 |
| `components/canvas/RawSvgViewer.tsx` | `CanvasWorkbench`、`MarkdownContent` | SVG/HTML/函数图/分子与多图渲染引擎保留宿主，通过 renderDirective 和工作台内容插槽接入。 |
| `components/canvas/renderers/HtmlRenderer.tsx` | `CanvasWorkbench`、`MarkdownContent` | SVG/HTML/函数图/分子与多图渲染引擎保留宿主，通过 renderDirective 和工作台内容插槽接入。 |
| `components/canvas/renderers/MoleculeRenderer.tsx` | `CanvasWorkbench`、`MarkdownContent` | SVG/HTML/函数图/分子与多图渲染引擎保留宿主，通过 renderDirective 和工作台内容插槽接入。 |
| `components/canvas/renderers/MultiPlotRenderer.tsx` | `CanvasWorkbench`、`MarkdownContent` | SVG/HTML/函数图/分子与多图渲染引擎保留宿主，通过 renderDirective 和工作台内容插槽接入。 |
| `components/canvas/renderers/PlotRenderer.tsx` | `CanvasWorkbench`、`MarkdownContent` | SVG/HTML/函数图/分子与多图渲染引擎保留宿主，通过 renderDirective 和工作台内容插槽接入。 |
| `components/canvas/renderers/RawSvgRenderer.tsx` | `CanvasWorkbench`、`MarkdownContent` | SVG/HTML/函数图/分子与多图渲染引擎保留宿主，通过 renderDirective 和工作台内容插槽接入。 |
| `components/canvas/SvgCanvas.tsx` | `CanvasWorkbench`、`MarkdownContent` | SVG/HTML/函数图/分子与多图渲染引擎保留宿主，通过 renderDirective 和工作台内容插槽接入。 |
| `components/chat/AgentFoldHeader.tsx` | `MessageContentView`、`AgentTrace`、`MarkdownContent`、`ContextMenu` | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/AgentTrace.tsx` | `MessageContentView`、`AgentTrace`、`MarkdownContent`、`ContextMenu` | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/AgentTraceStep.tsx` | `MessageContentView`、`AgentTrace`、`MarkdownContent`、`ContextMenu` | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/ArtifactCard.tsx` | `ArtifactCard`、`Citation`、`FileCard` | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/ArtifactViewer.tsx` | `ArtifactPreview`、`MarkdownContent`、`ResourcePreview`、`FloatingWindow` | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/AttachmentThumbnails.tsx` | `MediaLightbox`、`AttachmentGrid`、`ContentImage` | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/BillingDashboard.tsx` | `CreditsOverview`、`LedgerView`、`CapacityOverview` | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/ChatEmptyState.tsx` | `WorkspaceEmpty`、`AIMessage` | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/ChatHistoryOverlay.tsx` | `RunWorkspace`、`ProductNavigation`、`SessionHistory`、`MessageList`、`ChatComposer` | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/ChatImage.tsx` | `MediaLightbox`、`AttachmentGrid`、`ContentImage` | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/ChatInput.tsx` | `ChatComposer`、`ModelSelector`、`ChatPreferencesPanel` | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/ChatMessage.tsx` | `MessageContentView`、`AgentTrace`、`MarkdownContent`、`ContextMenu` | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/ChatMessageVisualizations.tsx` | `SourceFold`、`MessageContentView`、`CanvasWorkbench` | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/ChatPanel.tsx` | `RunWorkspace`、`ProductNavigation`、`SessionHistory`、`MessageList`、`ChatComposer` | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/ChatPanelHeader.tsx` | `RunWorkspace`、`ProductNavigation`、`SessionHistory`、`MessageList`、`ChatComposer` | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/ChatQuizCard.tsx` | `AttachmentGrid`、`QuizWorkspace`、`QuizQuestion` | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/ChatSettings.tsx` | `ChatPreferencesPanel`、`SkillsPanel`、`ModelSelector`、`SelectField` | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/ChatThread.tsx` | `RunWorkspace`、`ProductNavigation`、`SessionHistory`、`MessageList`、`ChatComposer` | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/DocumentCard.tsx` | `ArtifactCard`、`Citation`、`FileCard` | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/DocumentViewer.tsx` | `ArtifactPreview`、`MarkdownContent`、`ResourcePreview`、`FloatingWindow` | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/FloatingChatBody.tsx` | `FloatingWindow`、`WindowChrome`、`WindowTaskbar`、`ArtifactPreview` | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/FloatingChatLayer.tsx` | `FloatingWindow`、`WindowChrome`、`WindowTaskbar`、`ArtifactPreview` | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/FloatingChatWindow.tsx` | `FloatingWindow`、`WindowChrome`、`WindowTaskbar`、`ArtifactPreview` | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/FollowUpQuestions.tsx` | `WorkspaceEmpty`、`AIMessage` | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/ImageGenCard.tsx` | `ArtifactCard`、`Citation`、`FileCard` | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/ImageGenViewer.tsx` | `ArtifactPreview`、`MarkdownContent`、`ResourcePreview`、`FloatingWindow` | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/ImageStrip.tsx` | `MediaLightbox`、`AttachmentGrid`、`ContentImage` | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/MessageContent.tsx` | `MessageContentView`、`AgentTrace`、`MarkdownContent`、`ContextMenu` | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/ModelMenu.tsx` | `ChatPreferencesPanel`、`SkillsPanel`、`ModelSelector`、`SelectField` | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/NoteCitationCard.tsx` | `ArtifactCard`、`Citation`、`FileCard` | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/NoteCitationViewer.tsx` | `ArtifactPreview`、`MarkdownContent`、`ResourcePreview`、`FloatingWindow` | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/NoteImageGallery.tsx` | `AttachmentGrid`、`QuizWorkspace`、`QuizQuestion` | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/ProcessingSteps.tsx` | `MessageContentView`、`AgentTrace`、`MarkdownContent`、`ContextMenu` | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/ReasoningTraceStep.tsx` | `MessageContentView`、`AgentTrace`、`MarkdownContent`、`ContextMenu` | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/SkillsManager.tsx` | `ChatPreferencesPanel`、`SkillsPanel`、`ModelSelector`、`SelectField` | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/SourcePreviewViewer.tsx` | `ArtifactPreview`、`MarkdownContent`、`ResourcePreview`、`FloatingWindow` | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/SourceTraceViewer.tsx` | `ArtifactPreview`、`MarkdownContent`、`ResourcePreview`、`FloatingWindow` | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/ThinkingMenu.tsx` | `ChatPreferencesPanel`、`SkillsPanel`、`ModelSelector`、`SelectField` | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/TokenDashboard.tsx` | `TokenDashboard` | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/ToolCallDashboard.tsx` | `MessageContentView`、`AgentTrace`、`MarkdownContent`、`ContextMenu` | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/ToolTraceStep.tsx` | `MessageContentView`、`AgentTrace`、`MarkdownContent`、`ContextMenu` | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/VizErrorBoundary.tsx` | `ErrorState` | 业务异常边界与错误采集保留课栈，错误展示复用组件库。 |
| `components/chat/VizFold.tsx` | `SourceFold`、`MessageContentView`、`CanvasWorkbench` | 业务数据、授权和持久化由课栈连接。 |
| `components/chat/WebSourceFold.tsx` | `SourceFold`、`MessageContentView`、`CanvasWorkbench` | 业务数据、授权和持久化由课栈连接。 |
| `components/examples/ExampleTab.tsx` | `Bookshelf`、`ProductNavigation`、`MarkdownContent` | 例题内容、课程目录与打开路由保留课栈。 |
| `components/icons/AgentIcons.tsx` | `IconButton`、`ModelSelector`、`ProductNavigation` | 图标和品牌资源保留宿主映射，通过 icon 插槽接入；五加一 Logo 使用统一地址。 |
| `components/icons/ModelBrandIcons.tsx` | `IconButton`、`ModelSelector`、`ProductNavigation` | 图标和品牌资源保留宿主映射，通过 icon 插槽接入；五加一 Logo 使用统一地址。 |
| `components/icons/PencilSparklesIcon.tsx` | `IconButton`、`ModelSelector`、`ProductNavigation` | 图标和品牌资源保留宿主映射，通过 icon 插槽接入；五加一 Logo 使用统一地址。 |
| `components/interactives/chemistry/ch01/BondPolarityExplorer.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/chemistry/ch02/IUPACNamingPractice.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/chemistry/ch03/BoilingPointComparator.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/chemistry/ch04/ChairFlip.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/chemistry/ch04/NewmanProjection.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/chemistry/ch05/CarbocationStability.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/chemistry/ch06/MarkovnikovPredictor.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/chemistry/ch07/DieneAddition.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/chemistry/ch08/DirectingEffect.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/chemistry/ch09/ChiralityMirror.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/chemistry/ch09/RSConfigPractice.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/chemistry/ch10/EliminationZaitsev.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/chemistry/ch10/SN1SN2Compare.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/chemistry/ch11/EpoxideOpening.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/chemistry/ch12/CarbonylAddition.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/chemistry/ch13/AcylReactivity.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/chemistry/ch14/AmineBasicity.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/chemistry/ch14/DiazoniumNetwork.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/CustomInteractive.tsx` | `Bookshelf`、`CanvasWorkbench`、`RunWorkspace`、`ImportPanel`、`DirectoryPicker` | 实验注册、学科计算、沙箱执行与生成服务保留课栈，目录、工作台和操作面板复用组件库。 |
| `components/interactives/discrete-math/LogicRelationsLabs.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/discrete-math/StructureLabs.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/InteractivePlatform.tsx` | `Bookshelf`、`CanvasWorkbench`、`RunWorkspace`、`ImportPanel`、`DirectoryPicker` | 实验注册、学科计算、沙箱执行与生成服务保留课栈，目录、工作台和操作面板复用组件库。 |
| `components/interactives/InteractiveStudio.tsx` | `Bookshelf`、`CanvasWorkbench`、`RunWorkspace`、`ImportPanel`、`DirectoryPicker` | 实验注册、学科计算、沙箱执行与生成服务保留课栈，目录、工作台和操作面板复用组件库。 |
| `components/interactives/InteractiveTab.tsx` | `Bookshelf`、`CanvasWorkbench`、`RunWorkspace`、`ImportPanel`、`DirectoryPicker` | 实验注册、学科计算、沙箱执行与生成服务保留课栈，目录、工作台和操作面板复用组件库。 |
| `components/interactives/LabWorkbench.tsx` | `Bookshelf`、`CanvasWorkbench`、`RunWorkspace`、`ImportPanel`、`DirectoryPicker` | 实验注册、学科计算、沙箱执行与生成服务保留课栈，目录、工作台和操作面板复用组件库。 |
| `components/interactives/numerical-methods/ExtensionLabs.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/numerical-methods/FactorizationLabs.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/numerical-methods/Labs.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/numerical-methods/RecordingPlayer.tsx` | `RecordingPlayback` | 录制事件生成、时钟推进与沙箱场景由课栈连接；回放视图和关键帧导航在组件库。 |
| `components/interactives/numerical-methods/SourceViewer.tsx` | `CanvasWorkbench`、`CodeBlock` | 业务数据、授权和持久化由课栈连接。 |
| `components/interactives/physics/ElectrostaticsLab.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/probability/ch01/BayesExplorer.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/probability/ch01/ClassicalProbLab.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/probability/ch01/FrequencyConvergence.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/probability/ch01/ReliabilityExplorer.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/probability/ch01/SampleSpaceBuilder.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/probability/ch01/VennPlayground.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/probability/ch02/BinomialExplorer.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/probability/ch02/CDFVisualizer.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/probability/ch02/FuncDistDemo.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/probability/ch02/PDFExplorer.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/probability/ch02/RVMapper.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/probability/ch03/ConditionalExplorer.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/probability/ch03/ConvolutionDemo.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/probability/ch03/IndependenceChecker.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/probability/ch03/JointDistExplorer.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/probability/ch03/MarginalExplorer.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/probability/ch04/CorrelationExplorer.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/probability/ch04/CovMatrixDemo.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/probability/ch04/ExpectationExplorer.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/probability/ch04/VarianceExplorer.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/probability/ch05/ChebyshevDemo.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/probability/ch05/CLTSimulator.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/probability/ch05/LLNSimulator.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/probability/ch06/NormalSamplingDemo.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/probability/ch06/QuantileExplorer.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/probability/ch06/SamplingDistExplorer.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/probability/ch06/StatisticCalculator.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/probability/ch07/ConfidenceIntervalExplorer.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/probability/ch07/EstimatorComparator.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/probability/ch07/MLEExplorer.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/probability/ch07/MomentEstimator.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/probability/ch08/ErrorTypeDemo.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/probability/ch08/HypTestDemo.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/probability/ch08/MeanTestExplorer.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/probability/ch08/VarianceTestExplorer.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/probability/ReviewLabs.tsx` | `CanvasWorkbench`、`Input`、`Slider`、`SelectField`、`Switch`、`QuizQuestion`、`RecordingPlayback` | 学科实验的计算与内容保留课栈；迁移时将参数控件接入统一控件与工作台，尚未修改此源文件。 |
| `components/interactives/SaveInteractiveButton.tsx` | `AsyncAction`、`DirectoryPicker` | 业务数据、授权和持久化由课栈连接。 |
| `components/keyboard/KeyboardShortcutProvider.tsx` | `ShortcutProvider`、`useShortcut` | 快捷键注册与可配置界面已提供；宿主连接操作、作用域与持久化。 |
| `components/keyboard/ShortcutHelpOverlay.tsx` | `ShortcutHelp`、`ShortcutSettings`、`ShortcutProvider` | 业务数据、授权和持久化由课栈连接。 |
| `components/layout/AcademicYearSwitcher.tsx` | `AcademicYearSwitcher` | 业务数据、授权和持久化由课栈连接。 |
| `components/layout/AccessContext.tsx` | 宿主保留 | 访问权限与运行时目录的数据提供器保留课栈，不作为展示组件抽取。 |
| `components/layout/AppearanceSettingsControls.tsx` | `SettingsForm`、`SettingsSection`、`SelectField` | 业务数据、授权和持久化由课栈连接。 |
| `components/layout/AppShell.tsx` | `WorkspaceLayout`、`WorkspaceTabs`、`RunWorkspace` | 业务数据、授权和持久化由课栈连接。 |
| `components/layout/BookshelfFilter.tsx` | `Bookshelf`、`SearchInput`、`SelectField` | 业务数据、授权和持久化由课栈连接。 |
| `components/layout/BrandLogo.tsx` | `IconButton`、`ModelSelector`、`ProductNavigation` | 图标和品牌资源保留宿主映射，通过 icon 插槽接入；五加一 Logo 使用统一地址。 |
| `components/layout/FileTree.tsx` | `FileTree`、`ContextMenu`、`CollapseTransition` | 业务数据、授权和持久化由课栈连接。 |
| `components/layout/FileTreeItem.tsx` | `FileTree`、`ContextMenu`、`CollapseTransition` | 业务数据、授权和持久化由课栈连接。 |
| `components/layout/GlobalSettings.tsx` | `SettingsForm`、`SettingsSection`、`SelectField` | 业务数据、授权和持久化由课栈连接。 |
| `components/layout/HomeBookshelf.tsx` | `Bookshelf`、`SearchInput`、`SelectField` | 业务数据、授权和持久化由课栈连接。 |
| `components/layout/KeyboardShortcutsSettings.tsx` | `ShortcutHelp`、`ShortcutSettings`、`ShortcutProvider` | 业务数据、授权和持久化由课栈连接。 |
| `components/layout/MobileBottomNav.tsx` | `ProductNavigation`、`BottomNav` | 业务数据、授权和持久化由课栈连接。 |
| `components/layout/MobileChapterPicker.tsx` | `SelectField`、`TocTree` | 业务数据、授权和持久化由课栈连接。 |
| `components/layout/MobileProductNav.tsx` | `ProductNavigation`、`BottomNav` | 业务数据、授权和持久化由课栈连接。 |
| `components/layout/MobileTopBar.tsx` | `MobileTopBar` | 业务数据、授权和持久化由课栈连接。 |
| `components/layout/MobileViewport.tsx` | `Container`、`BottomNav`、`MobileTopBar` | 视口、安全区和页面路由由宿主保留。 |
| `components/layout/NewTabPlaceholder.tsx` | `WorkspaceEmpty` | 业务数据、授权和持久化由课栈连接。 |
| `components/layout/NotePane.tsx` | `WorkspaceLayout`、`WorkspaceTabs`、`RunWorkspace` | 业务数据、授权和持久化由课栈连接。 |
| `components/layout/NoteSplitPane.tsx` | `WorkspaceLayout`、`WorkspaceTabs`、`RunWorkspace` | 业务数据、授权和持久化由课栈连接。 |
| `components/layout/NoteTabStrip.tsx` | `WorkspaceTabs` | 业务数据、授权和持久化由课栈连接。 |
| `components/layout/ProductSwitcher.tsx` | `ProductNavigation`、`BottomNav` | 业务数据、授权和持久化由课栈连接。 |
| `components/layout/RightPanel.tsx` | `WorkspaceLayout`、`WorkspaceTabs`、`RunWorkspace` | 业务数据、授权和持久化由课栈连接。 |
| `components/layout/RuntimeCatalogProvider.tsx` | 宿主保留 | 访问权限与运行时目录的数据提供器保留课栈，不作为展示组件抽取。 |
| `components/layout/SettingsSection.tsx` | `SettingsForm`、`SettingsSection`、`SelectField` | 业务数据、授权和持久化由课栈连接。 |
| `components/layout/SharedNoteToolbar.tsx` | `Toolbar`、`SelectionActions`、`ShareAccessPanel` | 业务数据、授权和持久化由课栈连接。 |
| `components/layout/SiblingFilesPanel.tsx` | `SiblingFiles` | 业务数据、授权和持久化由课栈连接。 |
| `components/layout/SubjectSidebar.tsx` | `ProductNavigation`、`BottomNav` | 业务数据、授权和持久化由课栈连接。 |
| `components/layout/TocTree.tsx` | `TocTree` | 业务数据、授权和持久化由课栈连接。 |
| `components/layout/WorkspaceActivity.tsx` | `TaskProgress`、`TaskStatus`、`NotificationList` | 业务数据、授权和持久化由课栈连接。 |
| `components/layout/WorkspaceTreeContextMenu.tsx` | `FileTree`、`ContextMenu`、`CollapseTransition` | 业务数据、授权和持久化由课栈连接。 |
| `components/notes/AnimatedInlineCard.tsx` | `MarkdownEditor`、`useMathEditor`、`configureMathPreferences`、`ShortcutSettings` | 业务数据、授权和持久化由课栈连接。 |
| `components/notes/AttachmentPicker.tsx` | `AttachmentPicker`、`ResourcePreview`、`FileCard` | 业务数据、授权和持久化由课栈连接。 |
| `components/notes/AttachmentView.tsx` | `AttachmentPicker`、`ResourcePreview`、`FileCard` | 业务数据、授权和持久化由课栈连接。 |
| `components/notes/BacklinksPanel.tsx` | `BacklinksPanel` | 业务数据、授权和持久化由课栈连接。 |
| `components/notes/CodeBlockLanguageSelect.tsx` | `MermaidPreview`、`CodeBlock`、`MarkdownEditor`、`SelectField` | 业务数据、授权和持久化由课栈连接。 |
| `components/notes/ContentPageClient.tsx` | `MarkdownContent`、`LazyVisible` | 服务端读取、流式传输、资源授权和专用渲染器由宿主连接。 |
| `components/notes/DirectiveBlockView.tsx` | `MarkdownEditor`、`DirectiveFields`、`moveEditorBlock`、`deleteEditorBlock` | 本地草稿、保存版本与编辑文档身份由宿主连接；节点与通用交互在组件库。 |
| `components/notes/DynamicRecording.tsx` | `RecordingPlayback` | 录制事件生成、时钟推进与沙箱场景由课栈连接；回放视图和关键帧导航在组件库。 |
| `components/notes/GraphView.tsx` | `GraphView` | 业务数据、授权和持久化由课栈连接。 |
| `components/notes/ImageConversionView.tsx` | `ImagePasteOptions`、`MarkdownEditor`、`UploadPlaceholder`、`ImageConversion` | 业务数据、授权和持久化由课栈连接。 |
| `components/notes/ImagePasteDialog.tsx` | `ImagePasteOptions`、`MarkdownEditor`、`UploadPlaceholder`、`ImageConversion` | 业务数据、授权和持久化由课栈连接。 |
| `components/notes/ImportVaultDialog.tsx` | `ImportPanel`、`DirectoryPicker` | 业务数据、授权和持久化由课栈连接。 |
| `components/notes/MathEditor.tsx` | `MarkdownEditor`、`useMathEditor`、`configureMathPreferences`、`ShortcutSettings` | 业务数据、授权和持久化由课栈连接。 |
| `components/notes/MathShortcutSettings.tsx` | `MarkdownEditor`、`useMathEditor`、`configureMathPreferences`、`ShortcutSettings` | 业务数据、授权和持久化由课栈连接。 |
| `components/notes/MathSymbolPalette.tsx` | `MarkdownEditor`、`useMathEditor`、`configureMathPreferences`、`ShortcutSettings` | 业务数据、授权和持久化由课栈连接。 |
| `components/notes/MemberSearch.tsx` | `ShareAccessPanel`、`MemberSearch`、`MemberAccess`、`ShareLink`、`PermissionSummary`、`DirectoryPicker` | 业务数据、授权和持久化由课栈连接。 |
| `components/notes/MermaidCodeBlockView.tsx` | `MermaidPreview`、`CodeBlock`、`MarkdownEditor`、`SelectField` | 业务数据、授权和持久化由课栈连接。 |
| `components/notes/MermaidEditor.tsx` | `MermaidPreview`、`CodeBlock`、`MarkdownEditor`、`SelectField` | 业务数据、授权和持久化由课栈连接。 |
| `components/notes/NoteAttachmentCard.tsx` | `AttachmentPicker`、`ResourcePreview`、`FileCard` | 业务数据、授权和持久化由课栈连接。 |
| `components/notes/NoteLink.tsx` | `NoteLink` | 业务数据、授权和持久化由课栈连接。 |
| `components/notes/NoteRenderer.tsx` | `MarkdownContent`、`LazyVisible` | 服务端读取、流式传输、资源授权和专用渲染器由宿主连接。 |
| `components/notes/NoteRendererServer.tsx` | `MarkdownContent`、`LazyVisible` | 服务端读取、流式传输、资源授权和专用渲染器由宿主连接。 |
| `components/notes/NoteSkeleton.tsx` | `Skeleton`、`TaskProgress` | 业务数据、授权和持久化由课栈连接。 |
| `components/notes/NoteToolbar.tsx` | `Toolbar`、`SelectionActions`、`ShareAccessPanel` | 业务数据、授权和持久化由课栈连接。 |
| `components/notes/NoteWorkspaceActions.tsx` | `Toolbar`、`SelectionActions`、`ShareAccessPanel` | 业务数据、授权和持久化由课栈连接。 |
| `components/notes/ProgressiveNoteRenderer.tsx` | `MarkdownContent`、`LazyVisible` | 服务端读取、流式传输、资源授权和专用渲染器由宿主连接。 |
| `components/notes/SelectionPopover.tsx` | `SelectionToolbar`、`SelectionActions`、`ColorPicker` | 业务数据、授权和持久化由课栈连接。 |
| `components/notes/ToolbarColorPicker.tsx` | `SelectionToolbar`、`SelectionActions`、`ColorPicker` | 业务数据、授权和持久化由课栈连接。 |
| `components/notes/UploadPlaceholderView.tsx` | `ImagePasteOptions`、`MarkdownEditor`、`UploadPlaceholder`、`ImageConversion` | 业务数据、授权和持久化由课栈连接。 |
| `components/notes/UploadQueue.tsx` | `UploadQueue` | 业务数据、授权和持久化由课栈连接。 |
| `components/notes/VisualNoteEditor.tsx` | `MarkdownEditor`、`DirectiveFields`、`moveEditorBlock`、`deleteEditorBlock` | 本地草稿、保存版本与编辑文档身份由宿主连接；节点与通用交互在组件库。 |
| `components/quiz/QuizMarkdown.tsx` | `MarkdownContent`、`LazyVisible` | 服务端读取、流式传输、资源授权和专用渲染器由宿主连接。 |
| `components/quiz/QuizQuestion.tsx` | `QuizQuestion` | 业务数据、授权和持久化由课栈连接。 |
| `components/quiz/QuizScoring.tsx` | `QuizScoring` | 业务数据、授权和持久化由课栈连接。 |
| `components/quiz/QuizSummary.tsx` | `QuizSummary` | 业务数据、授权和持久化由课栈连接。 |
| `components/quiz/QuizTab.tsx` | `QuizWorkspace`、`QuizQuestion`、`MarkdownContent` | 业务数据、授权和持久化由课栈连接。 |
| `components/resources/ResourceCenter.tsx` | `ResourceWorkspace`、`ResourceExplorer`、`ResourcePreview`、`RecycleBin` | 业务数据、授权和持久化由课栈连接。 |
| `components/resources/ResourcePreview.tsx` | `ResourcePreview`、`PdfPreview`、`AudioPlayer`、`VideoPlayer` | 转换服务、鉴权源和真实预览文件由宿主提供。 |
| `components/review/CollapsibleSection.tsx` | `CollapsibleSection`、`CollapseTransition` | 业务数据、授权和持久化由课栈连接。 |
| `components/review/FlipCard.tsx` | `FlipCard`、`RecallContent` | 业务数据、授权和持久化由课栈连接。 |
| `components/review/RecordPreviewLayer.tsx` | `FloatingWindow`、`WindowChrome`、`WindowTaskbar`、`ArtifactPreview` | 业务数据、授权和持久化由课栈连接。 |
| `components/review/RecordPreviewWindow.tsx` | `FloatingWindow`、`WindowChrome`、`WindowTaskbar`、`ArtifactPreview` | 业务数据、授权和持久化由课栈连接。 |
| `components/review/ReviewPage.tsx` | `ReviewDashboard`、`MemoryCard` | 业务数据、授权和持久化由课栈连接。 |
| `components/search/GlobalSearchButton.tsx` | `SearchResults`、`CommandMenu` | 搜索权限、远程与本地合并、定位路由由课栈提供。 |
| `components/setup/SetupWizard.tsx` | `SetupWizard` | 业务数据、授权和持久化由课栈连接。 |
| `components/shared/ChoiceMenu.tsx` | `SelectField`、`Popup` | 业务数据、授权和持久化由课栈连接。 |
| `components/shared/CodeBlock.tsx` | `MermaidPreview`、`CodeBlock`、`MarkdownEditor`、`SelectField` | 业务数据、授权和持久化由课栈连接。 |
| `components/shared/ContentImage.tsx` | `Figure`、`ContentImage` | 业务数据、授权和持久化由课栈连接。 |
| `components/shared/directives/Callout.tsx` | `Callout`、`MarkdownContent` | 业务数据、授权和持久化由课栈连接。 |
| `components/shared/directives/CauseEffect.tsx` | `CauseEffect` | 业务数据、授权和持久化由课栈连接。 |
| `components/shared/directives/CompareTable.tsx` | `CompareTable` | 业务数据、授权和持久化由课栈连接。 |
| `components/shared/directives/ConceptCard.tsx` | `ConceptCard` | 业务数据、授权和持久化由课栈连接。 |
| `components/shared/directives/Derivation.tsx` | `Derivation`、`FormulaSteps` | 业务数据、授权和持久化由课栈连接。 |
| `components/shared/directives/EventCard.tsx` | `EventCard` | 业务数据、授权和持久化由课栈连接。 |
| `components/shared/directives/Figure.tsx` | `Figure`、`ContentImage` | 业务数据、授权和持久化由课栈连接。 |
| `components/shared/directives/HistoryMap.tsx` | `HistoryLocationMap`、`HistoryMap` | 业务数据、授权和持久化由课栈连接。 |
| `components/shared/directives/KeyPoint.tsx` | `KeyPoint` | 业务数据、授权和持久化由课栈连接。 |
| `components/shared/directives/LearningAnimation.tsx` | `LearningAnimation`、`VideoPlayer` | 业务数据、授权和持久化由课栈连接。 |
| `components/shared/directives/MediaEmbed.tsx` | `VideoPlayer`、`AudioPlayer`、`EmbedFallback` | 业务数据、授权和持久化由课栈连接。 |
| `components/shared/directives/MemoryCard.tsx` | `MemoryCard`、`RecallContent` | 业务数据、授权和持久化由课栈连接。 |
| `components/shared/directives/Timeline.tsx` | `ReadingTimeline`、`Timeline` | 业务数据、授权和持久化由课栈连接。 |
| `components/shared/FloatingPanel.tsx` | `FloatingWindow`、`WindowChrome`、`WindowTaskbar`、`ArtifactPreview` | 业务数据、授权和持久化由课栈连接。 |
| `components/shared/HorizontalScrollbar.tsx` | `HorizontalScrollbar` | 业务数据、授权和持久化由课栈连接。 |
| `components/shared/ImageLightbox.tsx` | `MediaLightbox` | 业务数据、授权和持久化由课栈连接。 |
| `components/shared/MermaidBlock.tsx` | `MermaidPreview`、`CodeBlock`、`MarkdownEditor`、`SelectField` | 业务数据、授权和持久化由课栈连接。 |
| `components/shared/MessageContextMenu.tsx` | `ContextMenu`、`SelectionActions` | 业务数据、授权和持久化由课栈连接。 |
| `components/shared/PdfPreview.tsx` | `ResourcePreview`、`PdfPreview`、`AudioPlayer`、`VideoPlayer` | 转换服务、鉴权源和真实预览文件由宿主提供。 |
| `components/shared/ResizeLoader.tsx` | `Skeleton`、`TaskProgress` | 业务数据、授权和持久化由课栈连接。 |
| `components/shared/SubjectIcon.tsx` | `IconButton`、`ModelSelector`、`ProductNavigation` | 图标和品牌资源保留宿主映射，通过 icon 插槽接入；五加一 Logo 使用统一地址。 |
| `components/shared/SurfaceBoundary.tsx` | `ErrorState` | 业务异常边界与错误采集保留课栈，错误展示复用组件库。 |
| `components/shared/TaskDialog.tsx` | `Dialog`、`TaskProgress` | 业务数据、授权和持久化由课栈连接。 |
| `components/shared/TreeDisclosure.tsx` | `FileTree`、`ContextMenu`、`CollapseTransition` | 业务数据、授权和持久化由课栈连接。 |
| `components/shared/WorkspaceLoading.tsx` | `Skeleton`、`TaskProgress` | 业务数据、授权和持久化由课栈连接。 |
| `components/ui/AnimatedCollapse.tsx` | `CollapseTransition`、`AnimatedSize` | 业务数据、授权和持久化由课栈连接。 |
| `components/ui/LazyVisible.tsx` | `LazyVisible` | 业务数据、授权和持久化由课栈连接。 |
| `components/ui/Tip.tsx` | `Tooltip` | 业务数据、授权和持久化由课栈连接。 |
| `components/ui/Tooltip.tsx` | `Tooltip` | 业务数据、授权和持久化由课栈连接。 |
| `components/video/ClassroomProgress.tsx` | `ClassroomTimeline`、`Progress` | 业务数据、授权和持久化由课栈连接。 |
| `components/video/InlinePlayer.tsx` | `VideoPlayer`、`LectureDock`、`ClassroomTimeline` | 授权刷新、缓冲看门狗、播放位置持久化与课堂路由保留宿主；播放器提供 videoRef 和事件接入。 |
| `components/video/LectureDock.tsx` | `LectureDock` | 业务数据、授权和持久化由课栈连接。 |
| `components/video/LecturePlayer.tsx` | `VideoPlayer`、`LectureDock`、`ClassroomTimeline` | 授权刷新、缓冲看门狗、播放位置持久化与课堂路由保留宿主；播放器提供 videoRef 和事件接入。 |
| `components/video/PipPlayer.tsx` | `VideoPlayer`、`LectureDock`、`ClassroomTimeline` | 授权刷新、缓冲看门狗、播放位置持久化与课堂路由保留宿主；播放器提供 videoRef 和事件接入。 |
| `components/video/VideoTab.tsx` | `VideoPlayer`、`LectureDock`、`ClassroomTimeline` | 授权刷新、缓冲看门狗、播放位置持久化与课堂路由保留宿主；播放器提供 videoRef 和事件接入。 |
| `components/visualizations/primitives/DistributionChart.tsx` | `DistributionChart` | 业务数据、授权和持久化由课栈连接。 |
| `components/visualizations/primitives/FormulaSteps.tsx` | `Derivation`、`FormulaSteps` | 业务数据、授权和持久化由课栈连接。 |
| `components/visualizations/primitives/VennDiagram.tsx` | `VennDiagram` | 业务数据、授权和持久化由课栈连接。 |
| `components/visualizations/primitives/VideoPlayer.tsx` | `VideoPlayer`、`LectureDock`、`ClassroomTimeline` | 授权刷新、缓冲看门狗、播放位置持久化与课堂路由保留宿主；播放器提供 videoRef 和事件接入。 |
| `components/window/OverflowMenu.tsx` | `WindowTaskbar`、`Dropdown` | 业务数据、授权和持久化由课栈连接。 |
| `components/window/WindowChrome.tsx` | `WindowChrome`、`FloatingWindow` | 业务数据、授权和持久化由课栈连接。 |
| `components/window/WindowTaskbar.tsx` | `WindowTaskbar`、`Dropdown` | 业务数据、授权和持久化由课栈连接。 |
