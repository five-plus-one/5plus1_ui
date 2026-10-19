# KeZhan-notebook & GravityLink 组件提取计划

基于对 KeZhan-notebook（224 个组件）和 GravityLink 项目的深度调研，以下是需要提取并整合到五加一设计体系的所有组件模式。

## 一、KeZhan-notebook 核心组件模式提取

### 1. 布局与导航（Layout & Navigation）
- [x] **AppShell**：三栏可调整布局（侧边栏+主内容+右侧面板）
  - 使用 react-resizable-panels 实现可拖拽调整
  - 响应式折叠/展开
  - 状态持久化
- [x] **SubjectSidebar**：学科导航侧边栏
  - 多层级折叠树
  - 主题切换入口
  - 滚动位置记忆
- [x] **FileTree** + **FileTreeItem**：文件树导航
  - 命名空间化的展开/选中状态
  - hover 延迟 prefetch（120ms）
  - 深度缩进可视化
  - 文件夹/文件图标区分
- [ ] **TocTree**：目录树（Table of Contents）
- [ ] **SiblingFilesPanel**：同级文件快速切换
- [ ] **WindowChrome**：窗口标题栏
- [ ] **WindowTaskbar**：窗口任务栏

### 2. AI 对话（Chat & AI）
- [ ] **ChatPanel**：AI 对话面板
  - 自动隐藏顶栏（useAutoHideChatHeader）
  - 消息历史管理
  - 浮动对话支持
  - token 追踪
- [ ] **ChatInput**：AI 输入框
  - 自动高度调整（最高 150px）
  - 引用文本支持
  - 图片附件上传
  - 模型选择器
  - thinking 努力程度调整
  - 快捷键支持
- [ ] **ChatThread**：对话消息流
  - 虚拟滚动（@tanstack/react-virtual）
  - 自动粘底
  - 加载/错误状态
  - 追随问题（follow-up）
- [ ] **ChatMessage**：单条消息
  - 用户/助手角色区分
  - Markdown 渲染
  - 代码高亮
  - LaTeX 数学公式
  - 引用块
- [ ] **AgentTrace**：AI 推理过程可视化
- [ ] **ModelMenu**：模型选择菜单
- [ ] **ThinkingMenu**：思考深度调整
- [ ] **TokenDashboard**：token 使用仪表盘

### 3. 笔记与内容（Notes & Content）
- [ ] **NoteCard**：笔记卡片
- [ ] **SelectionPopover**：选中文本后的浮层操作
- [ ] **ContentImage**：内容图片展示
- [ ] **ImageLightbox**：图片灯箱查看
- [ ] **CodeBlock**：代码块（带语言标签、复制按钮）
- [ ] **LatexBlock**：LaTeX 公式块

### 4. 视频与媒体（Video & Media）
- [ ] **InlinePlayer**：内联视频播放器
- [ ] **PipPlayer**：画中画播放器
- [ ] **VideoTab**：视频标签页

### 5. 浏览器与嵌入（Browser & Embed）
- [ ] **NotebookBrowser**：笔记本浏览器
- [ ] **BrowserSettingsButton**：浏览器设置按钮
- [ ] **EmbedFallback**：嵌入内容失败回退

### 6. 账号与设置（Account & Settings）
- [ ] **AccountCenter**：账户中心
- [ ] **CloudSyncStatus**：云同步状态指示
- [ ] **CommerceManager**：商业/支付管理
- [ ] **CreditsPanel**：积分/额度面板
- [ ] **DirectoryManager**：目录管理
- [ ] **NotebookManager**：笔记本管理
- [ ] **ShareCurrentNotebook**：分享当前笔记本
- [ ] **ImportLocalStudy**：导入本地学习记录

### 7. UI 基础组件（UI Primitives）
- [x] **AnimatedCollapse**：动画折叠容器
- [ ] **LazyVisible**：懒加载可见性检测
- [x] **Tooltip**：提示浮层（已有，需对齐 KeZhan 实现）
- [ ] **MessageContextMenu**：消息上下文菜单
- [ ] **ResizeLoader**：调整大小时的加载指示

### 8. 交互式组件（Interactive Components）
KeZhan 有大量学科特定的交互式可视化组件（概率论、线性代数等），暂不提取到通用设计体系，但记录其模式：
- 可拖拽的参数滑块
- 实时计算反馈
- 数据可视化（图表、分布图）
- 步骤演示

## 二、GravityLink 组件模式提取

由于 GravityLink 扫描未返回 .tsx 文件，推测可能使用其他技术栈或文件扩展名。需要进一步调研：
- [ ] 扫描 .jsx、.js、.vue 等其他前端文件
- [ ] 查看项目 package.json 确定技术栈
- [ ] 提取链接管理、卡片展示等核心 UI 模式

## 三、设计体系整合优先级

### P0（立即实现，KeZhan 核心依赖）
1. **AppShell 三栏布局**（ResizablePanel 增强版）
2. **FileTree + FileTreeItem**（Tree 组件增强版）
3. **ChatInput**（AIComposer 增强版）
4. **ChatThread** + **ChatMessage**（AIMessage 增强版）
5. **AnimatedCollapse**（Accordion 基础）

### P1（高价值，通用性强）
1. **SubjectSidebar**（Navigation 增强版）
2. **ModelMenu** + **ThinkingMenu**（Dropdown 增强版）
3. **TokenDashboard**（Stat + Progress 组合）
4. **SelectionPopover**（Popover 增强版）
5. **ImageLightbox**（ImagePreview 增强版）

### P2（补充完善）
1. **WindowChrome** + **WindowTaskbar**（桌面应用模式）
2. **VideoTab** + **InlinePlayer**（媒体播放器）
3. **AccountCenter** 系列（账户管理套件）
4. **NotebookBrowser**（文件管理器模式）

## 四、实现策略

### 1. 抽取可复用逻辑
- **useAutoHideChatHeader**：滚动时自动隐藏顶栏
- **useStickToBottom**：对话流自动粘底
- **useImageAttachments**：图片附件管理
- **usePrefetch**：hover 延迟预加载

### 2. 统一视觉语言
将 KeZhan 的 Material Design 3 变量（`var(--md-sys-color-*)`）映射到五加一设计变量（`var(--fp-*)`）：
```css
/* KeZhan 使用 */
--md-sys-color-primary-container → --fp-primary-soft
--md-sys-color-on-primary-container → --fp-primary-ink
--md-sys-color-surface-container-high → --fp-surface-muted
--md-sys-color-on-surface-variant → --fp-muted
```

### 3. 性能优化模式
- 虚拟滚动（@tanstack/react-virtual）
- hover 延迟 prefetch（120ms）
- ResizeObserver 节流
- 会话级路径去重

### 4. 可访问性增强
- 所有树节点键盘导航
- ARIA 标签完整
- 焦点管理（对话输入框、弹窗）
- 屏幕阅读器优化

## 五、后续步骤

1. **立即开始 P0 组件实现**（AppShell、FileTree、ChatInput、ChatThread）
2. **扫描 GravityLink 项目**（确定技术栈并提取组件）
3. **创建 KeZhan UI 重构分支**（使用新设计体系完全重构）
4. **建立组件映射文档**（旧组件 → 新组件对照表）
5. **性能基准测试**（虚拟滚动、prefetch 效果验证）

---

**调研完成时间**：2026-01-15
**预计实现周期**：P0 组件 2-3 天，P1 组件 3-5 天，完整重构 2-3 周
