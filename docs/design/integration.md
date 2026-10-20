# 接入与课栈适配

## 基础

从 `@fiveplusone/ui` 导入组件，入口引入一次 `@fiveplusone/ui/styles.css`。公开属性以包内 TypeScript 声明为准。设计网站提供 126 项组件目录。0.3.2 工作区接口见 [课栈接入指南](../kezhan-migration-guide.md)。样式采用 `fp-` 前缀；全局焦点规则需要与宿主共同检查。

## 资料预览

ResourcePreview 接收 `resource: { name, url, mediaType?, bytes?, previewUrl?, downloadUrl? }`。普通媒体使用授权 URL，Office 将 previewUrl 指向分页服务；原文件下载与预览可以分开传入。

PdfPreview 从课栈提取，保留分页延迟加载、转换轮询、缩放、跳页、独立展开状态、滚动快照和横向滚动逻辑。它请求 URL 的 `view=pages` 形式并携带同源凭证。成功响应为 `{ status: "ready", contentHash, manifest: { pages: [{ n, url }], pageCount } }`；转换状态和版本字段按原课栈服务与组件源码保持兼容。工作区目录提供协议说明及样例。

宿主负责文件授权、转换队列、页面图片与下载权限；跨域资源需要正确的 CORS 和鉴权。文本按文本渲染并限制大小。网站使用样例文件和预制页面图展示交互，不提供 Office 转换服务器。

## 文件树

节点使用稳定唯一的 id、name、kind 和可选 children。selectedId/onSelect 管理选择，onRename/onRemove/onCreate 接入服务；namespace 区分实例。宿主更新节点，并处理权限、请求失败和移除恢复。

支持上下遍历、右方向展开、左方向折叠或返回父节点、Home/End、Enter/Space 选择。行内操作菜单不会触发行选择。

## 协作编辑

useCollaboration 接收 url、room、token、user，返回 session 与 status。将 session 的 document/provider 传给 CollaborativeEditor。token 可为异步函数，应保持引用稳定。服务端必须按用户与房间校验读写权限，持久化 Yjs 更新并支持恢复；展示名称与颜色不是权限凭证。

课栈已有数学、附件与引用等自定义节点时，通过 baseExtensions 传入与原编辑器一致的完整基础 schema，关闭其中与 Collaboration 冲突的历史插件；extensions 用于追加扩展。保留原节点名称、属性和序列化方式，先以真实历史文档做往返验证。默认 StarterKit 用于通用富文本。

共享文档从服务加载，不应在每次连接时通过 content 重置内容。onChange 提供 JSON，onReady 提供编辑器实例。数学编辑、上传、评论、版本历史继续通过宿主扩展接入。

演示的两个编辑器共用真实 Y.Doc，并以 BroadcastChannel 展示同源标签页同步；没有生产持久化与跨设备服务。生产接入需验证断线重连、并发、只读权限和保存恢复。

## 迁移步骤

1. 在独立页面接入主题和控件，检查宿主样式与弹层主题。
2. 替换工具栏、表单与反馈，连接真实业务状态。
3. 文件树接入稳定节点和服务回调。
4. 预览连接原服务，验收大文档、等待、登录过期与移动滚动。
5. 编辑器保留原 schema 和服务配置，核对历史内容与附件恢复。
6. 完整任务验收后逐页推广。

## 验证范围

回归测试覆盖预览分页、转换等待、滚动、文件树键盘和菜单、按钮表单行为、文本安全渲染，以及两个实际编辑器的共享更新。浏览器检查覆盖桌面、窄屏、文档缩放和实时输入同步。生产预览与跨设备服务须在接入项目联合验收。

## 品牌与产品主题

```html
<html data-theme="light" data-product="kezhan">
```

五加一视觉标识始终使用 `--fp-brand: #FD8B07`。data-product 可取 brand、kezhan、marker、onepass；主题控制按钮、选中、链接和焦点的语义变量。`productThemes` 导出主题名称与配色，宿主可据此实现产品主题选择。自定义产品应同时提供 primary、on-primary、primary-soft、primary-ink 四项，并配置深色模式；避免只覆盖实心色而损失文字对比度。

文件树采用独立于表单的密度：桌面行高 36px，触屏行高 44px；行内更多操作使用 28px 图标入口，悬停、键盘聚焦或选中时显示。文件名称保留完整的悬停提示，长名称在可用宽度内截断。

文件工作区在 760px 以上并排展示目录与内容，窄屏使用受限高度的目录。预览标题与工具栏分别承担文件识别、翻页和缩放职责，下载入口位于预览工具栏。

菜单支持外部点击关闭、Escape 关闭并恢复焦点、方向键及 Home/End 导航。弹层脱离局部滚动容器，位于模态框中的菜单保留在该模态框内。

品牌图形统一由 BrandLogo 组件加载 http://go.r-l.ink/ico。
