# 五加一 UI UX 设计体系

面向五加一产品的共同视觉语言、交互模式与组件规范。

设计站：[ui.five-plus-one.com](https://ui.five-plus-one.com)。

组件目录包含 124 项基础及业务组件，以及课栈、阅卷、账号与个人主页示例。设计网站提供交互演示、属性说明和可复制代码；组件包支持 React 19 与 TypeScript。

- [UI UX 设计调研](docs/research/ui-ux-research-2026-10-19.md)

品牌色统一为 **#FD8B07**。产品使用独立主题：课栈蓝、批改助手绿、OnePass 紫；支持深浅主题。根元素使用 `data-product="brand | kezhan | marker | onepass"`，品牌色不随产品主题变化。

## 使用

```sh
npm install
npm run dev
```

访问 http://127.0.0.1:5178/ 。`npm run build` 构建设计网站和带类型声明的组件包；`npm test` 执行回归测试。

在本项目执行 `npm run build` 和 `npm pack`，然后在其他项目安装生成的 `fiveplusone-ui-0.3.1.tgz`：

```tsx
import { Button, Card } from '@fiveplusone/ui';
import '@fiveplusone/ui/styles.css';

export function Welcome() {
  return <Card><h2>开始新的想法</h2><Button onClick={() => location.assign('/notes/new')}>新建笔记</Button></Card>;
}
```

当前为本地集成版本，尚未发布至公共包仓库。

## 工作区能力

- WorkspaceLayout：多栏拖动、折叠、宽度保存、嵌套分屏和命令式控制。
- ChatComposer / MessageList：受控草稿、附件、引用、中文输入、虚拟列表和流式粘底。
- MarkdownEditor：课栈 Markdown 节点、工具栏、公式与矩阵、表格、代码、卡片和 Yjs 协作。
- MemberSearch / ShareLink / AttachmentPicker / UploadQueue：成员搜索、链接权限、资料选择与上传进度。
- MemberAccess：成员角色、邀请、提交反馈与只读展示。
- VideoPlayer：授权播放源、控制器引用、播放位置和字幕接入。
- ResourcePreview：PDF、Word、PowerPoint、表格、图片、音视频与文本预览入口。
- PdfPreview：课栈分页预览、延迟加载、转换等待、缩放、跳页及重试。
- HorizontalScrollbar：拖动和键盘操作的横向滚动条。
- FileTree：层级展开、键盘导航、选择、新建、重命名和移除回调。
- CollaborativeEditor：Tiptap 编辑、Yjs 共享文档和 Hocuspocus 连接适配。

Office 转换依赖接入项目的预览服务；跨设备协作依赖鉴权、持久化及 WebSocket 服务。网站中的 Office 页面为预制设计样例，双编辑器演示使用真实共享文档，演示不承担生产存储。

- [设计规范](docs/design/design-system.md)
- [接入与课栈适配](docs/design/integration.md)
- [课栈迁移接口与验收](docs/kezhan-migration-guide.md)
- [组件设计与接入审计](docs/component-design-audit-2026-10-20.md)
- [设计站部署](docs/deployment.md)

`src/lib` 为组件包，`src/catalog.tsx` 与 `src/workspace-gallery.tsx` 为目录，`src/main.tsx` 为设计网站，`tests` 为回归测试。
