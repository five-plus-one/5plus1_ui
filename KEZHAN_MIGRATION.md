# 课栈笔记 UI 重构计划

## 目标
将 KeZhan-notebook 从当前实现（Material Design 3 变量 + 自定义组件）完全迁移到 5plus1-ui 设计体系。

## 进度追踪

### 第一阶段：P0 组件实现（5/5）✅ 完成
- [x] ResizablePanel（三栏布局基础）✅ 已存在
- [x] TreeView + TreeItem（文件树导航）✅ 已实现 FileTree
- [x] ChatComposer（AI 输入增强版）✅ 已实现
- [x] MessageList + MessageBubble（对话流）✅ 已实现
- [x] CollapseTransition（动画折叠）✅ 已实现

### 第二阶段：P1 组件实现（0/8）
- [ ] NavigationRail（侧边栏导航）
- [ ] ModelSelector（模型选择器）
- [ ] TokenMeter（token 仪表盘）
- [ ] TextSelectionToolbar（选中工具栏）
- [ ] MediaLightbox（媒体灯箱）
- [ ] VideoPlayer（视频播放器）
- [ ] WindowTitleBar（窗口标题栏）
- [ ] AccountPanel（账户面板）

### 第三阶段：KeZhan 重构（3/10）
- [x] 创建组件映射文档 ✅ 完成
- [x] 创建迁移实施指南 ✅ 完成
- [x] 创建自动化迁移脚本 ✅ 完成
- [ ] 创建迁移分支 `feat/5plus1-ui-migration`
- [ ] 安装 5plus1-ui 依赖
- [ ] 替换 AppShell 布局
- [ ] 替换 SubjectSidebar 导航
- [ ] 替换 FileTree 文件树
- [ ] 替换 ChatPanel 对话系统
- [ ] 替换所有 MD3 变量为 fp-* 变量

## 当前状态（2026-01-15 最终更新）

### ✅ 已完成
1. **组件提取**: 扫描 KeZhan 186 个组件文件
2. **组件生成**: 批量生成 60 个核心组件
3. **导出集成**: 添加到 index.tsx 和 catalog.tsx
4. **演示站点**: 组件总数从 78 增加到 138+

### 📊 最终统计
- **原有组件**: 78 个
- **新增组件**: 60 个（KeZhan 核心）
- **总计**: 138+ 个组件
- **剩余待实现**: 126 个（非核心组件）

### 🎯 下一步
- 验证演示站点显示正确
- 完善组件样式和交互
- 实施 KeZhan 实际重构
