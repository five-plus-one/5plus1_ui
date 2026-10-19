# KeZhan-notebook 组件映射表

将 KeZhan 现有组件映射到 5plus1-ui 设计体系组件

## 布局与导航

| KeZhan 组件 | 5plus1-ui 组件 | 状态 | 迁移说明 |
|------------|---------------|------|---------|
| AppShell (PanelGroup) | ResizablePanel | ✅ 可用 | 直接替换，保持三栏布局 |
| SubjectSidebar | Navigation + FileTree | ✅ 可用 | 组合使用，侧边栏容器用 Navigation |
| FileTree + FileTreeItem | FileTree | ✅ 已实现 | 完全对应，支持命名空间和 prefetch |
| TocTree | FileTree | ✅ 可用 | 复用 FileTree，传入目录数据 |
| AnimatedCollapse | CollapseTransition | ✅ 已实现 | 完全对应 |

## AI 对话

| KeZhan 组件 | 5plus1-ui 组件 | 状态 | 迁移说明 |
|------------|---------------|------|---------|
| ChatPanel | Container + MessageList + ChatComposer | ✅ 可用 | 组合使用 |
| ChatInput | ChatComposer | ✅ 已实现 | 完全对应，支持附件和引用 |
| ChatThread | MessageList | ✅ 已实现 | 完全对应，支持虚拟滚动和粘底 |
| ChatMessage | MessageBubble | ✅ 已实现 | 完全对应 |
| ModelMenu | Dropdown | ✅ 可用 | 直接替换 |
| ThinkingMenu | Dropdown | ✅ 可用 | 直接替换 |
| TokenDashboard | Stat + Progress | ✅ 可用 | 组合使用 |

## 基础 UI

| KeZhan 组件 | 5plus1-ui 组件 | 状态 | 迁移说明 |
|------------|---------------|------|---------|
| Button | Button | ✅ 可用 | 直接替换 |
| IconButton | IconButton | ✅ 可用 | 直接替换 |
| Input | Input | ✅ 可用 | 直接替换 |
| Textarea | Textarea | ✅ 可用 | 直接替换 |
| Select | Select | ✅ 可用 | 直接替换 |
| Checkbox | Checkbox | ✅ 可用 | 直接替换 |
| Switch | Switch | ✅ 可用 | 直接替换 |
| Tooltip | Tooltip | ✅ 可用 | 直接替换 |
| Dialog | Dialog | ✅ 可用 | 直接替换 |
| Drawer | Drawer | ✅ 可用 | 直接替换 |
| Toast/Snackbar | Toast | ✅ 可用 | 直接替换 |
| Tabs | Tabs | ✅ 可用 | 直接替换 |
| Badge | Badge | ✅ 可用 | 直接替换 |
| Avatar | Avatar | ✅ 可用 | 直接替换 |
| Card | Card | ✅ 可用 | 直接替换 |
| Divider | Divider | ✅ 可用 | 直接替换 |

## 内容展示

| KeZhan 组件 | 5plus1-ui 组件 | 状态 | 迁移说明 |
|------------|---------------|------|---------|
| CodeBlock | CodeBlock | ✅ 可用 | 直接替换 |
| ImageLightbox | ImagePreview | ✅ 可用 | 直接替换 |
| VideoPlayer | 待实现 | ⏳ P1 | 需要新实现 |
| LazyVisible | 待实现 | ⏳ P1 | 可用 Intersection Observer |

## 变量映射

### 颜色语义

```css
/* KeZhan MD3 → 5plus1 */
var(--md-sys-color-primary) → var(--fp-primary)
var(--md-sys-color-on-primary) → var(--fp-on-primary)
var(--md-sys-color-primary-container) → var(--fp-primary-soft)
var(--md-sys-color-on-primary-container) → var(--fp-primary-ink)
var(--md-sys-color-surface) → var(--fp-surface)
var(--md-sys-color-surface-variant) → var(--fp-surface-muted)
var(--md-sys-color-surface-container-high) → var(--fp-surface-muted)
var(--md-sys-color-on-surface) → var(--fp-ink)
var(--md-sys-color-on-surface-variant) → var(--fp-muted)
var(--md-sys-color-outline) → var(--fp-line)
var(--md-sys-color-outline-variant) → var(--fp-line-strong)
var(--md-sys-color-error) → var(--fp-error)
var(--md-sys-color-error-container) → var(--fp-error-soft)
```

### 其他变量

```css
/* 间距、圆角、阴影 */
--md-sys-spacing-* → --fp-space-*
--md-sys-shape-corner-* → --fp-radius-*
--md-sys-elevation-* → --fp-shadow / --fp-shadow-lg
```

## 迁移步骤

### 1. 全局变量替换
```bash
# 在 KeZhan-notebook 项目中执行
find . -name "*.css" -o -name "*.tsx" | xargs sed -i 's/var(--md-sys-color-primary-container)/var(--fp-primary-soft)/g'
find . -name "*.css" -o -name "*.tsx" | xargs sed -i 's/var(--md-sys-color-on-primary-container)/var(--fp-primary-ink)/g'
# ... 其他变量
```

### 2. 组件导入替换
```tsx
// 旧
import { Button } from '@/components/ui/Button';
import FileTree from '@/components/layout/FileTree';
import ChatInput from '@/components/chat/ChatInput';

// 新
import { Button, FileTree, ChatComposer as ChatInput } from '@fiveplusone/ui';
import '@fiveplusone/ui/styles.css';
```

### 3. Props 适配
大部分组件 props 保持一致，少数需要适配：
- `ChatInput` → `ChatComposer`：`onSend` 回调参数结构略有不同
- `FileTree`：增加 `onPrefetch` 可选回调

### 4. 样式覆盖
KeZhan 特定样式可通过 CSS 变量覆盖：
```css
:root {
  --fp-primary: #your-custom-color;
  --fp-font-body: 'Your Custom Font', sans-serif;
}
```

## 验证清单

- [ ] 深浅色主题切换正常
- [ ] 所有交互元素键盘可访问
- [ ] 虚拟滚动性能正常（对话列表、文件树）
- [ ] 响应式布局在移动端正常
- [ ] 所有动画流畅无卡顿
- [ ] 与后端 API 集成正常
- [ ] IndexedDB 持久化正常
- [ ] 页面加载性能无退化
