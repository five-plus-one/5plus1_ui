# 核心组件视觉设计方案

**版本**: 2.0.0  
**设计日期**: 2026年10月19日  
**基于**: 五加一设计系统 2.0

---

## 设计原则回顾

在设计每个组件时，遵循以下原则：

1. **清晰的交互反馈** - 每个状态都有明确的视觉表达
2. **一致的视觉语言** - 相同类型的元素用相同的处理方式
3. **适当的视觉重量** - 主要操作醒目，次要操作退后
4. **可访问性优先** - 满足WCAG 2.2 AA标准
5. **品牌识别度** - 在细节中体现五加一的独特性

---

## 一、按钮 (Button)

### 1.1 设计目标

- 主要操作清晰可见，次要操作不抢眼
- 禁用和加载状态明确
- 视觉重量与重要性匹配
- 悬停和按下有明确反馈

### 1.2 变体设计

#### Primary - 主要按钮
```
视觉特征:
- 背景: --color-primary-600 (#2563EB)
- 文字: 白色 #FFFFFF
- 圆角: 8px
- 内边距: 12px 24px
- 高度: 44px
- 字号: 16px
- 字重: 500
- 阴影: --shadow-sm

状态变化:
- Hover: 背景变为 --color-primary-700 + --shadow-md
- Active: transform translateY(1px) + 移除阴影
- Focus: outline 2px solid --color-primary-600, offset 2px
- Disabled: opacity 0.5 + cursor not-allowed
- Loading: 内嵌spinner + 文字opacity 0.6
```

**为什么这样设计？**
- 蓝色背景+白色文字对比度高（12.7:1），远超WCAG要求
- 8px圆角对44px高度来说比例合适（18%），既现代又不过分圆润
- 悬停时阴影增强，给予"浮起"的反馈
- 按下时下移1px，模拟真实按钮的触感
- 500字重比400更有存在感，但不会太重

#### Secondary - 次要按钮
```
视觉特征:
- 背景: 白色 #FFFFFF
- 文字: --color-neutral-700
- 边框: 1px solid --color-neutral-300
- 圆角: 8px
- 其他尺寸同Primary

状态变化:
- Hover: 背景变为 --color-neutral-50 + 边框 --color-neutral-400
- Active: 背景变为 --color-neutral-100
- Focus: 同Primary
- Disabled: 同Primary
```

**为什么这样设计？**
- 白色背景+边框的设计让次要按钮明显"轻"于主要按钮
- 悬停时的浅灰背景给予反馈，但不抢眼
- 边框从300到400的变化是细微但可感知的

#### Ghost - 幽灵按钮
```
视觉特征:
- 背景: 透明
- 文字: --color-neutral-600
- 无边框
- 圆角: 8px
- 其他尺寸同Primary

状态变化:
- Hover: 背景 --color-neutral-100
- Active: 背景 --color-neutral-200
- Focus: 同Primary
```

**为什么这样设计？**
- 完全透明的背景让它可以融入任何背景色
- 只在悬停时显示背景，降低视觉噪音
- 适合工具栏、表格操作等密集场景

#### Danger - 危险按钮
```
视觉特征:
- 背景: --color-error-600 (#DC2626)
- 文字: 白色
- 其他同Primary

用途: 删除、移除、取消订阅等不可逆操作
```

### 1.3 尺寸变体

#### Small (sm)
```
高度: 36px
内边距: 8px 16px
字号: 14px
圆角: 6px

用途: 表格内操作、紧凑工具栏、次要功能
```

#### Medium (md) - 默认
```
高度: 44px
内边距: 12px 24px
字号: 16px
圆角: 8px

用途: 主要操作、表单提交、一般场景
```

#### Large (lg)
```
高度: 52px
内边距: 16px 32px
字号: 18px
圆角: 10px

用途: 页面主要CTA、英雄区按钮、登录注册
```

### 1.4 图标按钮

```
尺寸:
- sm: 32×32px, 图标16px
- md: 40×40px, 图标20px
- lg: 48×48px, 图标24px

设计要点:
- 正方形尺寸
- 图标居中
- 必须有aria-label
- 悬停时显示tooltip
```

### 1.5 按钮组

```
间距: 12px (--space-3)
对齐: 水平排列时左对齐主要按钮，右对齐次要按钮

布局示例:
[取消]              [保存更改]
 ↑ Ghost           ↑ Primary
```

### 1.6 CSS实现示例

```css
.btn {
  /* 布局 */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  /* 尺寸 */
  min-height: 44px;
  padding: 12px 24px;
  
  /* 外观 */
  border-radius: 8px;
  border: none;
  
  /* 文字 */
  font-family: var(--font-sans);
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  text-decoration: none;
  white-space: nowrap;
  
  /* 交互 */
  cursor: pointer;
  user-select: none;
  transition: 
    background-color 200ms cubic-bezier(0, 0, 0.2, 1),
    border-color 200ms cubic-bezier(0, 0, 0.2, 1),
    box-shadow 200ms cubic-bezier(0, 0, 0.2, 1),
    transform 150ms cubic-bezier(0, 0, 0.2, 1);
}

.btn-primary {
  background: var(--color-primary-600);
  color: white;
  box-shadow: var(--shadow-sm);
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-primary-700);
  box-shadow: var(--shadow-md);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(1px);
  box-shadow: none;
}

.btn-primary:focus-visible {
  outline: 2px solid var(--color-primary-600);
  outline-offset: 2px;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

---

## 二、输入框 (Input)

### 2.1 设计目标

- 清晰的边界，易于识别
- 明确的聚焦状态
- 错误和成功状态醒目
- 足够的点击区域和内边距

### 2.2 基础设计

```
视觉特征:
- 背景: 白色 #FFFFFF
- 边框: 1.5px solid --color-neutral-300
- 圆角: 8px
- 内边距: 12px 16px
- 高度: 44px
- 字号: 16px
- 字重: 400
- 颜色: --color-neutral-700
- 占位符: --color-neutral-400

为什么1.5px边框？
- 1px太细，在高分辨率屏幕上几乎看不见
- 2px太粗，显得笨重
- 1.5px是视觉上的平衡点
```

### 2.3 状态设计

#### Default - 默认
```
边框: 1.5px solid --color-neutral-300
背景: 白色
```

#### Hover - 悬停
```
边框: 1.5px solid --color-neutral-400
背景: 白色
```

#### Focus - 聚焦
```
边框: 2px solid --color-primary-600
背景: 白色
外发光: 0 0 0 3px rgba(37, 99, 235, 0.1)

为什么边框加粗到2px？
- 聚焦时需要更强的视觉反馈
- 配合外发光形成明确的"激活"信号
```

#### Error - 错误
```
边框: 2px solid --color-error-600
外发光: 0 0 0 3px rgba(220, 38, 38, 0.1)
```

#### Success - 成功
```
边框: 2px solid --color-success-600
外发光: 0 0 0 3px rgba(22, 163, 74, 0.1)
```

#### Disabled - 禁用
```
背景: --color-neutral-100
边框: 1.5px solid --color-neutral-300
文字: --color-neutral-400
cursor: not-allowed
```

### 2.4 带图标的输入框

```
图标位置: 左侧或右侧
图标尺寸: 20px
图标与边界距离: 12px
文字与图标距离: 12px

左图标输入框:
padding-left: 44px  (12px + 20px + 12px)

右图标输入框:
padding-right: 44px
```

### 2.5 输入框组

```
标签 (Label):
- 字号: 14px
- 字重: 500
- 颜色: --color-neutral-700
- 与输入框间距: 8px

辅助文字 (Hint):
- 字号: 14px
- 字重: 400
- 颜色: --color-neutral-500
- 与输入框间距: 8px

错误文字 (Error):
- 字号: 14px
- 字重: 400
- 颜色: --color-error-600
- 与输入框间距: 8px
```

### 2.6 多行输入 (Textarea)

```
最小高度: 120px
最大高度: 400px
可调整大小: vertical
其他样式同输入框
```

---

## 三、卡片 (Card)

### 3.1 设计目标

- 清晰地分组相关内容
- 适度的层级感，不过度强调
- 内容呼吸空间足够
- 交互式卡片有明确反馈

### 3.2 基础设计

```
视觉特征:
- 背景: 白色 #FFFFFF
- 边框: 1px solid --color-neutral-200
- 圆角: 12px
- 内边距: 24px
- 阴影: 无（默认）

为什么不用阴影？
- 边框已经提供了足够的分离感
- 过多阴影会让界面显得"漂浮"和不稳定
- 保留阴影用于真正需要层级的场景（弹出菜单、对话框）
```

### 3.3 变体设计

#### Default - 默认卡片
```
边框: 1px solid --color-neutral-200
阴影: 无
```

#### Elevated - 提升卡片
```
边框: 无
阴影: --shadow-md

用途: 需要强调的内容、悬浮效果
```

#### Interactive - 交互卡片
```
默认: 边框卡片
Hover: 边框 --color-neutral-300 + --shadow-sm
Active: transform translateY(1px)
cursor: pointer

用途: 可点击的卡片，如产品卡片、文章卡片
```

#### Outlined - 强边框卡片
```
边框: 2px solid --color-neutral-300
阴影: 无

用途: 需要更强分离感的内容
```

### 3.4 卡片内容组织

```
标题 (Title):
- 字号: 20px
- 字重: 600
- 颜色: --color-neutral-900
- 与内容间距: 12px

描述 (Description):
- 字号: 16px
- 字重: 400
- 颜色: --color-neutral-600
- 行高: 1.75

操作区 (Actions):
- 与内容间距: 20px
- 按钮间距: 12px
- 对齐: 右对齐或左对齐（根据重要性）
```

### 3.5 卡片间距

```
Grid布局:
- 间距: 24px
- 最小宽度: 280px

List布局:
- 间距: 16px
```

---

## 四、对话框 (Dialog)

### 4.1 设计目标

- 明确的焦点，引导用户注意
- 清晰的内容层级
- 主次操作分明
- 适当的尺寸，不过大也不过小

### 4.2 基础设计

```
视觉特征:
- 背景: 白色 #FFFFFF
- 圆角: 16px
- 最大宽度: 520px
- 最大高度: 85vh
- 阴影: --shadow-2xl
- 边框: 无

遮罩层:
- 背景: rgba(0, 0, 0, 0.5)
- 模糊: backdrop-blur(4px)
```

### 4.3 结构设计

#### 头部 (Header)
```
高度: 自适应
内边距: 24px
边框: 1px solid --color-neutral-200 (底部)

标题:
- 字号: 20px
- 字重: 600
- 颜色: --color-neutral-900

关闭按钮:
- 位置: 右上角
- 尺寸: 40×40px
- 图标: X, 20px
- 悬停: 背景 --color-neutral-100
```

#### 内容区 (Body)
```
内边距: 24px
字号: 16px
行高: 1.75
颜色: --color-neutral-700
最大高度: calc(85vh - 头部高度 - 底部高度)
滚动: auto
```

#### 底部 (Footer)
```
内边距: 20px 24px
边框: 1px solid --color-neutral-200 (顶部)
布局: flex, justify-content: space-between

按钮间距: 12px
主要按钮: 右对齐
次要按钮: 左对齐
```

### 4.4 动画

```
进入动画:
- 从: opacity 0, scale(0.95), translateY(10px)
- 到: opacity 1, scale(1), translateY(0)
- 时长: 200ms
- 缓动: ease-out

离开动画:
- 从: opacity 1, scale(1)
- 到: opacity 0, scale(0.95)
- 时长: 150ms
- 缓动: ease-in
```

### 4.5 尺寸变体

```
小对话框: max-width 400px - 简单确认
默认: max-width 520px - 表单、详情
大对话框: max-width 720px - 复杂内容
全屏: max-width 90vw - 图片预览
```

---

## 五、导航 (Navigation)

### 5.1 顶部导航栏

```
视觉特征:
- 高度: 64px
- 背景: 白色 #FFFFFF
- 边框: 1px solid --color-neutral-200 (底部)
- 内边距: 0 24px
- 阴影: --shadow-sm (滚动后)

Logo区:
- 高度: 32px
- 与左边距: 24px

导航链接:
- 字号: 16px
- 字重: 500
- 颜色: --color-neutral-600
- 悬停: --color-neutral-900
- 激活: --color-primary-600
- 间距: 32px

用户区:
- 位置: 右对齐
- 头像尺寸: 40px
```

### 5.2 侧边导航

```
视觉特征:
- 宽度: 256px (展开) / 64px (收起)
- 背景: --color-neutral-50
- 边框: 1px solid --color-neutral-200 (右侧)

导航项:
- 高度: 44px
- 内边距: 12px 16px
- 圆角: 8px
- 字号: 16px
- 字重: 400

状态:
- 默认: 透明背景, --color-neutral-600文字
- 悬停: --color-neutral-100背景
- 激活: --color-primary-50背景, --color-primary-700文字, 600字重
```

### 5.3 标签页 (Tabs)

```
视觉特征:
- 高度: 48px
- 边框: 1px solid --color-neutral-200 (底部)

标签项:
- 内边距: 14px 20px
- 字号: 16px
- 字重: 400
- 颜色: --color-neutral-600

状态:
- 悬停: --color-neutral-700
- 激活: --color-primary-600, 600字重
- 指示器: 2px高, --color-primary-600, 底部对齐

指示器动画:
- 属性: transform, width
- 时长: 250ms
- 缓动: cubic-bezier(0.4, 0, 0.2, 1)
```

---

## 六、表单控件

### 6.1 复选框 (Checkbox)

```
尺寸: 20×20px
边框: 2px solid --color-neutral-400
圆角: 4px
选中背景: --color-primary-600
选中图标: 白色勾号, 14px

状态:
- Hover: 边框 --color-primary-600
- Focus: 外发光 0 0 0 3px rgba(37, 99, 235, 0.2)
- Disabled: 背景 --color-neutral-100, 边框 --color-neutral-300
```

### 6.2 单选框 (Radio)

```
尺寸: 20×20px
边框: 2px solid --color-neutral-400
圆角: 50% (圆形)
选中内圆: 10×10px, --color-primary-600

其他状态同复选框
```

### 6.3 开关 (Switch)

```
轨道:
- 宽度: 44px
- 高度: 24px
- 圆角: 12px (圆角矩形)
- 关闭: --color-neutral-300背景
- 开启: --color-primary-600背景

滑块:
- 尺寸: 20×20px
- 颜色: 白色
- 圆形
- 阴影: --shadow-sm
- 位置: 关闭左侧, 开启右侧
- 动画: 200ms ease-out
```

### 6.4 下拉选择 (Select)

```
外观同输入框

下拉箭头:
- 位置: 右侧, 距离边界12px
- 图标: ChevronDown, 20px
- 颜色: --color-neutral-500

下拉菜单:
- 背景: 白色
- 边框: 1px solid --color-neutral-200
- 圆角: 8px
- 阴影: --shadow-lg
- 最大高度: 320px
- 滚动: auto

选项:
- 高度: 44px
- 内边距: 12px 16px
- 悬停: --color-neutral-100背景
- 选中: --color-primary-50背景, --color-primary-700文字
```

### 6.5 滑块 (Slider)

```
轨道:
- 高度: 4px
- 圆角: 2px
- 背景: --color-neutral-200
- 已填充: --color-primary-600

滑块:
- 尺寸: 20×20px
- 圆形
- 背景: 白色
- 边框: 2px solid --color-primary-600
- 阴影: --shadow-md
- 悬停: scale(1.1)
- 拖动: scale(1.15)
```

---

## 七、反馈组件

### 7.1 提示框 (Toast)

```
视觉特征:
- 最大宽度: 420px
- 内边距: 16px
- 圆角: 12px
- 背景: 白色
- 边框: 1px solid --color-neutral-200
- 阴影: --shadow-xl

图标:
- 尺寸: 20px
- 位置: 左侧
- 与文字间距: 12px
- 成功: --color-success-600
- 警告: --color-warning-600
- 错误: --color-error-600
- 信息: --color-info-600

文字:
- 字号: 16px
- 字重: 400
- 颜色: --color-neutral-700

关闭按钮:
- 尺寸: 32×32px
- 图标: X, 16px
- 位置: 右侧

动画:
- 进入: 从底部滑入 + 淡入, 300ms
- 停留: 4000ms
- 离开: 淡出, 200ms
```

### 7.2 警告框 (Alert)

```
视觉特征:
- 内边距: 16px
- 圆角: 8px
- 边框: 1px solid (根据类型)

变体:
Info:
- 背景: --color-info-50
- 边框: --color-info-200
- 图标: --color-info-600

Success:
- 背景: --color-success-50
- 边框: --color-success-200
- 图标: --color-success-600

Warning:
- 背景: --color-warning-50
- 边框: --color-warning-200
- 图标: --color-warning-600

Error:
- 背景: --color-error-50
- 边框: --color-error-200
- 图标: --color-error-600
```

### 7.3 进度条 (Progress)

```
轨道:
- 高度: 8px
- 圆角: 4px
- 背景: --color-neutral-200

填充:
- 高度: 100%
- 圆角: 4px
- 背景: --color-primary-600
- 动画: width 300ms ease-out

标签:
- 位置: 顶部, 与进度条间距8px
- 字号: 14px
- 颜色: --color-neutral-600

百分比:
- 位置: 右对齐
- 字号: 14px
- 字重: 500
```

---

## 八、徽标与标签

### 8.1 徽标 (Badge)

```
视觉特征:
- 内边距: 4px 8px
- 圆角: 4px
- 字号: 12px
- 字重: 500
- 行高: 1.4

变体:
Default:
- 背景: --color-neutral-100
- 文字: --color-neutral-600

Primary:
- 背景: --color-primary-100
- 文字: --color-primary-700

Success:
- 背景: --color-success-100
- 文字: --color-success-700

Warning:
- 背景: --color-warning-100
- 文字: --color-warning-700

Error:
- 背景: --color-error-100
- 文字: --color-error-700
```

### 8.2 标签 (Tag/Chip)

```
视觉特征:
- 高度: 32px
- 内边距: 8px 12px
- 圆角: 6px
- 字号: 14px
- 字重: 400
- 边框: 1px solid --color-neutral-300

可移除标签:
- 关闭按钮: 16×16px图标
- 悬停: 背景 --color-neutral-100

可选择标签:
- 默认: 白色背景
- 选中: --color-primary-50背景, --color-primary-700文字, --color-primary-300边框
```

---

## 九、空状态与加载

### 9.1 空状态 (Empty State)

```
布局:
- 居中对齐
- 最大宽度: 400px
- 垂直内边距: 48px

图标/插图:
- 尺寸: 80×80px
- 颜色: --color-neutral-400

标题:
- 字号: 20px
- 字重: 600
- 颜色: --color-neutral-900
- 与图标间距: 24px

描述:
- 字号: 16px
- 字重: 400
- 颜色: --color-neutral-600
- 行高: 1.75
- 与标题间距: 12px

操作按钮:
- 与描述间距: 24px
```

### 9.2 骨架屏 (Skeleton)

```
视觉特征:
- 背景: --color-neutral-200
- 圆角: 4px
- 动画: 脉冲, 1.5s ease-in-out infinite

尺寸:
- 文字: 高度16px, 宽度随机
- 标题: 高度24px
- 头像: 40×40px圆形
- 图片: 根据实际尺寸
```

### 9.3 加载指示器 (Spinner)

```
尺寸: 
- sm: 16px
- md: 24px
- lg: 32px

颜色: --color-primary-600
边框: 2px
动画: 旋转, 0.6s linear infinite
```

---

## 十、数据展示

### 10.1 表格 (Table)

```
视觉特征:
- 背景: 白色
- 边框: 1px solid --color-neutral-200

表头:
- 背景: --color-neutral-50
- 高度: 48px
- 内边距: 12px 16px
- 字号: 14px
- 字重: 600
- 颜色: --color-neutral-700

表格行:
- 高度: 56px
- 内边距: 16px
- 字号: 16px
- 颜色: --color-neutral-700
- 边框: 1px solid --color-neutral-200 (底部)
- 悬停: 背景 --color-neutral-50

斑马纹:
- 偶数行: 背景 --color-neutral-50/50
```

### 10.2 列表 (List)

```
列表项:
- 高度: 自适应, 最小64px
- 内边距: 16px
- 边框: 1px solid --color-neutral-200 (底部)

交互列表:
- 悬停: 背景 --color-neutral-50
- cursor: pointer
```

---

## 实施建议

### 优先级

**第一批** (核心组件):
1. Button
2. Input
3. Card
4. Dialog

**第二批** (表单):
5. Checkbox
6. Radio
7. Switch
8. Select

**第三批** (导航和反馈):
9. Navigation
10. Toast
11. Alert
12. Progress

**第四批** (数据和状态):
13. Table
14. Badge/Tag
15. Empty State
16. Skeleton

### 下一步

1. 基于此设计方案创建 Figma 设计文件
2. 实现 CSS Token 系统
3. 逐个组件编码实现
4. 建立 Storybook 文档
5. 进行可访问性测试

---

**文档版本**: 2.0.0  
**设计完成**: 2026年10月19日  
**设计师**: Claude (Kiro AI)  
**状态**: 待实施
