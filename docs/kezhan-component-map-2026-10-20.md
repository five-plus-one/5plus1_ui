# 课栈组件与共享视图对应表

版本：0.5.0。源清单共 277 个组件文件，另有 11 个应用及内容注册文件。

本表记录组件库提供的展示层、专用交互和宿主调用契约。自动测试与浏览器抽查覆盖范围见 [交付验证](kezhan-ui-0.5.0-acceptance.md)。课栈应用的生产接入另行验收；路径对应不等于全部业务状态的端到端验收。

## account

| 课栈源文件 | 共享组件 / 专用视图 | 调用契约 |
| --- | --- | --- |
| `components/account/AccountCenter.tsx` | `AccountLayout`、`ProductNavigation`、`UserProfile` | 宿主提供账户、计费与存储数据；组件接收受控值和异步保存回调。 |
| `components/account/CommerceManager.tsx` | `CommerceWorkspace` | 宿主提供账户、计费与存储数据；组件接收受控值和异步保存回调。 |
| `components/account/CreditsPanel.tsx` | `CreditsOverview`、`LedgerView`、`CapacityOverview` | 宿主提供账户、计费与存储数据；组件接收受控值和异步保存回调。 |
| `components/account/DirectoryManager.tsx` | `DirectoryWorkspace` | 宿主提供账户、计费与存储数据；组件接收受控值和异步保存回调。 |
| `components/account/ImportLocalStudy.tsx` | `ImportPanel`、`DirectoryPicker` | 宿主提供账户、计费与存储数据；组件接收受控值和异步保存回调。 |
| `components/account/LedgerView.tsx` | `LedgerView` | 宿主提供账户、计费与存储数据；组件接收受控值和异步保存回调。 |
| `components/account/LoginScreen.tsx` | `LoginForm` | 宿主提供账户、计费与存储数据；组件接收受控值和异步保存回调。 |
| `components/account/NotebookManager.tsx` | `NotebookManagerWorkspace`、`NotebookPublishing` | 宿主提供账户、计费与存储数据；组件接收受控值和异步保存回调。 |
| `components/account/ShareCurrentNotebook.tsx` | `ShareAccessPanel`、`MemberSearch`、`MemberAccess`、`ShareLink`、`PermissionSummary`、`DirectoryPicker` | 宿主提供账户、计费与存储数据；组件接收受控值和异步保存回调。 |
| `components/account/ShareNotebook.tsx` | `ShareAccessPanel`、`MemberSearch`、`MemberAccess`、`ShareLink`、`PermissionSummary`、`DirectoryPicker` | 宿主提供账户、计费与存储数据；组件接收受控值和异步保存回调。 |
| `components/account/UserCreditsEditor.tsx` | `CreditAdjustment` | 宿主提供账户、计费与存储数据；组件接收受控值和异步保存回调。 |
| `components/account/UserDetails.tsx` | `UserDetailsWorkspace`、`CapacityEditor`、`AdministratorAccess` | 宿主提供账户、计费与存储数据；组件接收受控值和异步保存回调。 |

## admin

| 课栈源文件 | 共享组件 / 专用视图 | 调用契约 |
| --- | --- | --- |
| `components/admin/AdminCenter.tsx` | `AccountLayout`、`ProductNavigation`、`UserProfile` | 宿主执行权限校验、平台配置持久化和重置；组件处理输入、确认、忙碌状态和错误反馈。 |
| `components/admin/AdministratorManager.tsx` | `AdministratorDirectory` | 宿主执行权限校验、平台配置持久化和重置；组件处理输入、确认、忙碌状态和错误反馈。 |
| `components/admin/CapacityManager.tsx` | `CapacityDirectory` | 宿主执行权限校验、平台配置持久化和重置；组件处理输入、确认、忙碌状态和错误反馈。 |
| `components/admin/PlatformSettingsManager.tsx` | `PlatformWorkspace` | 宿主执行权限校验、平台配置持久化和重置；组件处理输入、确认、忙碌状态和错误反馈。 |
| `components/admin/SystemManager.tsx` | `PlatformReset` | 宿主执行权限校验、平台配置持久化和重置；组件处理输入、确认、忙碌状态和错误反馈。 |

## agent

| 课栈源文件 | 共享组件 / 专用视图 | 调用契约 |
| --- | --- | --- |
| `components/agent/AgentRunTrace.tsx` | `MessageContentView`、`AgentTrace`、`MarkdownContent`、`ContextMenu` | 宿主提供任务会话、消息与动作；组件处理布局、任务进度与消息展示。 |
| `components/agent/AgentWorkspace.tsx` | `RunWorkspace`、`ProductNavigation`、`SessionHistory`、`MessageList`、`ChatComposer` | 宿主提供任务会话、消息与动作；组件处理布局、任务进度与消息展示。 |

## browser

| 课栈源文件 | 共享组件 / 专用视图 | 调用契约 |
| --- | --- | --- |
| `components/browser/BrowserSettingsButton.tsx` | `BrowserPreferences` | 宿主提供浏览历史、授权与实际网页容器；组件处理网址、收藏、设置及回退界面。 |
| `components/browser/BrowserTab.tsx` | `BrowserWorkspace`、`BrowserPreferences` | 宿主提供浏览历史、授权与实际网页容器；组件处理网址、收藏、设置及回退界面。 |
| `components/browser/EmbedFallback.tsx` | `EmbedFallback` | 宿主提供浏览历史、授权与实际网页容器；组件处理网址、收藏、设置及回退界面。 |

## canvas

| 课栈源文件 | 共享组件 / 专用视图 | 调用契约 |
| --- | --- | --- |
| `components/canvas/CanvasBlockRenderer.tsx` | `CanvasWorkspace`；`src/lib/canvas/CanvasBlockRenderer.tsx` | 通用渲染、参数、修改指令、版本预览、采用、诊断与全屏已提取；宿主提供生成服务和分子渲染器。 |
| `components/canvas/CanvasControls.tsx` | `CanvasWorkspace`；`src/lib/canvas/CanvasControls.tsx` | 通用渲染、参数、修改指令、版本预览、采用、诊断与全屏已提取；宿主提供生成服务和分子渲染器。 |
| `components/canvas/CanvasDiagnosticPanel.tsx` | `CanvasWorkspace` | 通用渲染、参数、修改指令、版本预览、采用、诊断与全屏已提取；宿主提供生成服务和分子渲染器。 |
| `components/canvas/CanvasDirective.tsx` | `CanvasWorkspace`；`src/lib/canvas/CanvasDirective.tsx` | 通用渲染、参数、修改指令、版本预览、采用、诊断与全屏已提取；宿主提供生成服务和分子渲染器。 |
| `components/canvas/CanvasFrame.tsx` | `CanvasWorkspace`；`src/lib/canvas/CanvasFrame.tsx` | 通用渲染、参数、修改指令、版本预览、采用、诊断与全屏已提取；宿主提供生成服务和分子渲染器。 |
| `components/canvas/CanvasFullscreenPortal.tsx` | `CanvasWorkspace`；`src/lib/canvas/CanvasFullscreenPortal.tsx` | 通用渲染、参数、修改指令、版本预览、采用、诊断与全屏已提取；宿主提供生成服务和分子渲染器。 |
| `components/canvas/CanvasRevisionPanel.tsx` | `CanvasWorkspace` | 通用渲染、参数、修改指令、版本预览、采用、诊断与全屏已提取；宿主提供生成服务和分子渲染器。 |
| `components/canvas/DiagramCanvas.tsx` | `CanvasWorkspace`；`src/lib/canvas/DiagramCanvas.tsx` | 通用渲染、参数、修改指令、版本预览、采用、诊断与全屏已提取；宿主提供生成服务和分子渲染器。 |
| `components/canvas/FunctionPlot.tsx` | `CanvasWorkspace`；`src/lib/canvas/FunctionPlot.tsx` | 通用渲染、参数、修改指令、版本预览、采用、诊断与全屏已提取；宿主提供生成服务和分子渲染器。 |
| `components/canvas/PlotDirective.tsx` | `CanvasWorkspace`；`src/lib/canvas/PlotDirective.tsx` | 通用渲染、参数、修改指令、版本预览、采用、诊断与全屏已提取；宿主提供生成服务和分子渲染器。 |
| `components/canvas/RawSvgViewer.tsx` | `CanvasWorkspace`；`src/lib/canvas/RawSvgViewer.tsx` | 通用渲染、参数、修改指令、版本预览、采用、诊断与全屏已提取；宿主提供生成服务和分子渲染器。 |
| `components/canvas/renderers/HtmlRenderer.tsx` | `CanvasWorkspace`；`src/lib/canvas/renderers/HtmlRenderer.tsx` | 通用渲染、参数、修改指令、版本预览、采用、诊断与全屏已提取；宿主提供生成服务和分子渲染器。 |
| `components/canvas/renderers/MoleculeRenderer.tsx` | `CanvasWorkspace` | 通用渲染、参数、修改指令、版本预览、采用、诊断与全屏已提取；宿主提供生成服务和分子渲染器。 |
| `components/canvas/renderers/MultiPlotRenderer.tsx` | `CanvasWorkspace`；`src/lib/canvas/renderers/MultiPlotRenderer.tsx` | 通用渲染、参数、修改指令、版本预览、采用、诊断与全屏已提取；宿主提供生成服务和分子渲染器。 |
| `components/canvas/renderers/PlotRenderer.tsx` | `CanvasWorkspace`；`src/lib/canvas/renderers/PlotRenderer.tsx` | 通用渲染、参数、修改指令、版本预览、采用、诊断与全屏已提取；宿主提供生成服务和分子渲染器。 |
| `components/canvas/renderers/RawSvgRenderer.tsx` | `CanvasWorkspace`；`src/lib/canvas/renderers/RawSvgRenderer.tsx` | 通用渲染、参数、修改指令、版本预览、采用、诊断与全屏已提取；宿主提供生成服务和分子渲染器。 |
| `components/canvas/SvgCanvas.tsx` | `CanvasWorkspace`；`src/lib/canvas/SvgCanvas.tsx` | 通用渲染、参数、修改指令、版本预览、采用、诊断与全屏已提取；宿主提供生成服务和分子渲染器。 |

## chat

| 课栈源文件 | 共享组件 / 专用视图 | 调用契约 |
| --- | --- | --- |
| `components/chat/AgentFoldHeader.tsx` | `MessageContentView`、`AgentTrace`、`MarkdownContent`、`ContextMenu` | 宿主维护会话、流式数据、模型调用及业务动作；组件承担输入、消息、设置、引用与媒体展示。 |
| `components/chat/AgentTrace.tsx` | `MessageContentView`、`AgentTrace`、`MarkdownContent`、`ContextMenu` | 宿主维护会话、流式数据、模型调用及业务动作；组件承担输入、消息、设置、引用与媒体展示。 |
| `components/chat/AgentTraceStep.tsx` | `MessageContentView`、`AgentTrace`、`MarkdownContent`、`ContextMenu` | 宿主维护会话、流式数据、模型调用及业务动作；组件承担输入、消息、设置、引用与媒体展示。 |
| `components/chat/ArtifactCard.tsx` | `ArtifactCard`、`Citation`、`FileCard` | 宿主维护会话、流式数据、模型调用及业务动作；组件承担输入、消息、设置、引用与媒体展示。 |
| `components/chat/ArtifactViewer.tsx` | `ArtifactPreview`、`MarkdownContent`、`ResourcePreview`、`FloatingWindow` | 宿主维护会话、流式数据、模型调用及业务动作；组件承担输入、消息、设置、引用与媒体展示。 |
| `components/chat/AttachmentThumbnails.tsx` | `MediaLightbox`、`AttachmentGrid`、`ContentImage` | 宿主维护会话、流式数据、模型调用及业务动作；组件承担输入、消息、设置、引用与媒体展示。 |
| `components/chat/BillingDashboard.tsx` | `CreditsOverview`、`LedgerView`、`CapacityOverview` | 宿主维护会话、流式数据、模型调用及业务动作；组件承担输入、消息、设置、引用与媒体展示。 |
| `components/chat/ChatEmptyState.tsx` | `WorkspaceEmpty`、`AIMessage` | 宿主维护会话、流式数据、模型调用及业务动作；组件承担输入、消息、设置、引用与媒体展示。 |
| `components/chat/ChatHistoryOverlay.tsx` | `RunWorkspace`、`ProductNavigation`、`SessionHistory`、`MessageList`、`ChatComposer` | 宿主维护会话、流式数据、模型调用及业务动作；组件承担输入、消息、设置、引用与媒体展示。 |
| `components/chat/ChatImage.tsx` | `MediaLightbox`、`AttachmentGrid`、`ContentImage` | 宿主维护会话、流式数据、模型调用及业务动作；组件承担输入、消息、设置、引用与媒体展示。 |
| `components/chat/ChatInput.tsx` | `ChatComposer`、`ModelSelector`、`ChatPreferencesPanel` | 宿主维护会话、流式数据、模型调用及业务动作；组件承担输入、消息、设置、引用与媒体展示。 |
| `components/chat/ChatMessage.tsx` | `MessageContentView`、`AgentTrace`、`MarkdownContent`、`ContextMenu` | 宿主维护会话、流式数据、模型调用及业务动作；组件承担输入、消息、设置、引用与媒体展示。 |
| `components/chat/ChatMessageVisualizations.tsx` | `MessageContentView`、`CanvasWorkspace` | 宿主维护会话、流式数据、模型调用及业务动作；组件承担输入、消息、设置、引用与媒体展示。 |
| `components/chat/ChatPanel.tsx` | `RunWorkspace`、`ProductNavigation`、`SessionHistory`、`MessageList`、`ChatComposer` | 宿主维护会话、流式数据、模型调用及业务动作；组件承担输入、消息、设置、引用与媒体展示。 |
| `components/chat/ChatPanelHeader.tsx` | `RunWorkspace`、`ProductNavigation`、`SessionHistory`、`MessageList`、`ChatComposer` | 宿主维护会话、流式数据、模型调用及业务动作；组件承担输入、消息、设置、引用与媒体展示。 |
| `components/chat/ChatQuizCard.tsx` | `AttachmentGrid`、`QuizWorkspace`、`QuizQuestion` | 宿主维护会话、流式数据、模型调用及业务动作；组件承担输入、消息、设置、引用与媒体展示。 |
| `components/chat/ChatSettings.tsx` | `AISettingsWorkspace` | 宿主维护会话、流式数据、模型调用及业务动作；组件承担输入、消息、设置、引用与媒体展示。 |
| `components/chat/ChatThread.tsx` | `RunWorkspace`、`ProductNavigation`、`SessionHistory`、`MessageList`、`ChatComposer` | 宿主维护会话、流式数据、模型调用及业务动作；组件承担输入、消息、设置、引用与媒体展示。 |
| `components/chat/DocumentCard.tsx` | `ArtifactCard`、`Citation`、`FileCard` | 宿主维护会话、流式数据、模型调用及业务动作；组件承担输入、消息、设置、引用与媒体展示。 |
| `components/chat/DocumentViewer.tsx` | `ArtifactPreview`、`MarkdownContent`、`ResourcePreview`、`FloatingWindow` | 宿主维护会话、流式数据、模型调用及业务动作；组件承担输入、消息、设置、引用与媒体展示。 |
| `components/chat/FloatingChatBody.tsx` | `FloatingWindow`、`WindowChrome`、`WindowTaskbar`、`ArtifactPreview` | 宿主维护会话、流式数据、模型调用及业务动作；组件承担输入、消息、设置、引用与媒体展示。 |
| `components/chat/FloatingChatLayer.tsx` | `FloatingWindow`、`WindowChrome`、`WindowTaskbar`、`ArtifactPreview` | 宿主维护会话、流式数据、模型调用及业务动作；组件承担输入、消息、设置、引用与媒体展示。 |
| `components/chat/FloatingChatWindow.tsx` | `FloatingWindow`、`WindowChrome`、`WindowTaskbar`、`ArtifactPreview` | 宿主维护会话、流式数据、模型调用及业务动作；组件承担输入、消息、设置、引用与媒体展示。 |
| `components/chat/FollowUpQuestions.tsx` | `FollowUpQuestions` | 宿主维护会话、流式数据、模型调用及业务动作；组件承担输入、消息、设置、引用与媒体展示。 |
| `components/chat/ImageGenCard.tsx` | `ArtifactCard`、`Citation`、`FileCard` | 宿主维护会话、流式数据、模型调用及业务动作；组件承担输入、消息、设置、引用与媒体展示。 |
| `components/chat/ImageGenViewer.tsx` | `ArtifactPreview`、`MarkdownContent`、`ResourcePreview`、`FloatingWindow` | 宿主维护会话、流式数据、模型调用及业务动作；组件承担输入、消息、设置、引用与媒体展示。 |
| `components/chat/ImageStrip.tsx` | `MediaLightbox`、`AttachmentGrid`、`ContentImage` | 宿主维护会话、流式数据、模型调用及业务动作；组件承担输入、消息、设置、引用与媒体展示。 |
| `components/chat/MessageContent.tsx` | `MessageContentView`、`AgentTrace`、`MarkdownContent`、`ContextMenu` | 宿主维护会话、流式数据、模型调用及业务动作；组件承担输入、消息、设置、引用与媒体展示。 |
| `components/chat/ModelMenu.tsx` | `ChatPreferencesPanel`、`SkillsPanel`、`ModelSelector`、`SelectField` | 宿主维护会话、流式数据、模型调用及业务动作；组件承担输入、消息、设置、引用与媒体展示。 |
| `components/chat/NoteCitationCard.tsx` | `ArtifactCard`、`Citation`、`FileCard` | 宿主维护会话、流式数据、模型调用及业务动作；组件承担输入、消息、设置、引用与媒体展示。 |
| `components/chat/NoteCitationViewer.tsx` | `ArtifactPreview`、`MarkdownContent`、`ResourcePreview`、`FloatingWindow` | 宿主维护会话、流式数据、模型调用及业务动作；组件承担输入、消息、设置、引用与媒体展示。 |
| `components/chat/NoteImageGallery.tsx` | `AttachmentGrid`、`QuizWorkspace`、`QuizQuestion` | 宿主维护会话、流式数据、模型调用及业务动作；组件承担输入、消息、设置、引用与媒体展示。 |
| `components/chat/ProcessingSteps.tsx` | `MessageContentView`、`AgentTrace`、`MarkdownContent`、`ContextMenu` | 宿主维护会话、流式数据、模型调用及业务动作；组件承担输入、消息、设置、引用与媒体展示。 |
| `components/chat/ReasoningTraceStep.tsx` | `MessageContentView`、`AgentTrace`、`MarkdownContent`、`ContextMenu` | 宿主维护会话、流式数据、模型调用及业务动作；组件承担输入、消息、设置、引用与媒体展示。 |
| `components/chat/SkillsManager.tsx` | `SkillsWorkspace` | 宿主维护会话、流式数据、模型调用及业务动作；组件承担输入、消息、设置、引用与媒体展示。 |
| `components/chat/SourcePreviewViewer.tsx` | `ArtifactPreview`、`MarkdownContent`、`ResourcePreview`、`FloatingWindow` | 宿主维护会话、流式数据、模型调用及业务动作；组件承担输入、消息、设置、引用与媒体展示。 |
| `components/chat/SourceTraceViewer.tsx` | `ArtifactPreview`、`MarkdownContent`、`ResourcePreview`、`FloatingWindow` | 宿主维护会话、流式数据、模型调用及业务动作；组件承担输入、消息、设置、引用与媒体展示。 |
| `components/chat/ThinkingMenu.tsx` | `ChatPreferencesPanel`、`SkillsPanel`、`ModelSelector`、`SelectField` | 宿主维护会话、流式数据、模型调用及业务动作；组件承担输入、消息、设置、引用与媒体展示。 |
| `components/chat/TokenDashboard.tsx` | `TokenDashboard` | 宿主维护会话、流式数据、模型调用及业务动作；组件承担输入、消息、设置、引用与媒体展示。 |
| `components/chat/ToolCallDashboard.tsx` | `MessageContentView`、`AgentTrace`、`MarkdownContent`、`ContextMenu` | 宿主维护会话、流式数据、模型调用及业务动作；组件承担输入、消息、设置、引用与媒体展示。 |
| `components/chat/ToolTraceStep.tsx` | `MessageContentView`、`AgentTrace`、`MarkdownContent`、`ContextMenu` | 宿主维护会话、流式数据、模型调用及业务动作；组件承担输入、消息、设置、引用与媒体展示。 |
| `components/chat/VizErrorBoundary.tsx` | `ErrorState` | 宿主维护会话、流式数据、模型调用及业务动作；组件承担输入、消息、设置、引用与媒体展示。 |
| `components/chat/VizFold.tsx` | `SourceFold`、`CanvasWorkspace` | 宿主维护会话、流式数据、模型调用及业务动作；组件承担输入、消息、设置、引用与媒体展示。 |
| `components/chat/WebSourceFold.tsx` | `SourceFold`、`MessageContentView`、`CanvasWorkbench` | 宿主维护会话、流式数据、模型调用及业务动作；组件承担输入、消息、设置、引用与媒体展示。 |

## examples

| 课栈源文件 | 共享组件 / 专用视图 | 调用契约 |
| --- | --- | --- |
| `components/examples/ExampleTab.tsx` | `Bookshelf`、`ProductNavigation`、`MarkdownContent` | 课程示例数据与导航由宿主注入，共享书架和阅读视图。 |

## icons

| 课栈源文件 | 共享组件 / 专用视图 | 调用契约 |
| --- | --- | --- |
| `components/icons/AgentIcons.tsx` | `IconButton`、`ModelSelector`、`ProductNavigation` | 使用共享图标与产品色；模型或学科品牌资源通过图标插槽注入。 |
| `components/icons/ModelBrandIcons.tsx` | `IconButton`、`ModelSelector`、`ProductNavigation` | 使用共享图标与产品色；模型或学科品牌资源通过图标插槽注入。 |
| `components/icons/PencilSparklesIcon.tsx` | `IconButton`、`ModelSelector`、`ProductNavigation` | 使用共享图标与产品色；模型或学科品牌资源通过图标插槽注入。 |

## interactives

| 课栈源文件 | 共享组件 / 专用视图 | 调用契约 |
| --- | --- | --- |
| `components/interactives/chemistry/ch01/BondPolarityExplorer.tsx` | `LearningExperiment`；`src/lib/learning/chemistry/ch01/BondPolarityExplorer.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/chemistry/ch02/IUPACNamingPractice.tsx` | `LearningExperiment`；`src/lib/learning/chemistry/ch02/IUPACNamingPractice.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/chemistry/ch03/BoilingPointComparator.tsx` | `LearningExperiment`；`src/lib/learning/chemistry/ch03/BoilingPointComparator.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/chemistry/ch04/ChairFlip.tsx` | `LearningExperiment`；`src/lib/learning/chemistry/ch04/ChairFlip.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/chemistry/ch04/NewmanProjection.tsx` | `LearningExperiment`；`src/lib/learning/chemistry/ch04/NewmanProjection.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/chemistry/ch05/CarbocationStability.tsx` | `LearningExperiment`；`src/lib/learning/chemistry/ch05/CarbocationStability.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/chemistry/ch06/MarkovnikovPredictor.tsx` | `LearningExperiment`；`src/lib/learning/chemistry/ch06/MarkovnikovPredictor.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/chemistry/ch07/DieneAddition.tsx` | `LearningExperiment`；`src/lib/learning/chemistry/ch07/DieneAddition.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/chemistry/ch08/DirectingEffect.tsx` | `LearningExperiment`；`src/lib/learning/chemistry/ch08/DirectingEffect.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/chemistry/ch09/ChiralityMirror.tsx` | `LearningExperiment`；`src/lib/learning/chemistry/ch09/ChiralityMirror.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/chemistry/ch09/RSConfigPractice.tsx` | `LearningExperiment`；`src/lib/learning/chemistry/ch09/RSConfigPractice.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/chemistry/ch10/EliminationZaitsev.tsx` | `LearningExperiment`；`src/lib/learning/chemistry/ch10/EliminationZaitsev.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/chemistry/ch10/SN1SN2Compare.tsx` | `LearningExperiment`；`src/lib/learning/chemistry/ch10/SN1SN2Compare.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/chemistry/ch11/EpoxideOpening.tsx` | `LearningExperiment`；`src/lib/learning/chemistry/ch11/EpoxideOpening.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/chemistry/ch12/CarbonylAddition.tsx` | `LearningExperiment`；`src/lib/learning/chemistry/ch12/CarbonylAddition.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/chemistry/ch13/AcylReactivity.tsx` | `LearningExperiment`；`src/lib/learning/chemistry/ch13/AcylReactivity.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/chemistry/ch14/AmineBasicity.tsx` | `LearningExperiment`；`src/lib/learning/chemistry/ch14/AmineBasicity.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/chemistry/ch14/DiazoniumNetwork.tsx` | `LearningExperiment`；`src/lib/learning/chemistry/ch14/DiazoniumNetwork.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/CustomInteractive.tsx` | `CanvasWorkspace` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/discrete-math/LogicRelationsLabs.tsx` | `LearningExperiment`；`src/lib/learning/discrete-math/LogicRelationsLabs.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/discrete-math/StructureLabs.tsx` | `LearningExperiment`；`src/lib/learning/discrete-math/StructureLabs.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/InteractivePlatform.tsx` | `ExperimentLibrary`、`CanvasWorkspace` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/InteractiveStudio.tsx` | `ExperimentLibrary`、`CanvasWorkspace` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/InteractiveTab.tsx` | `ExperimentLibrary`、`LearningExperiment` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/LabWorkbench.tsx` | `ExperimentLibrary`、`LearningExperiment` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/numerical-methods/ExtensionLabs.tsx` | `LearningExperiment`；`src/lib/learning/numerical-methods/ExtensionLabs.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/numerical-methods/FactorizationLabs.tsx` | `LearningExperiment`；`src/lib/learning/numerical-methods/FactorizationLabs.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/numerical-methods/Labs.tsx` | `LearningExperiment`；`src/lib/learning/numerical-methods/Labs.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/numerical-methods/RecordingPlayer.tsx` | `LectureWorkspace`、`RecordingPlayback` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/numerical-methods/SourceViewer.tsx` | `LearningSourceView` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/physics/ElectrostaticsLab.tsx` | `LearningExperiment`；`src/lib/learning/physics/ElectrostaticsLab.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/probability/ch01/BayesExplorer.tsx` | `LearningExperiment`；`src/lib/learning/probability/ch01/BayesExplorer.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/probability/ch01/ClassicalProbLab.tsx` | `LearningExperiment`；`src/lib/learning/probability/ch01/ClassicalProbLab.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/probability/ch01/FrequencyConvergence.tsx` | `LearningExperiment`；`src/lib/learning/probability/ch01/FrequencyConvergence.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/probability/ch01/ReliabilityExplorer.tsx` | `LearningExperiment`；`src/lib/learning/probability/ch01/ReliabilityExplorer.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/probability/ch01/SampleSpaceBuilder.tsx` | `LearningExperiment`；`src/lib/learning/probability/ch01/SampleSpaceBuilder.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/probability/ch01/VennPlayground.tsx` | `LearningExperiment`；`src/lib/learning/probability/ch01/VennPlayground.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/probability/ch02/BinomialExplorer.tsx` | `LearningExperiment`；`src/lib/learning/probability/ch02/BinomialExplorer.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/probability/ch02/CDFVisualizer.tsx` | `LearningExperiment`；`src/lib/learning/probability/ch02/CDFVisualizer.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/probability/ch02/FuncDistDemo.tsx` | `LearningExperiment`；`src/lib/learning/probability/ch02/FuncDistDemo.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/probability/ch02/PDFExplorer.tsx` | `LearningExperiment`；`src/lib/learning/probability/ch02/PDFExplorer.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/probability/ch02/RVMapper.tsx` | `LearningExperiment`；`src/lib/learning/probability/ch02/RVMapper.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/probability/ch03/ConditionalExplorer.tsx` | `LearningExperiment`；`src/lib/learning/probability/ch03/ConditionalExplorer.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/probability/ch03/ConvolutionDemo.tsx` | `LearningExperiment`；`src/lib/learning/probability/ch03/ConvolutionDemo.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/probability/ch03/IndependenceChecker.tsx` | `LearningExperiment`；`src/lib/learning/probability/ch03/IndependenceChecker.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/probability/ch03/JointDistExplorer.tsx` | `LearningExperiment`；`src/lib/learning/probability/ch03/JointDistExplorer.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/probability/ch03/MarginalExplorer.tsx` | `LearningExperiment`；`src/lib/learning/probability/ch03/MarginalExplorer.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/probability/ch04/CorrelationExplorer.tsx` | `LearningExperiment`；`src/lib/learning/probability/ch04/CorrelationExplorer.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/probability/ch04/CovMatrixDemo.tsx` | `LearningExperiment`；`src/lib/learning/probability/ch04/CovMatrixDemo.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/probability/ch04/ExpectationExplorer.tsx` | `LearningExperiment`；`src/lib/learning/probability/ch04/ExpectationExplorer.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/probability/ch04/VarianceExplorer.tsx` | `LearningExperiment`；`src/lib/learning/probability/ch04/VarianceExplorer.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/probability/ch05/ChebyshevDemo.tsx` | `LearningExperiment`；`src/lib/learning/probability/ch05/ChebyshevDemo.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/probability/ch05/CLTSimulator.tsx` | `LearningExperiment`；`src/lib/learning/probability/ch05/CLTSimulator.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/probability/ch05/LLNSimulator.tsx` | `LearningExperiment`；`src/lib/learning/probability/ch05/LLNSimulator.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/probability/ch06/NormalSamplingDemo.tsx` | `LearningExperiment`；`src/lib/learning/probability/ch06/NormalSamplingDemo.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/probability/ch06/QuantileExplorer.tsx` | `LearningExperiment`；`src/lib/learning/probability/ch06/QuantileExplorer.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/probability/ch06/SamplingDistExplorer.tsx` | `LearningExperiment`；`src/lib/learning/probability/ch06/SamplingDistExplorer.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/probability/ch06/StatisticCalculator.tsx` | `LearningExperiment`；`src/lib/learning/probability/ch06/StatisticCalculator.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/probability/ch07/ConfidenceIntervalExplorer.tsx` | `LearningExperiment`；`src/lib/learning/probability/ch07/ConfidenceIntervalExplorer.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/probability/ch07/EstimatorComparator.tsx` | `LearningExperiment`；`src/lib/learning/probability/ch07/EstimatorComparator.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/probability/ch07/MLEExplorer.tsx` | `LearningExperiment`；`src/lib/learning/probability/ch07/MLEExplorer.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/probability/ch07/MomentEstimator.tsx` | `LearningExperiment`；`src/lib/learning/probability/ch07/MomentEstimator.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/probability/ch08/ErrorTypeDemo.tsx` | `LearningExperiment`；`src/lib/learning/probability/ch08/ErrorTypeDemo.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/probability/ch08/HypTestDemo.tsx` | `LearningExperiment`；`src/lib/learning/probability/ch08/HypTestDemo.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/probability/ch08/MeanTestExplorer.tsx` | `LearningExperiment`；`src/lib/learning/probability/ch08/MeanTestExplorer.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/probability/ch08/VarianceTestExplorer.tsx` | `LearningExperiment`；`src/lib/learning/probability/ch08/VarianceTestExplorer.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/probability/ReviewLabs.tsx` | `LearningExperiment`；`src/lib/learning/probability/ReviewLabs.tsx` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |
| `components/interactives/SaveInteractiveButton.tsx` | `AsyncAction`、`DirectoryPicker` | 实验参数与计算视图已提取；课程原件、录音、存储和生成请求通过宿主回调接入。 |

## keyboard

| 课栈源文件 | 共享组件 / 专用视图 | 调用契约 |
| --- | --- | --- |
| `components/keyboard/KeyboardShortcutProvider.tsx` | `ShortcutProvider`、`useShortcut` | 快捷键注册、范围控制、帮助和可配置组合键为共享层；业务命令由宿主注册。 |
| `components/keyboard/ShortcutHelpOverlay.tsx` | `ShortcutHelp`、`ShortcutSettings`、`ShortcutProvider` | 快捷键注册、范围控制、帮助和可配置组合键为共享层；业务命令由宿主注册。 |

## layout

| 课栈源文件 | 共享组件 / 专用视图 | 调用契约 |
| --- | --- | --- |
| `components/layout/AcademicYearSwitcher.tsx` | `AcademicYearSwitcher` | 布局、导航、文件树及外观视图共享；账户权限、课程目录和路由状态由宿主连接。 |
| `components/layout/AccessContext.tsx` | 宿主上下文 | 布局、导航、文件树及外观视图共享；账户权限、课程目录和路由状态由宿主连接。 |
| `components/layout/AppearanceSettingsControls.tsx` | `AppearanceWorkspace`、`appearanceStyles`、`resolveContentTypography` | 布局、导航、文件树及外观视图共享；账户权限、课程目录和路由状态由宿主连接。 |
| `components/layout/AppShell.tsx` | `WorkspaceLayout`、`WorkspaceTabs`、`RunWorkspace` | 布局、导航、文件树及外观视图共享；账户权限、课程目录和路由状态由宿主连接。 |
| `components/layout/BookshelfFilter.tsx` | `Bookshelf`、`SearchInput`、`SelectField` | 布局、导航、文件树及外观视图共享；账户权限、课程目录和路由状态由宿主连接。 |
| `components/layout/BrandLogo.tsx` | `IconButton`、`ModelSelector`、`ProductNavigation` | 布局、导航、文件树及外观视图共享；账户权限、课程目录和路由状态由宿主连接。 |
| `components/layout/FileTree.tsx` | `FileTree`、`ContextMenu`、`CollapseTransition` | 布局、导航、文件树及外观视图共享；账户权限、课程目录和路由状态由宿主连接。 |
| `components/layout/FileTreeItem.tsx` | `FileTree`、`ContextMenu`、`CollapseTransition` | 布局、导航、文件树及外观视图共享；账户权限、课程目录和路由状态由宿主连接。 |
| `components/layout/GlobalSettings.tsx` | `LearningRecords`、`AppearanceWorkspace`、`ShortcutSettings` | 布局、导航、文件树及外观视图共享；账户权限、课程目录和路由状态由宿主连接。 |
| `components/layout/HomeBookshelf.tsx` | `Bookshelf`、`SearchInput`、`SelectField` | 布局、导航、文件树及外观视图共享；账户权限、课程目录和路由状态由宿主连接。 |
| `components/layout/KeyboardShortcutsSettings.tsx` | `ShortcutHelp`、`ShortcutSettings`、`ShortcutProvider` | 布局、导航、文件树及外观视图共享；账户权限、课程目录和路由状态由宿主连接。 |
| `components/layout/MobileBottomNav.tsx` | `ProductNavigation`、`BottomNav` | 布局、导航、文件树及外观视图共享；账户权限、课程目录和路由状态由宿主连接。 |
| `components/layout/MobileChapterPicker.tsx` | `SelectField`、`TocTree` | 布局、导航、文件树及外观视图共享；账户权限、课程目录和路由状态由宿主连接。 |
| `components/layout/MobileProductNav.tsx` | `ProductNavigation`、`BottomNav` | 布局、导航、文件树及外观视图共享；账户权限、课程目录和路由状态由宿主连接。 |
| `components/layout/MobileTopBar.tsx` | `MobileTopBar` | 布局、导航、文件树及外观视图共享；账户权限、课程目录和路由状态由宿主连接。 |
| `components/layout/MobileViewport.tsx` | `Container`、`BottomNav`、`MobileTopBar` | 布局、导航、文件树及外观视图共享；账户权限、课程目录和路由状态由宿主连接。 |
| `components/layout/NewTabPlaceholder.tsx` | `WorkspaceEmpty` | 布局、导航、文件树及外观视图共享；账户权限、课程目录和路由状态由宿主连接。 |
| `components/layout/NotePane.tsx` | `WorkspaceLayout`、`WorkspaceTabs`、`RunWorkspace` | 布局、导航、文件树及外观视图共享；账户权限、课程目录和路由状态由宿主连接。 |
| `components/layout/NoteSplitPane.tsx` | `WorkspaceLayout`、`WorkspaceTabs`、`RunWorkspace` | 布局、导航、文件树及外观视图共享；账户权限、课程目录和路由状态由宿主连接。 |
| `components/layout/NoteTabStrip.tsx` | `WorkspaceTabs` | 布局、导航、文件树及外观视图共享；账户权限、课程目录和路由状态由宿主连接。 |
| `components/layout/ProductSwitcher.tsx` | `ProductNavigation`、`BottomNav` | 布局、导航、文件树及外观视图共享；账户权限、课程目录和路由状态由宿主连接。 |
| `components/layout/RightPanel.tsx` | `WorkspaceLayout`、`WorkspaceTabs`、`RunWorkspace` | 布局、导航、文件树及外观视图共享；账户权限、课程目录和路由状态由宿主连接。 |
| `components/layout/RuntimeCatalogProvider.tsx` | 宿主上下文 | 布局、导航、文件树及外观视图共享；账户权限、课程目录和路由状态由宿主连接。 |
| `components/layout/SettingsSection.tsx` | `SettingsForm`、`SettingsSection`、`SelectField` | 布局、导航、文件树及外观视图共享；账户权限、课程目录和路由状态由宿主连接。 |
| `components/layout/SharedNoteToolbar.tsx` | `Toolbar`、`SelectionActions`、`ShareAccessPanel` | 布局、导航、文件树及外观视图共享；账户权限、课程目录和路由状态由宿主连接。 |
| `components/layout/SiblingFilesPanel.tsx` | `SiblingFiles` | 布局、导航、文件树及外观视图共享；账户权限、课程目录和路由状态由宿主连接。 |
| `components/layout/SubjectSidebar.tsx` | `ProductNavigation`、`BottomNav` | 布局、导航、文件树及外观视图共享；账户权限、课程目录和路由状态由宿主连接。 |
| `components/layout/TocTree.tsx` | `TocTree` | 布局、导航、文件树及外观视图共享；账户权限、课程目录和路由状态由宿主连接。 |
| `components/layout/WorkspaceActivity.tsx` | `TaskProgress`、`TaskStatus`、`NotificationList` | 布局、导航、文件树及外观视图共享；账户权限、课程目录和路由状态由宿主连接。 |
| `components/layout/WorkspaceTreeContextMenu.tsx` | `FileTree`、`ContextMenu`、`CollapseTransition` | 布局、导航、文件树及外观视图共享；账户权限、课程目录和路由状态由宿主连接。 |

## notes

| 课栈源文件 | 共享组件 / 专用视图 | 调用契约 |
| --- | --- | --- |
| `components/notes/AnimatedInlineCard.tsx` | `MarkdownEditor`、`useMathEditor`、`configureMathPreferences`、`ShortcutSettings` | Markdown 编辑、阅读、引用、版本与保存会话共享；宿主提供文档、授权资源和版本持久化。 |
| `components/notes/AttachmentPicker.tsx` | `AttachmentPicker`、`ResourcePreview`、`FileCard` | Markdown 编辑、阅读、引用、版本与保存会话共享；宿主提供文档、授权资源和版本持久化。 |
| `components/notes/AttachmentView.tsx` | `AttachmentPicker`、`ResourcePreview`、`FileCard` | Markdown 编辑、阅读、引用、版本与保存会话共享；宿主提供文档、授权资源和版本持久化。 |
| `components/notes/BacklinksPanel.tsx` | `BacklinksPanel` | Markdown 编辑、阅读、引用、版本与保存会话共享；宿主提供文档、授权资源和版本持久化。 |
| `components/notes/CodeBlockLanguageSelect.tsx` | `MermaidPreview`、`CodeBlock`、`MarkdownEditor`、`SelectField` | Markdown 编辑、阅读、引用、版本与保存会话共享；宿主提供文档、授权资源和版本持久化。 |
| `components/notes/ContentPageClient.tsx` | `CourseContentWorkspace`、`MarkdownContent`、`LazyVisible` | Markdown 编辑、阅读、引用、版本与保存会话共享；宿主提供文档、授权资源和版本持久化。 |
| `components/notes/DirectiveBlockView.tsx` | `MarkdownEditor`、`DirectiveFields`、`moveEditorBlock`、`deleteEditorBlock` | Markdown 编辑、阅读、引用、版本与保存会话共享；宿主提供文档、授权资源和版本持久化。 |
| `components/notes/DynamicRecording.tsx` | `RecordingPlayback` | Markdown 编辑、阅读、引用、版本与保存会话共享；宿主提供文档、授权资源和版本持久化。 |
| `components/notes/GraphView.tsx` | `GraphView` | Markdown 编辑、阅读、引用、版本与保存会话共享；宿主提供文档、授权资源和版本持久化。 |
| `components/notes/ImageConversionView.tsx` | `ImagePasteOptions`、`MarkdownEditor`、`UploadPlaceholder`、`ImageConversion` | Markdown 编辑、阅读、引用、版本与保存会话共享；宿主提供文档、授权资源和版本持久化。 |
| `components/notes/ImagePasteDialog.tsx` | `ImagePasteOptions`、`MarkdownEditor`、`UploadPlaceholder`、`ImageConversion` | Markdown 编辑、阅读、引用、版本与保存会话共享；宿主提供文档、授权资源和版本持久化。 |
| `components/notes/ImportVaultDialog.tsx` | `ImportPanel`、`DirectoryPicker` | Markdown 编辑、阅读、引用、版本与保存会话共享；宿主提供文档、授权资源和版本持久化。 |
| `components/notes/MathEditor.tsx` | `MarkdownEditor`、`useMathEditor`、`configureMathPreferences`、`ShortcutSettings` | Markdown 编辑、阅读、引用、版本与保存会话共享；宿主提供文档、授权资源和版本持久化。 |
| `components/notes/MathShortcutSettings.tsx` | `MarkdownEditor`、`useMathEditor`、`configureMathPreferences`、`ShortcutSettings` | Markdown 编辑、阅读、引用、版本与保存会话共享；宿主提供文档、授权资源和版本持久化。 |
| `components/notes/MathSymbolPalette.tsx` | `MarkdownEditor`、`useMathEditor`、`configureMathPreferences`、`ShortcutSettings` | Markdown 编辑、阅读、引用、版本与保存会话共享；宿主提供文档、授权资源和版本持久化。 |
| `components/notes/MemberSearch.tsx` | `ShareAccessPanel`、`MemberSearch`、`MemberAccess`、`ShareLink`、`PermissionSummary`、`DirectoryPicker` | Markdown 编辑、阅读、引用、版本与保存会话共享；宿主提供文档、授权资源和版本持久化。 |
| `components/notes/MermaidCodeBlockView.tsx` | `MermaidPreview`、`CodeBlock`、`MarkdownEditor`、`SelectField` | Markdown 编辑、阅读、引用、版本与保存会话共享；宿主提供文档、授权资源和版本持久化。 |
| `components/notes/MermaidEditor.tsx` | `MermaidPreview`、`CodeBlock`、`MarkdownEditor`、`SelectField` | Markdown 编辑、阅读、引用、版本与保存会话共享；宿主提供文档、授权资源和版本持久化。 |
| `components/notes/NoteAttachmentCard.tsx` | `AttachmentPicker`、`ResourcePreview`、`FileCard` | Markdown 编辑、阅读、引用、版本与保存会话共享；宿主提供文档、授权资源和版本持久化。 |
| `components/notes/NoteLink.tsx` | `NoteLink` | Markdown 编辑、阅读、引用、版本与保存会话共享；宿主提供文档、授权资源和版本持久化。 |
| `components/notes/NoteRenderer.tsx` | `MarkdownContent`、`LearningExperiment`、`CanvasWorkspace` | Markdown 编辑、阅读、引用、版本与保存会话共享；宿主提供文档、授权资源和版本持久化。 |
| `components/notes/NoteRendererServer.tsx` | `MarkdownContent`、`LearningExperiment`、`CanvasWorkspace` | Markdown 编辑、阅读、引用、版本与保存会话共享；宿主提供文档、授权资源和版本持久化。 |
| `components/notes/NoteSkeleton.tsx` | `Skeleton`、`TaskProgress` | Markdown 编辑、阅读、引用、版本与保存会话共享；宿主提供文档、授权资源和版本持久化。 |
| `components/notes/NoteToolbar.tsx` | `Toolbar`、`SelectionActions`、`ShareAccessPanel` | Markdown 编辑、阅读、引用、版本与保存会话共享；宿主提供文档、授权资源和版本持久化。 |
| `components/notes/NoteWorkspaceActions.tsx` | `Toolbar`、`SelectionActions`、`ShareAccessPanel` | Markdown 编辑、阅读、引用、版本与保存会话共享；宿主提供文档、授权资源和版本持久化。 |
| `components/notes/ProgressiveNoteRenderer.tsx` | `MarkdownContent`、`LazyVisible` | Markdown 编辑、阅读、引用、版本与保存会话共享；宿主提供文档、授权资源和版本持久化。 |
| `components/notes/SelectionPopover.tsx` | `SelectionToolbar`、`SelectionActions`、`ColorPicker` | Markdown 编辑、阅读、引用、版本与保存会话共享；宿主提供文档、授权资源和版本持久化。 |
| `components/notes/ToolbarColorPicker.tsx` | `SelectionToolbar`、`SelectionActions`、`ColorPicker` | Markdown 编辑、阅读、引用、版本与保存会话共享；宿主提供文档、授权资源和版本持久化。 |
| `components/notes/UploadPlaceholderView.tsx` | `ImagePasteOptions`、`MarkdownEditor`、`UploadPlaceholder`、`ImageConversion` | Markdown 编辑、阅读、引用、版本与保存会话共享；宿主提供文档、授权资源和版本持久化。 |
| `components/notes/UploadQueue.tsx` | `UploadQueue` | Markdown 编辑、阅读、引用、版本与保存会话共享；宿主提供文档、授权资源和版本持久化。 |
| `components/notes/VisualNoteEditor.tsx` | `NoteEditorWorkspace`、`MarkdownEditor` | Markdown 编辑、阅读、引用、版本与保存会话共享；宿主提供文档、授权资源和版本持久化。 |

## quiz

| 课栈源文件 | 共享组件 / 专用视图 | 调用契约 |
| --- | --- | --- |
| `components/quiz/QuizMarkdown.tsx` | `MarkdownContent`、`LazyVisible` | 问题、作答、评分与复盘视图共享；题库、评分规则及学习记录持久化由宿主注入。 |
| `components/quiz/QuizQuestion.tsx` | `QuizQuestion` | 问题、作答、评分与复盘视图共享；题库、评分规则及学习记录持久化由宿主注入。 |
| `components/quiz/QuizScoring.tsx` | `QuizScoring` | 问题、作答、评分与复盘视图共享；题库、评分规则及学习记录持久化由宿主注入。 |
| `components/quiz/QuizSummary.tsx` | `QuizSummary` | 问题、作答、评分与复盘视图共享；题库、评分规则及学习记录持久化由宿主注入。 |
| `components/quiz/QuizTab.tsx` | `QuizWorkspace`、`QuizQuestion`、`MarkdownContent` | 问题、作答、评分与复盘视图共享；题库、评分规则及学习记录持久化由宿主注入。 |

## resources

| 课栈源文件 | 共享组件 / 专用视图 | 调用契约 |
| --- | --- | --- |
| `components/resources/ResourceCenter.tsx` | `ResourceWorkspace`、`ResourceExplorer`、`ResourcePreview`、`RecycleBin` | 文件树、资源管理和预览视图共享；鉴权、Office 转换、存储和回收站操作由宿主回调执行。 |
| `components/resources/ResourcePreview.tsx` | `ResourcePreview`、`PdfPreview`、`AudioPlayer`、`VideoPlayer` | 文件树、资源管理和预览视图共享；鉴权、Office 转换、存储和回收站操作由宿主回调执行。 |

## review

| 课栈源文件 | 共享组件 / 专用视图 | 调用契约 |
| --- | --- | --- |
| `components/review/CollapsibleSection.tsx` | `CollapsibleSection`、`CollapseTransition` | 复习记录、翻卡、预览与统计视图共享；复习算法、计划与持久化由宿主连接。 |
| `components/review/FlipCard.tsx` | `FlipCard`、`RecallContent` | 复习记录、翻卡、预览与统计视图共享；复习算法、计划与持久化由宿主连接。 |
| `components/review/RecordPreviewLayer.tsx` | `FloatingWindow`、`WindowChrome`、`WindowTaskbar`、`ArtifactPreview` | 复习记录、翻卡、预览与统计视图共享；复习算法、计划与持久化由宿主连接。 |
| `components/review/RecordPreviewWindow.tsx` | `FloatingWindow`、`WindowChrome`、`WindowTaskbar`、`ArtifactPreview` | 复习记录、翻卡、预览与统计视图共享；复习算法、计划与持久化由宿主连接。 |
| `components/review/ReviewPage.tsx` | `ReviewDashboard`、`MemoryCard` | 复习记录、翻卡、预览与统计视图共享；复习算法、计划与持久化由宿主连接。 |

## search

| 课栈源文件 | 共享组件 / 专用视图 | 调用契约 |
| --- | --- | --- |
| `components/search/GlobalSearchButton.tsx` | `SearchResults`、`CommandMenu` | 搜索输入、命令菜单和结果视图共享；实际索引、查询与导航回调由宿主提供。 |

## setup

| 课栈源文件 | 共享组件 / 专用视图 | 调用契约 |
| --- | --- | --- |
| `components/setup/SetupWizard.tsx` | `SetupWizard` | 设置步骤、表单和反馈共享；站点初始化及账户创建由宿主服务执行。 |

## shared

| 课栈源文件 | 共享组件 / 专用视图 | 调用契约 |
| --- | --- | --- |
| `components/shared/ChoiceMenu.tsx` | `SelectField`、`Popup` | 共享展示与交互组件；资源鉴权和业务动作通过显式回调传入。 |
| `components/shared/CodeBlock.tsx` | `MermaidPreview`、`CodeBlock`、`MarkdownEditor`、`SelectField` | 共享展示与交互组件；资源鉴权和业务动作通过显式回调传入。 |
| `components/shared/ContentImage.tsx` | `ContentImage` | 共享展示与交互组件；资源鉴权和业务动作通过显式回调传入。 |
| `components/shared/directives/Callout.tsx` | `Callout`、`MarkdownContent` | 共享展示与交互组件；资源鉴权和业务动作通过显式回调传入。 |
| `components/shared/directives/CauseEffect.tsx` | `CauseEffect` | 共享展示与交互组件；资源鉴权和业务动作通过显式回调传入。 |
| `components/shared/directives/CompareTable.tsx` | `CompareTable` | 共享展示与交互组件；资源鉴权和业务动作通过显式回调传入。 |
| `components/shared/directives/ConceptCard.tsx` | `ConceptCard` | 共享展示与交互组件；资源鉴权和业务动作通过显式回调传入。 |
| `components/shared/directives/Derivation.tsx` | `Derivation`、`FormulaSteps` | 共享展示与交互组件；资源鉴权和业务动作通过显式回调传入。 |
| `components/shared/directives/EventCard.tsx` | `EventCard` | 共享展示与交互组件；资源鉴权和业务动作通过显式回调传入。 |
| `components/shared/directives/Figure.tsx` | `Figure`、`ContentImage` | 共享展示与交互组件；资源鉴权和业务动作通过显式回调传入。 |
| `components/shared/directives/HistoryMap.tsx` | `HistoryLocationMap`、`HistoryMap` | 共享展示与交互组件；资源鉴权和业务动作通过显式回调传入。 |
| `components/shared/directives/KeyPoint.tsx` | `KeyPoint` | 共享展示与交互组件；资源鉴权和业务动作通过显式回调传入。 |
| `components/shared/directives/LearningAnimation.tsx` | `LearningAnimation`、`VideoPlayer` | 共享展示与交互组件；资源鉴权和业务动作通过显式回调传入。 |
| `components/shared/directives/MediaEmbed.tsx` | `VideoPlayer`、`AudioPlayer`、`EmbedFallback` | 共享展示与交互组件；资源鉴权和业务动作通过显式回调传入。 |
| `components/shared/directives/MemoryCard.tsx` | `MemoryCard`、`RecallContent` | 共享展示与交互组件；资源鉴权和业务动作通过显式回调传入。 |
| `components/shared/directives/Timeline.tsx` | `ReadingTimeline`、`Timeline` | 共享展示与交互组件；资源鉴权和业务动作通过显式回调传入。 |
| `components/shared/FloatingPanel.tsx` | `AnchoredPanel` | 共享展示与交互组件；资源鉴权和业务动作通过显式回调传入。 |
| `components/shared/HorizontalScrollbar.tsx` | `HorizontalScrollbar` | 共享展示与交互组件；资源鉴权和业务动作通过显式回调传入。 |
| `components/shared/ImageLightbox.tsx` | `MediaLightbox` | 共享展示与交互组件；资源鉴权和业务动作通过显式回调传入。 |
| `components/shared/MermaidBlock.tsx` | `MermaidPreview`、`CodeBlock`、`MarkdownEditor`、`SelectField` | 共享展示与交互组件；资源鉴权和业务动作通过显式回调传入。 |
| `components/shared/MessageContextMenu.tsx` | `ContextMenu`、`SelectionActions` | 共享展示与交互组件；资源鉴权和业务动作通过显式回调传入。 |
| `components/shared/PdfPreview.tsx` | `ResourcePreview`、`PdfPreview`、`AudioPlayer`、`VideoPlayer` | 共享展示与交互组件；资源鉴权和业务动作通过显式回调传入。 |
| `components/shared/ResizeLoader.tsx` | `Skeleton`、`TaskProgress` | 共享展示与交互组件；资源鉴权和业务动作通过显式回调传入。 |
| `components/shared/SubjectIcon.tsx` | `IconButton`、`ModelSelector`、`ProductNavigation` | 共享展示与交互组件；资源鉴权和业务动作通过显式回调传入。 |
| `components/shared/SurfaceBoundary.tsx` | `SurfaceBoundary` | 共享展示与交互组件；资源鉴权和业务动作通过显式回调传入。 |
| `components/shared/TaskDialog.tsx` | `Dialog`、`TaskProgress` | 共享展示与交互组件；资源鉴权和业务动作通过显式回调传入。 |
| `components/shared/TreeDisclosure.tsx` | `FileTree`、`ContextMenu`、`CollapseTransition` | 共享展示与交互组件；资源鉴权和业务动作通过显式回调传入。 |
| `components/shared/WorkspaceLoading.tsx` | `Skeleton`、`TaskProgress` | 共享展示与交互组件；资源鉴权和业务动作通过显式回调传入。 |

## ui

| 课栈源文件 | 共享组件 / 专用视图 | 调用契约 |
| --- | --- | --- |
| `components/ui/AnimatedCollapse.tsx` | `CollapseTransition`、`AnimatedSize` | 共享过渡、可见性和提示组件；支持减少动态效果的系统偏好。 |
| `components/ui/LazyVisible.tsx` | `LazyVisible` | 共享过渡、可见性和提示组件；支持减少动态效果的系统偏好。 |
| `components/ui/Tip.tsx` | `Tooltip` | 共享过渡、可见性和提示组件；支持减少动态效果的系统偏好。 |
| `components/ui/Tooltip.tsx` | `Tooltip` | 共享过渡、可见性和提示组件；支持减少动态效果的系统偏好。 |

## video

| 课栈源文件 | 共享组件 / 专用视图 | 调用契约 |
| --- | --- | --- |
| `components/video/ClassroomProgress.tsx` | `ClassroomTimeline`、`Progress` | 播放控制、常用快捷键、字幕、原生画中画和讲稿笔记联动共享；播放授权和学习进度由宿主维护。 |
| `components/video/InlinePlayer.tsx` | `VideoPlayer`、`AudioPlayer`、`LectureWorkspace` | 播放控制、常用快捷键、字幕、原生画中画和讲稿笔记联动共享；播放授权和学习进度由宿主维护。 |
| `components/video/LectureDock.tsx` | `LectureDock` | 播放控制、常用快捷键、字幕、原生画中画和讲稿笔记联动共享；播放授权和学习进度由宿主维护。 |
| `components/video/LecturePlayer.tsx` | `VideoPlayer`、`AudioPlayer`、`LectureWorkspace` | 播放控制、常用快捷键、字幕、原生画中画和讲稿笔记联动共享；播放授权和学习进度由宿主维护。 |
| `components/video/PipPlayer.tsx` | `VideoPlayer`、`FloatingWindow`、`LectureDock` | 播放控制、常用快捷键、字幕、原生画中画和讲稿笔记联动共享；播放授权和学习进度由宿主维护。 |
| `components/video/VideoTab.tsx` | `LectureWorkspace`、`VideoPlayer` | 播放控制、常用快捷键、字幕、原生画中画和讲稿笔记联动共享；播放授权和学习进度由宿主维护。 |

## visualizations

| 课栈源文件 | 共享组件 / 专用视图 | 调用契约 |
| --- | --- | --- |
| `components/visualizations/primitives/DistributionChart.tsx` | `LearningExperiment`；`src/lib/learning/visualizations/DistributionChart.tsx` | 图形和可视化展示共享，数据、课堂控制及业务动作由宿主连接。 |
| `components/visualizations/primitives/FormulaSteps.tsx` | `LearningExperiment`；`src/lib/learning/visualizations/FormulaSteps.tsx` | 图形和可视化展示共享，数据、课堂控制及业务动作由宿主连接。 |
| `components/visualizations/primitives/VennDiagram.tsx` | `LearningExperiment`；`src/lib/learning/visualizations/VennDiagram.tsx` | 图形和可视化展示共享，数据、课堂控制及业务动作由宿主连接。 |
| `components/visualizations/primitives/VideoPlayer.tsx` | `VideoPlayer`、`LectureDock`、`ClassroomTimeline` | 图形和可视化展示共享，数据、课堂控制及业务动作由宿主连接。 |

## window

| 课栈源文件 | 共享组件 / 专用视图 | 调用契约 |
| --- | --- | --- |
| `components/window/OverflowMenu.tsx` | `WindowTaskbar`、`Dropdown` | 窗口标题、右上角关闭、边界限制、全屏和任务栏为共享层；宿主维护窗口会话。 |
| `components/window/WindowChrome.tsx` | `WindowChrome` | 窗口标题、右上角关闭、边界限制、全屏和任务栏为共享层；宿主维护窗口会话。 |
| `components/window/WindowTaskbar.tsx` | `WindowTaskbar`、`Dropdown` | 窗口标题、右上角关闭、边界限制、全屏和任务栏为共享层；宿主维护窗口会话。 |

## 应用入口与内容注册

| 源文件 | 共享组件 | 边界 |
| --- | --- | --- |
| `frontend/SharedPage.tsx` | SharedReadingPage | 分享目录、阅读权限状态、引用复制、标题目录和手机抽屉。授权与实际笔记加载由宿主提供。 |
| `frontend/ReleaseNotice.tsx` | ReleaseNotice、useReleaseUpdate | 版本检查、通知、暂缓、更新前保存守卫；版本标识与刷新回调由宿主提供。 |
| `frontend/App.tsx` | 宿主应用 | 宿主应用入口、路由、按需加载或缓存；不属于可复用展示组件。 |
| `frontend/dynamic.tsx` | 宿主应用 | 宿主应用入口、路由、按需加载或缓存；不属于可复用展示组件。 |
| `frontend/Link.tsx` | 宿主应用 | 宿主应用入口、路由、按需加载或缓存；不属于可复用展示组件。 |
| `frontend/main.tsx` | 宿主应用 | 宿主应用入口、路由、按需加载或缓存；不属于可复用展示组件。 |
| `frontend/navigation.tsx` | 宿主应用 | 宿主应用入口、路由、按需加载或缓存；不属于可复用展示组件。 |
| `frontend/WorkspaceCache.tsx` | 宿主应用 | 宿主应用入口、路由、按需加载或缓存；不属于可复用展示组件。 |
| `lib/content/componentRegistry.tsx` | LearningExperiment、getLearningExperiment、learningExperiments | 登记全部学科实验；课程专属原件通过 LearningSourceView 或 renderSource 接入。 |
| `lib/markdown/noteComponents.tsx` | MarkdownContent | Markdown 指令、公式、图片与标题映射；宿主提供内部资源解析。 |
| `lib/utils/xmlParser.tsx` | MarkdownContent、LearningExperiment、CanvasWorkspace | XML/工具响应转 Markdown 的业务解析保留宿主；解析后的笔记、实验和画布使用共享视图。 |
