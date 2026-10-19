# KeZhan-notebook 重构实施指南

## 阶段一：准备工作（已完成 ✅）

### 1. P0 组件实现
- [x] FileTree（文件树导航，支持命名空间和 prefetch）
- [x] ChatComposer（AI 输入框，支持附件和引用）
- [x] MessageList + MessageBubble（虚拟滚动对话流）
- [x] CollapseTransition（动画折叠容器）
- [x] ResizablePanel（三栏布局，已存在）

### 2. 组件映射文档
- [x] 创建完整的组件映射表
- [x] 变量映射表（MD3 → fp-*）
- [x] 迁移步骤说明

## 阶段二：变量替换（进行中）

### 自动化脚本
运行 `scripts/migrate-kezhan.sh` 自动替换所有 CSS 变量：
- MD3 颜色变量 → fp-* 语义变量
- 自定义变量（--bg-*, --ink-*, --line）→ fp-* 变量

### 手动检查项
脚本完成后，手动检查以下文件：
1. `app/globals.css` - 全局变量定义
2. `lib/theme/` - 主题配置
3. `components/ui/` - UI 组件样式

## 阶段三：组件替换

### 3.1 安装依赖
```bash
cd D:/5plus1/DEV/KeZhan/KeZhan-notebook/KeZhan-notebook/.work/server-7-clean
npm install ../../5plus1-ui/fiveplusone-ui-0.1.0.tgz
npm install @tanstack/react-virtual  # MessageList 依赖
```

### 3.2 导入样式
在 `app/layout.tsx` 中添加：
```tsx
import '@fiveplusone/ui/styles.css';
```

### 3.3 替换核心组件

#### AppShell（布局容器）
```tsx
// 旧
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";

// 新
import { ResizablePanel } from "@fiveplusone/ui";

// 使用
<ResizablePanel
  defaultSizes={[20, 60, 20]}
  minSizes={[200, 400, 200]}
>
  <div>{/* 左侧栏 */}</div>
  <div>{/* 主内容 */}</div>
  <div>{/* 右侧栏 */}</div>
</ResizablePanel>
```

#### FileTree（文件导航）
```tsx
// 旧
import FileTree from "@/components/layout/FileTree";
import FileTreeItem from "@/components/layout/FileTreeItem";

// 新
import { FileTree } from "@fiveplusone/ui";

// 使用
<FileTree
  items={treeData}
  selectedId={selectedKey}
  expandedIds={expandedIds}
  onSelect={(id, item) => handleSelect(id, item)}
  onToggle={(id) => toggleExpand(id)}
  onPrefetch={(id) => prefetchRoute(id)}
  prefetchDelay={120}
/>
```

#### ChatPanel（AI 对话）
```tsx
// 旧
import ChatPanel from "@/components/chat/ChatPanel";
import ChatInput from "@/components/chat/ChatInput";
import ChatThread from "@/components/chat/ChatThread";

// 新
import { ChatComposer, MessageList, MessageBubble } from "@fiveplusone/ui";

// 使用
<div className="chat-container">
  <MessageList
    messages={messages}
    isLoading={isLoading}
    error={error}
    onClearError={() => clearError()}
    bottomInset={composerHeight}
    renderMessage={(msg) => <MessageBubble message={msg} />}
  />
  <ChatComposer
    onSend={(content, options) => sendMessage(content, options)}
    disabled={isLoading}
    quotedText={quotedText}
    onClearQuote={() => setQuotedText(undefined)}
    attachments={attachments}
    onAddAttachment={(file) => handleAttachment(file)}
    onRemoveAttachment={(id) => removeAttachment(id)}
  />
</div>
```

#### AnimatedCollapse
```tsx
// 旧
import AnimatedCollapse from "@/components/ui/AnimatedCollapse";

// 新
import { CollapseTransition } from "@fiveplusone/ui";

// 使用（API 相同）
<CollapseTransition isOpen={isExpanded}>
  {children}
</CollapseTransition>
```

### 3.4 替换基础组件

批量替换导入：
```tsx
// 旧
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Dialog from "@/components/ui/Dialog";

// 新
import { Button, Input, Dialog } from "@fiveplusone/ui";
```

大部分组件 API 保持一致，直接替换即可。

## 阶段四：样式调整

### 4.1 自定义主题
创建 `lib/theme/fp-theme.css`：
```css
:root {
  /* 如果需要覆盖默认颜色 */
  --fp-primary: #your-brand-color;
  
  /* 如果需要自定义字体 */
  --fp-font-body: 'Your Font', system-ui, sans-serif;
  
  /* 保持其他 fp-* 变量不变 */
}
```

### 4.2 组件样式覆盖
KeZhan 特定样式可通过 CSS 覆盖：
```css
/* components/layout/custom.css */
.fp-file-tree-item {
  /* KeZhan 定制：更紧凑的行高 */
  min-height: 28px;
}

.fp-message-bubble {
  /* KeZhan 定制：更大的圆角 */
  border-radius: var(--fp-radius-lg);
}
```

## 阶段五：测试验证

### 5.1 功能测试
- [ ] 文件树导航正常
- [ ] 展开/折叠动画流畅
- [ ] AI 对话发送接收正常
- [ ] 附件上传正常
- [ ] 引用功能正常
- [ ] 布局拖拽调整正常
- [ ] 路由 prefetch 正常

### 5.2 主题测试
- [ ] 深色模式切换正常
- [ ] 浅色模式对比度符合规范
- [ ] 自定义主题色应用正常

### 5.3 可访问性测试
- [ ] 键盘导航完整
- [ ] Tab 顺序合理
- [ ] 焦点指示清晰
- [ ] 屏幕阅读器友好

### 5.4 性能测试
- [ ] 长对话列表虚拟滚动正常
- [ ] 大文件树渲染流畅
- [ ] 布局调整无卡顿
- [ ] 首屏加载时间无退化

### 5.5 响应式测试
- [ ] 移动端布局正常
- [ ] 平板布局正常
- [ ] 桌面布局正常

## 阶段六：清理优化

### 6.1 移除旧代码
```bash
# 删除旧组件文件
rm -rf components/ui/Button.tsx
rm -rf components/layout/FileTree.tsx
rm -rf components/layout/FileTreeItem.tsx
rm -rf components/chat/ChatInput.tsx
rm -rf components/chat/ChatThread.tsx
# ... 其他已替换的组件
```

### 6.2 移除旧依赖
检查 `package.json`，移除不再需要的依赖：
- 旧 UI 库依赖
- 重复的工具库

### 6.3 代码审查
- [ ] 无未使用的导入
- [ ] 无硬编码颜色值
- [ ] 变量命名一致
- [ ] 注释完整

## 回滚方案

如果重构遇到问题需要回滚：
```bash
git checkout main
git branch -D feat/5plus1-ui-migration
```

## 预计时间线

- 变量替换：0.5 天（自动化脚本）
- 组件替换：2-3 天
- 样式调整：1 天
- 测试验证：1-2 天
- 清理优化：0.5 天

**总计：5-7 个工作日**

## 当前进度

- [x] 阶段一：准备工作（P0 组件实现）✅
- [x] 阶段二：变量替换（脚本准备完成）✅
- [ ] 阶段三：组件替换（待执行）
- [ ] 阶段四：样式调整（待执行）
- [ ] 阶段五：测试验证（待执行）
- [ ] 阶段六：清理优化（待执行）
