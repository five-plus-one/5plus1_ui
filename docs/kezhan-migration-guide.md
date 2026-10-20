# 课栈组件接入指南

适用版本：@fiveplusone/ui 0.3.4。课栈实际入口为 frontend/main.tsx。组件库提供视图与交互契约，业务服务、权限、持久化和保存协议由课栈接入。

## 安装与主题

组件库执行 npm run build、npm pack，在课栈安装 fiveplusone-ui-0.3.4.tgz。入口引入 @fiveplusone/ui/styles.css，根元素设置 data-product="kezhan" 与 data-theme="light" 或 dark。品牌色固定 #FD8B07，课栈操作主题 #1A73E8，Logo 使用 https://go.r-l.ink/ico。

运行依赖为 React 19、Tiptap 3.32、Yjs 13.6、react-resizable-panels 2.x。接入时检查依赖树，确保 React、Yjs、Tiptap core/pm 使用同一实例和兼容版本；锁定依赖后验证历史文档与协作。

## 布局与文件

WorkspaceLayout.panels 每项包含 id、label、content，可设置百分比 defaultSize/minSize/maxSize 和 collapsible/collapsedSize。嵌套布局提供分屏，外层必须有明确高度。ref 提供 getLayout/setLayout/collapse/expand/resize/isCollapsed。persistenceKey 按产品、账户、工作区区分；宿主处理布局版本与账户退出策略。原 ResizablePanel 保持 first/second 两栏接口。

FileTree 使用全路径或资源 ID 作为稳定 id。expandedIds/onExpandedChange 控制展开；onToggle 通知变化，onPrefetch 在悬停和聚焦时触发，由宿主去重并检查权限。onOpen(node,event) 保留修饰键，onMiddleClick 处理中键，onNodeDragStart/onNodeDrop 处理拖放。onSelect(node) 保持兼容。路径组合、排序、资源变更与恢复由课栈处理。

ResourcePreview/PdfPreview 连接现有授权、转换和分页服务。Office 演示使用预制页面，生产需真实转换服务。验收 PDF、DOCX、PPTX、XLSX、大文件、等待、登录过期、失败重试和窄屏滚动。

## 对话与输入

MessageList<T> 接收稳定 ID 和 renderMessage，保留复杂消息内容；超过 30 条默认启用虚拟滚动，可设置 estimateSize、virtualize、历史加载及 bottomInset。流式增长时保持粘底，阅读历史时停止自动跳底。sessionId 与 hydrated 管理切换恢复，位置只保存在当前组件实例中，跨卸载恢复由宿主处理。继续保留 SSE、消息归并、重试与会话缓存，并以真实长消息验证滚动行为。

ChatComposer 采用 value/onChange/onSend，发送成功后由宿主清空草稿。onStop/isLoading 连接取消；attachments 标记 uploading/ready/error，上传中或失败时阻止发送；onFiles 接收选择、粘贴与拖放。quotedText/onClearQuote 管理引用，tools 插入模型、思考、搜索等控件，onComposerInsetChange 通知高度。上传、配额与请求恢复由课栈提供。

## Markdown 编辑器

MarkdownEditor 沿用课栈 NOTE_SCHEMA_VERSION=2，包含标题、列表、表格、代码语言、图片、附件、公式和指令卡片；工具栏、公式编辑、矩阵、符号与快捷键已移入组件库。段首输入 / 打开快捷插入。

markdown 提供初始内容；切换笔记更新 documentKey，同一文档外部恢复通过 onReady 返回的 Editor 实例执行。onChange 返回 Markdown 和 JSON。onHistory/onSnapshot/onExport/onAttachment 接入业务操作，未提供的操作从工具栏隐藏。onFiles 连接上传，resolveResourceUrl 解析授权资源地址。

协作模式传入 document:Y.Doc、provider、user，从共享文档加载，不使用初始 Markdown 重置房间。editable 控制视图，服务端仍需验证权限；握手检查 schema 版本。上线前使用真实历史文档验证附件、公式、表格、卡片、代码往返及并发编辑。

renderDirective 注入课栈专用卡片视图，默认卡片可编辑嵌套 Markdown。课栈全部专用指令渲染器、版本面板、保存冲突和本地恢复仍需业务层接入。extensions 追加不同名称扩展，已有节点的变更统一调整 schema，避免重复注册。

configureMathPreferences 可注入账户范围存储，默认本地存储。上传、鉴权和跨设备同步由宿主提供。

## 视频与权限

VideoPlayer.resolveSource(src,signal) 获取授权源，切换时取消旧请求。videoRef 暴露原生 video；startAt/onTimeUpdate/onSeek/onPlaybackRateChange/tracks 接入位置、课堂控制和字幕。授权刷新、保存节流、课程时间轴继续由课栈控制器处理。

播放器快捷键仅在播放器内获得焦点时生效：空格/K 播放暂停，左右方向键跳转 5 秒，J/L 跳转 10 秒，上下方向键调整音量，M 静音，F 全屏，Home/End 到首尾，数字 0–9 跳转百分比位置，暂停时逗号/句号按 1/30 秒步进。可用 keyboardShortcuts={false} 关闭。输入框、按钮和滑块保留原有键盘行为。

CollaborativeEditor 复用 MarkdownEditor 的工具栏、公式、卡片、Mermaid 和快捷插入。onChange 保留 JSON 回调，onMarkdownChange 返回 Markdown；document/provider/user 接入共享文档和协作身份。

MemberAccess 受控展示 members/roles；canManage、成员 editable、busyIds 控制可操作状态；onInvite/onRoleChange/onRemove 连接真实服务。账户、积分和管理流程保留课栈业务状态，复用表单与弹窗；服务端独立校验权限。

## 推广验收

先接主题和基础控件，再接布局、文件树、预览、对话与编辑器。逐批验证深浅主题、窄屏、键盘、弹层关闭和焦点、真实权限与失败恢复。编辑器额外验证断线重连、历史内容、并发和保存冲突；对话验证长历史、流式增量和恢复。覆盖原有完整用户任务后再切换默认入口。
