# 工作区组件交付记录

版本：0.3.2，日期：2026-10-20。

已提供 WorkspaceLayout、受控 FileTree、MessageList、ChatComposer、MarkdownEditor、VideoPlayer 接口扩展和 MemberAccess；模型菜单与共用浮层统一交互、密度和主题。

Markdown 编辑器采用课栈 schema 2，包含工具栏、数学输入、矩阵、表格、代码语言、附件节点和指令卡片。共享 Y.Doc 的双编辑器同步已通过回归测试。

验证：42 项自动测试通过；设计站、组件包与类型声明构建成功；私有安装包可导入组件并通过消费者 TypeScript 检查。浏览器验证模型菜单深浅主题、Escape 关闭、公式面板、矩阵工具和快捷插入。

课栈应用尚待分批接入。后台权限、保存冲突、历史恢复、Office 转换、课堂联动和专用内容渲染由课栈提供，具体契约见 kezhan-migration-guide.md。126 项目录的渲染检查不等于全部业务交互的生产验收。

规范以 src/lib/tokens.css、themes.ts、docs/design/design-system.md 为当前依据；历史提案供追溯参考。
