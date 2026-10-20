# 课栈组件映射

版本：0.2.0。公开属性以生成的 TypeScript 声明为准，接入流程见 [迁移指南](kezhan-migration-guide.md)。

| 区域 | 组件库入口 | 课栈接入职责 |
| --- | --- | --- |
| 三栏与分屏 | WorkspaceLayout | 工作区状态、宽度存储、移动导航 |
| 文件树 | FileTree | 全路径 ID、受控展开、预取去重、打开与拖放业务 |
| 文件预览 | ResourcePreview、PdfPreview | 授权、Office 转换、下载和恢复 |
| 对话历史 | MessageList、MessageBubble | SSE、消息模型、复杂内容与缓存 |
| AI 输入 | ChatComposer、ModelSelector | 上传、引用、配额、发送和停止 |
| Markdown 笔记 | MarkdownEditor、转换函数 | 保存、历史、冲突、专用卡片、资源服务 |
| 多人协作 | useCollaboration、Y.Doc、provider | 鉴权、schema 校验、持久化、重连 |
| 视频 | VideoPlayer | 授权源、播放记录、课堂控制 |
| 成员权限 | MemberAccess | 权限校验、邀请、角色和移除 |
| 账户与积分 | 表单、Dialog、反馈控件 | 账户与管理业务 |

CollaborativeEditor 保留通用富文本接口，课栈笔记采用 MarkdownEditor。AIComposer 保持原接口，课栈受控输入采用 ChatComposer。ResizablePanel 保持两栏接口，多栏采用 WorkspaceLayout。

演示验证视图和本地交互，不提供课栈后台。核心节点沿用 schema 2，上线前使用真实历史文档和共享房间验证兼容性。
