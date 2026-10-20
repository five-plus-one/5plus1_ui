# 课栈工作区接入契约

适用版本：`@fiveplusone/ui 0.5.0`。组件包提供视图、编辑状态、交互和异步反馈；课栈连接现有账户、授权、数据和后台服务。对应关系见 [逐文件清单](kezhan-component-map-2026-10-20.md)。

## 账户与平台

| 组件 | 输入与行为 | 宿主回调 |
| --- | --- | --- |
| CommerceWorkspace | 积分规则、资料处理价格、会员计划增改删、支付设置、模型单价同步与覆盖 | `onSave(value)`、`onSyncPrices()`；同步前要求先保存本地修改，失败保留输入 |
| DirectoryWorkspace | 用户/用户组搜索、分页、用户资料、组成员选择、删除确认 | `onSaveUser`、`onSaveGroup`、`onDeleteGroup`；保护账户通过 `protectedUserIds` 指定 |
| UserDetailsWorkspace | 资料、存储、积分和平台权限；切换分区保留输入 | `onSaveProfile`、`onSaveCapacity`、`onAdjustCredits`、`onSaveAdministrator` |
| AdministratorDirectory / CapacityDirectory | 搜索管理员与存储账户，编辑对应设置 | `onSave(id,value)`；受保护账户的限制由宿主声明，服务端仍校验权限 |
| PlatformWorkspace | 站点名称、品牌、帮助地址、模型供应商及扫描识别设置 | `onSave`、`onConfigureStorage`；已有密钥用状态标记表示，后台决定是否替换 |
| PlatformReset | 输入确认语句后重新配置平台 | `onReset`；宿主保留课程和资料，执行平台配置重置 |

异步回调应在服务确认成功后 resolve，失败应抛出用户能够理解的错误。组件会保持当前输入并允许重试。不要在网络请求发出时提前返回成功。

## 助手与技能

`AISettingsWorkspace` 接收 `AISettings`：API 分组、模型能力、协议、上下文、缓存与价格、思考参数、图片生成、默认模型、全局提示和工具默认值。模型改名会同时更新默认引用；删除模型或分组会清理对应选择。导入时校验完整嵌套结构，导出由 `onExportSettings` 接入。

`SkillsWorkspace` 接收完整的 `EditableSkill[]`，支持 Markdown 文件批量导入、frontmatter 名称和描述、正文编辑、常用固定、删除确认和保存。默认最多 100 个技能、单文件 2 MB，可由宿主调整。导入采用整批校验；其中一个文件失败时保留原列表。`onSave` 保存完整列表；`onExport` 接入文件下载。

对话会话、消息归并、SSE、真实工具执行、计费和权限继续由课栈提供。`ChatComposer`、`MessageList`、`MessageContentView` 和 `FollowUpQuestions` 可与以上设置组件组合。

## 笔记本发布

`NotebookManagerWorkspace` 组合课程搜索、待发布筛选、新建、草稿选择和笔记本管理。`NotebookPublishing` 负责单本课程的资料来源、清单导入、预览、发布、来源更新方式和发布历史。

- `onPrepare({notebookId,sourcePrefix,manifest})` 返回 `NotebookDraft`，包含实际章节和资源清单；每项预览提供 `content`。
- `onPublish(draftId,expectedRelease)` 在宿主完成版本检查与发布。组件会先显示明确的发布确认。
- `onSetSource({sourcePrefix,syncMode})` 保存来源目录和自动/人工确认方式。
- `onRestore(releaseId,expectedRelease)` 恢复实际发布版本；宿主校验版本、权限与存储。
- 清单导入只解析和校验输入；文件读取、预检、发布和持久化由现有服务承担。

更换来源后会清除前一次预览；不同笔记本拥有独立会话，避免旧课程内容进入新课程。

## 编辑与阅读

`NoteEditorWorkspace` 接收 `{id,title,markdown,revision}` 和 `onSave(note,signal)`。保存回调必须返回对应文档的新版本。保存期间的新输入会保留，并在下一次保存时使用新的 revision；切换文档会终止旧请求。自动保存默认延迟 1600 ms，可通过 `autosaveDelay` 调整，设为 0 时使用手动保存。

`registerNavigationGuard` 把保存守卫交给宿主路由。宿主离开当前笔记前应等待守卫返回 true。外部新版本到达且当前有编辑时，显示明确选择；版本恢复期间暂停编辑，避免覆盖正在输入的内容。关闭页面还有浏览器离开保护。

`CourseContentWorkspace` 组合正文、例题、练习、阅读/编辑切换和全屏。`renderedContent` 可承接宿主服务端或渐进渲染；默认使用共享 `MarkdownContent`。切换正文分区前保存失败时，保留编辑界面和草稿。

`MarkdownContent` 包含 GFM、合并单元格、KaTeX、化学公式、标题锚点、Obsidian 内联样式、指令卡片、Mermaid、画布和学科实验。HTML 只保留明确允许的结构与颜色属性。`renderDirective` 接入业务卡片，`resolveResourceUrl` 接入授权资源。`MarkdownEditor` 保留 `/` 插入、嵌套卡片、公式矩阵、Mermaid、表格、块拖动和块移动快捷键。

协作编辑通过现有 `CollaborativeEditor` 或 `MarkdownEditor` 的 Yjs 接口连接。房间鉴权、持久化、离线恢复和历史文档兼容验证由课栈承担；设计站双视图示例使用同一份真实 Y.Doc。

## 画布与学科实验

`CanvasWorkspace` 接收真实 `CanvasBlock`。`onRevise(block,instruction,signal)` 返回候选版本；组件先预览，再通过 `onChange` 采用。旧请求会在当前画布变化或卸载时取消。诊断信息通过 `onDiagnostic` 进入开发日志，界面显示简洁的恢复说明。

函数图、多曲线、SVG、图形交互和通用画布控制已提取。HTML 在隔离 iframe 中运行，禁用网络连接、表单、同源权限和顶层导航。分子图由 `renderMolecule(smiles,{width,height,signal})` 返回 SVG，组件执行安全处理。生成模型、RDKit 等专用运行时由宿主提供。

`learningExperiments` 登记 88 项入口：78 项参数化实验、10 项课程原始资料入口。`LearningExperiment` 根据稳定 ID 打开专用视图，`ExperimentLibrary` 提供学科筛选、搜索、选择和保存。实验计算与参数控制来自现有课栈实现，并改用统一选择控件、产品颜色、表单和窄屏布局。

`sources` 使用实验 ID 或 `id:audio|document|transcript` 关联 `LearningSourceResource`；也可使用 `renderSource` 返回授权后的真实课程视图。`LearningSourceView` 展示课件预览、录音、讲稿、章节和 Markdown。课程原件不随组件包复制，继续由课栈私有存储授权访问。

## 课堂、浏览与分享

`LectureWorkspace` 把音视频、逐词讲稿、章节和 Markdown 课堂笔记组合起来。讲稿点击、章节跳转和引用均带真实时间；跟随播放只滚动讲稿区域。宿主传入 `media`、`transcript`、`chapters`、`notes` 和 `onNotesChange`，并接收 `onCite`。播放源使用 `resolveSource` 连接鉴权，播放进度与课堂笔记由宿主持久化。

`BrowserWorkspace` 组合地址栏、前进后退、主页、刷新、外部打开、手机/桌面视图及完整收藏设置。实际网页由 `children` 或宿主 webview 提供；`BrowserPreferences` 管理收藏和主页。网址输入接受 HTTP/HTTPS，自动补全无协议域名；禁止执行型协议。

`SharedReadingPage` 接收目录、标题目录、正文、权限状态和导航回调，提供目录搜索、手机抽屉、阅读导航及引用复制。`ReleaseNotice` 与 `useReleaseUpdate` 接入宿主发布标识：可见页面轮询，失焦恢复检查，合并并发请求，卸载取消；`beforeRefresh` 可复用编辑保存守卫。

## 外观、弹层与动效

`AppearanceWorkspace` 提供明暗、产品默认/内容彩色/自定义、主色、划词和不同区域字体继承。调用 `appearanceStyles(value,systemDark,product)` 将变量应用到实际工作区；调用 `resolveContentTypography(value,region)` 应用阅读、编辑和对话的字号、字体和行高。

`Popup`、`AnchoredPanel` 和 `ContextMenu` 从触发位置继承产品配色，支持外部点击、Escape、焦点恢复和窗口边界。嵌套浮层保留父面板。`AnchoredPanel` 接受外部 anchor，适合选择工具条和宿主已有按钮。

容器使用 `AnimatedSize` 或 `CollapseTransition` 跟随内容测量；切换指示块约 180 ms，公式收起约 220 ms，内容高度约 240 ms。减少动态效果时取消相应过渡。窗口的关闭操作位于标题栏右上角，触摸操作使用足够的点击范围。
