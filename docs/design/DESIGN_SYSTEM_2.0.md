# 五加一设计系统 2.0

**版本**: 2.0.0  
**发布日期**: 2026年10月19日  
**设计理念**: 温暖专业，简洁有力，记忆深刻

---

## 设计哲学

五加一的产品服务于学习、创造和协作。设计系统应该传达：

- **温暖而非冰冷** - 用色彩和细节营造可亲近的氛围
- **清晰而非复杂** - 信息层级明确，操作路径简单
- **专业而非随意** - 每个决定都有依据，细节经得起推敲
- **独特而非平庸** - 建立视觉记忆点，区别于通用组件库

**核心原则**:
1. **内容优先** - 设计服务内容，不喧宾夺主
2. **层级清晰** - 用尺寸、颜色、间距建立明确的信息层级
3. **一致性** - 相同的操作用相同的视觉语言
4. **可预测性** - 用户能预判交互结果
5. **品牌识别** - 橙色是记忆锚点，但不是唯一色彩

---

## 一、色彩系统

### 1.1 设计原则

**色彩角色分离**:
- **品牌色** - 橙色 #FF8C00，用于识别，不用于交互
- **主色调** - 深青蓝 #2563EB，用于主要操作
- **语义色** - 成功/警告/错误，传达状态
- **中性色** - 灰度体系，构建界面结构

**对比度要求**:
- 所有文字必须达到 WCAG AA 标准（4.5:1）
- 大字号（18px+粗体或24px+）可放宽至 3:1
- 交互元素（按钮、链接）建议达到 7:1

### 1.2 核心色板

#### 品牌橙 (Brand Orange)
```
用途: 品牌标识、Logo、重点强调（少量使用）
禁止: 不要用于按钮、链接、表单控件的默认状态

Light:
  --brand-50:  #FFF7ED
  --brand-100: #FFEDD5
  --brand-200: #FED7AA
  --brand-300: #FDBA74
  --brand-400: #FB923C
  --brand-500: #FF8C00  ← 品牌主色
  --brand-600: #EA580C
  --brand-700: #C2410C
  --brand-800: #9A3412
  --brand-900: #7C2D12

Dark:
  --brand-dark-primary: #FB923C
  --brand-dark-on: #1A1816
```

#### 主色调 - 深青蓝 (Primary Blue)
```
用途: 主要按钮、链接、选中状态、进度指示

Light:
  --primary-50:  #EFF6FF
  --primary-100: #DBEAFE
  --primary-200: #BFDBFE
  --primary-300: #93C5FD
  --primary-400: #60A5FA
  --primary-500: #3B82F6
  --primary-600: #2563EB  ← 主色调
  --primary-700: #1D4ED8
  --primary-800: #1E40AF
  --primary-900: #1E3A8A

Dark:
  --primary-dark: #60A5FA
  --primary-dark-on: #1E3A8A
```

**为什么选择蓝色而非橙色作为主色调？**
- 蓝色传达专业、信任、稳定 - 适合学习和工作场景
- 橙色过于活跃，大面积使用容易造成视觉疲劳
- 蓝色+橙色的搭配形成冷暖对比，更有记忆点
- 参考课栈现有蓝色主题（#1A73E8）的用户反馈

#### 中性灰 (Neutral)
```
用途: 背景、文字、边框、阴影

Light:
  --neutral-50:  #FAFAF9    ← 页面背景（暖白）
  --neutral-100: #F5F5F4    ← 次级背景
  --neutral-200: #E7E5E4    ← 边框/分隔线
  --neutral-300: #D6D3D1    ← 禁用边框
  --neutral-400: #A8A29E    ← 占位文字
  --neutral-500: #78716C    ← 辅助文字
  --neutral-600: #57534E    ← 次要文字
  --neutral-700: #44403C    ← 正文
  --neutral-800: #292524    ← 标题
  --neutral-900: #1C1917    ← 强调标题

Dark:
  --neutral-dark-50:  #18181B
  --neutral-dark-100: #27272A
  --neutral-dark-200: #3F3F46
  --neutral-dark-300: #52525B
  --neutral-dark-400: #71717A
  --neutral-dark-500: #A1A1AA
  --neutral-dark-600: #D4D4D8
  --neutral-dark-700: #E4E4E7
  --neutral-dark-800: #F4F4F5
  --neutral-dark-900: #FAFAFA
```

**灰度设计说明**:
- 使用暖灰（Stone）而非冷灰，呼应温暖的品牌气质
- 50-100 用于背景层级
- 200-400 用于边框和禁用状态
- 500-700 用于文字
- 800-900 用于强调

#### 语义色

**成功绿 (Success)**
```
Light:
  --success-50:  #F0FDF4
  --success-500: #22C55E
  --success-600: #16A34A  ← 主要使用
  --success-700: #15803D

Dark:
  --success-dark: #4ADE80
```

**警告黄 (Warning)**
```
Light:
  --warning-50:  #FFFBEB
  --warning-500: #F59E0B
  --warning-600: #D97706  ← 主要使用
  --warning-700: #B45309

Dark:
  --warning-dark: #FCD34D
```

**错误红 (Error)**
```
Light:
  --error-50:  #FEF2F2
  --error-500: #EF4444
  --error-600: #DC2626  ← 主要使用
  --error-700: #B91C1C

Dark:
  --error-dark: #F87171
```

**信息蓝 (Info)**
```
Light:
  --info-50:  #F0F9FF
  --info-500: #0EA5E9
  --info-600: #0284C7  ← 主要使用

Dark:
  --info-dark: #38BDF8
```

### 1.3 产品主题色

#### 课栈蓝 (Kezhan)
```
--kezhan-primary: #1D4ED8
--kezhan-light: #DBEAFE
--kezhan-dark: #60A5FA
```

#### 批改助手绿 (Marker)
```
--marker-primary: #16A34A
--marker-light: #DCFCE7
--marker-dark: #4ADE80
```

#### OnePass紫 (OnePass)
```
--onepass-primary: #7C3AED
--onepass-light: #EDE9FE
--onepass-dark: #A78BFA
```

### 1.4 使用规范

#### 文字颜色
```
标题/强调:   --neutral-900 (深色) / --neutral-dark-900 (浅色)
正文:       --neutral-700 (深色) / --neutral-dark-700 (浅色)
辅助文字:   --neutral-500 (深色) / --neutral-dark-500 (浅色)
占位符:     --neutral-400 (深色) / --neutral-dark-400 (浅色)
禁用文字:   --neutral-400 (深色) / --neutral-dark-400 (浅色)
链接:       --primary-600 (深色) / --primary-dark (浅色)
```

#### 背景颜色
```
页面:       --neutral-50
卡片/面板:  #FFFFFF
次级面板:   --neutral-100
悬浮面板:   #FFFFFF + shadow
悬停态:     --neutral-100
选中态:     --primary-50
禁用背景:   --neutral-100
```

#### 边框颜色
```
默认边框:   --neutral-200
悬停边框:   --neutral-300
聚焦边框:   --primary-600
错误边框:   --error-600
禁用边框:   --neutral-300
```

---

## 二、字体系统

### 2.1 字体选择

#### 西文字体
```
主字体: Inter Variable
备用: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif

特点:
- 优秀的屏幕渲染
- 完善的字重支持（100-900）
- 数字等宽选项
- 开源免费
```

#### 中文字体
```
主字体优先级:
1. "PingFang SC"         (macOS/iOS)
2. "Microsoft YaHei UI"  (Windows - 注意用UI版本，更清晰)
3. "Noto Sans SC"        (跨平台备用)
4. sans-serif

避免使用:
- "Microsoft YaHei" (非UI版本，渲染不够清晰)
- "Hiragino Sans GB" (较老的macOS字体)
```

#### 等宽字体
```
用于: 代码、数据、终端输出

1. "JetBrains Mono"
2. "SF Mono"
3. "Consolas"
4. "Monaco"
5. monospace
```

### 2.2 字体大小系统

#### 基准尺寸
```
基准: 16px (1rem)
缩放比例: 1.25 (Major Third)
```

#### 字号级数
```
--text-xs:   12px   (0.75rem)   - 徽标、小标签、辅助说明
--text-sm:   14px   (0.875rem)  - 次要文字、表格内容
--text-base: 16px   (1rem)      - 正文、输入框、按钮
--text-lg:   18px   (1.125rem)  - 强调正文、表单标签
--text-xl:   20px   (1.25rem)   - 小标题
--text-2xl:  24px   (1.5rem)    - 节标题
--text-3xl:  30px   (1.875rem)  - 大标题
--text-4xl:  36px   (2.25rem)   - 页面标题
--text-5xl:  48px   (3rem)      - 英雄标题
--text-6xl:  60px   (3.75rem)   - 超大标题（品牌页）
```

### 2.3 字重系统
```
--font-normal:    400  - 正文
--font-medium:    500  - 次要标题、强调、按钮
--font-semibold:  600  - 标题、重要按钮
--font-bold:      700  - 大标题（少用）
```

**使用建议**:
- 正文统一使用 400
- 避免使用 300（在部分屏幕上发虚）
- 避免使用 700+（中文粗体效果过重）
- 按钮默认 500，主要按钮 600

### 2.4 行高系统
```
--leading-none:   1      - 特殊情况（大标题紧凑排版）
--leading-tight:  1.25   - 大标题
--leading-snug:   1.375  - 小标题
--leading-normal: 1.5    - 按钮、输入框、短文本
--leading-relaxed:1.75   - 正文段落（中文）
--leading-loose:  2      - 诗歌、特殊排版
```

**中文行高建议**:
- 14-16px 正文: 1.75 (28px / 28px)
- 18-24px 标题: 1.5
- 30px+ 大标题: 1.25

### 2.5 字间距
```
--tracking-tighter: -0.05em  - 大标题紧凑
--tracking-tight:   -0.025em - 标题
--tracking-normal:  0        - 正文（默认）
--tracking-wide:    0.025em  - 按钮、标签
--tracking-wider:   0.05em   - 小型大写（慎用）
```

### 2.6 应用示例

#### 页面标题
```css
font-size: 36px;
font-weight: 600;
line-height: 1.25;
letter-spacing: -0.025em;
color: var(--neutral-900);
```

#### 节标题
```css
font-size: 24px;
font-weight: 600;
line-height: 1.375;
color: var(--neutral-800);
```

#### 正文
```css
font-size: 16px;
font-weight: 400;
line-height: 1.75;
color: var(--neutral-700);
```

#### 辅助文字
```css
font-size: 14px;
font-weight: 400;
line-height: 1.5;
color: var(--neutral-500);
```

#### 按钮
```css
font-size: 16px;
font-weight: 500;
line-height: 1.5;
letter-spacing: 0.01em;
```

---

## 三、间距系统

### 3.1 基础间距

**8px 基准系统** (推荐)
```
--space-0:  0px
--space-1:  4px    (0.25rem)  - 最小间隙
--space-2:  8px    (0.5rem)   - 紧凑间距
--space-3:  12px   (0.75rem)  - 小间距
--space-4:  16px   (1rem)     - 标准间距
--space-5:  20px   (1.25rem)  - 中等间距
--space-6:  24px   (1.5rem)   - 宽松间距
--space-8:  32px   (2rem)     - 大间距
--space-10: 40px   (2.5rem)   - 区块间距
--space-12: 48px   (3rem)     - 页面间距
--space-16: 64px   (4rem)     - 大区块间距
--space-20: 80px   (5rem)     - 超大间距
--space-24: 96px   (6rem)     - 页面边距
```

### 3.2 组件内间距

#### 按钮
```
小按钮:  padding: 8px 16px   (space-2 space-4)
默认:    padding: 12px 24px  (space-3 space-6)
大按钮:  padding: 16px 32px  (space-4 space-8)
```

#### 输入框
```
小输入框: padding: 8px 12px
默认:     padding: 12px 16px
大输入框: padding: 16px 20px
```

#### 卡片
```
紧凑: padding: 16px
默认: padding: 24px
宽松: padding: 32px
```

### 3.3 布局间距

#### 垂直节奏
```
段落间距:     space-4  (16px)
小节间距:     space-6  (24px)
节之间:       space-10 (40px)
大区块:       space-16 (64px)
页面区块:     space-24 (96px)
```

#### 水平间距
```
图标与文字:   space-2  (8px)
按钮组:       space-3  (12px)
表单字段:     space-6  (24px)
列之间:       space-6  (24px)
容器边距:     space-6  (24px)
```

### 3.4 栅格系统

#### 容器宽度
```
--container-sm:  640px   (移动端)
--container-md:  768px   (平板)
--container-lg:  1024px  (桌面)
--container-xl:  1280px  (大屏)
--container-2xl: 1536px  (超大屏)

默认最大宽度: 1280px
默认两侧留白: 24px (移动) / 48px (桌面)
```

#### 栅格列数
```
12列栅格系统
间距: 24px
```

---

## 四、圆角系统

### 4.1 圆角级数

**简化为4级**
```
--radius-sm:  4px   (0.25rem)  - 徽标、小标签、小按钮
--radius-md:  8px   (0.5rem)   - 按钮、输入框、小卡片
--radius-lg:  12px  (0.75rem)  - 卡片、对话框
--radius-xl:  16px  (1rem)     - 大卡片、抽屉
--radius-2xl: 24px  (1.5rem)   - 超大容器（少用）
--radius-full: 9999px          - 圆形/胶囊形
```

### 4.2 组件圆角

```
按钮:       --radius-md  (8px)
输入框:     --radius-md  (8px)
选择框:     --radius-md  (8px)
卡片:       --radius-lg  (12px)
对话框:     --radius-xl  (16px)
抽屉:       --radius-xl  (16px)
提示框:     --radius-lg  (12px)
徽标:       --radius-sm  (4px)
头像:       --radius-full
开关轨道:   --radius-full
```

### 4.3 圆角原则

1. **保持一致**: 相同类型的元素使用相同圆角
2. **层级区分**: 外层容器比内层元素圆角更大
3. **尺寸匹配**: 小元素用小圆角，大元素用大圆角
4. **避免过圆**: 圆角半径不要超过高度的25%（除了圆形）

---

## 五、阴影系统

### 5.1 阴影层级

**5级阴影体系**
```
--shadow-sm:
  0 1px 2px 0 rgba(0, 0, 0, 0.05)
  用于: 输入框、小卡片的轻微提升

--shadow-md:
  0 4px 6px -1px rgba(0, 0, 0, 0.1),
  0 2px 4px -1px rgba(0, 0, 0, 0.06)
  用于: 卡片、按钮悬停

--shadow-lg:
  0 10px 15px -3px rgba(0, 0, 0, 0.1),
  0 4px 6px -2px rgba(0, 0, 0, 0.05)
  用于: 下拉菜单、弹出框

--shadow-xl:
  0 20px 25px -5px rgba(0, 0, 0, 0.1),
  0 10px 10px -5px rgba(0, 0, 0, 0.04)
  用于: 对话框、抽屉

--shadow-2xl:
  0 25px 50px -12px rgba(0, 0, 0, 0.25)
  用于: 模态框、重要弹窗
```

### 5.2 内阴影
```
--shadow-inner:
  inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)
  用于: 按下态、输入框内部
```

### 5.3 深色主题阴影
```
深色主题下阴影强度加倍:
--shadow-dark-sm:  0 1px 2px 0 rgba(0, 0, 0, 0.3)
--shadow-dark-md:  0 4px 6px -1px rgba(0, 0, 0, 0.3)
... (以此类推)
```

### 5.4 使用原则

1. **光源一致**: 所有阴影从上方照射（Y轴正值）
2. **层级表达**: 浮起越高，阴影越大越模糊
3. **节制使用**: 不是所有元素都需要阴影
4. **边框OR阴影**: 一般不同时使用（特殊情况除外）

---

## 六、动效系统

### 6.1 动画时长

```
--duration-75:   75ms   - 极快（光标闪烁）
--duration-100:  100ms  - 很快（按钮按下）
--duration-150:  150ms  - 快速（悬停态）
--duration-200:  200ms  - 标准（一般交互）
--duration-300:  300ms  - 中等（展开/收起）
--duration-500:  500ms  - 较慢（页面过渡）
--duration-700:  700ms  - 慢（特殊动画）
--duration-1000: 1000ms - 很慢（加载动画）
```

### 6.2 缓动函数

```
--ease-linear:    cubic-bezier(0, 0, 1, 1)
--ease-in:        cubic-bezier(0.4, 0, 1, 1)        - 加速（元素离开）
--ease-out:       cubic-bezier(0, 0, 0.2, 1)        - 减速（元素进入）
--ease-in-out:    cubic-bezier(0.4, 0, 0.2, 1)      - 先加速后减速
--ease-bounce:    cubic-bezier(0.68, -0.55, 0.27, 1.55)  - 弹性（慎用）
```

**推荐使用**:
- 元素进入: ease-out
- 元素离开: ease-in
- 状态切换: ease-in-out

### 6.3 常见动效

#### 淡入淡出
```css
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

animation: fade-in 200ms ease-out;
```

#### 滑入
```css
@keyframes slide-in-bottom {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

animation: slide-in-bottom 300ms ease-out;
```

#### 缩放
```css
@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

animation: scale-in 200ms ease-out;
```

### 6.4 动效原则

1. **性能优先**: 只动画 transform 和 opacity
2. **减少动效**: 尊重 prefers-reduced-motion
3. **60fps**: 确保动画流畅
4. **有意义**: 动效应该传达信息或反馈，不是装饰

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 七、断点系统

### 7.1 响应式断点

```
--screen-sm:  640px   (手机横屏/小平板)
--screen-md:  768px   (平板)
--screen-lg:  1024px  (桌面)
--screen-xl:  1280px  (大屏桌面)
--screen-2xl: 1536px  (超大屏)
```

### 7.2 使用建议

**Mobile First 策略**:
```css
/* 默认: 移动端样式 */
.component {
  padding: 16px;
}

/* 平板及以上 */
@media (min-width: 768px) {
  .component {
    padding: 24px;
  }
}

/* 桌面及以上 */
@media (min-width: 1024px) {
  .component {
    padding: 32px;
  }
}
```

---

## 八、图标系统

### 8.1 图标库选择

**推荐**: Lucide Icons (已使用)
- 一致的设计风格
- 完善的React组件
- 可自定义尺寸和颜色
- 开源免费

### 8.2 图标尺寸

```
--icon-xs:  12px  - 徽标内、极小按钮
--icon-sm:  16px  - 按钮内、输入框图标
--icon-md:  20px  - 导航图标
--icon-lg:  24px  - 页面图标
--icon-xl:  32px  - 大图标
--icon-2xl: 48px  - 空状态图标
```

### 8.3 图标使用规范

1. **颜色继承**: `currentColor` 让图标跟随文字颜色
2. **垂直居中**: 图标与文字基线对齐
3. **间距一致**: 图标与文字间距 8px
4. **笔触粗细**: 统一使用 2px 或 1.5px

---

## 九、使用示例

### 9.1 CSS Variables 定义

```css
:root {
  /* 色彩 */
  --color-brand-500: #FF8C00;
  --color-primary-600: #2563EB;
  --color-neutral-50: #FAFAF9;
  --color-neutral-700: #44403C;
  --color-neutral-900: #1C1917;
  
  /* 字体 */
  --font-sans: Inter, "PingFang SC", "Microsoft YaHei UI", sans-serif;
  --text-base: 16px;
  --text-lg: 18px;
  --text-2xl: 24px;
  
  /* 间距 */
  --space-2: 8px;
  --space-4: 16px;
  --space-6: 24px;
  
  /* 圆角 */
  --radius-md: 8px;
  --radius-lg: 12px;
  
  /* 阴影 */
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  
  /* 动效 */
  --duration-200: 200ms;
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
}
```

### 9.2 按钮实现示例

```css
.button {
  /* 布局 */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  
  /* 尺寸 */
  padding: var(--space-3) var(--space-6);
  min-height: 44px;
  
  /* 外观 */
  background: var(--color-primary-600);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  
  /* 文字 */
  font-family: var(--font-sans);
  font-size: var(--text-base);
  font-weight: 500;
  line-height: 1.5;
  
  /* 交互 */
  cursor: pointer;
  transition: 
    background var(--duration-200) var(--ease-out),
    transform var(--duration-150) var(--ease-out);
}

.button:hover {
  background: var(--color-primary-700);
}

.button:active {
  transform: translateY(1px);
}

.button:focus-visible {
  outline: 2px solid var(--color-primary-600);
  outline-offset: 2px;
}
```

---

## 十、迁移指南

### 10.1 从旧系统迁移

**色彩映射**:
```
旧 --fp-primary → 新 --color-primary-600
旧 --fp-brand → 新 --color-brand-500
旧 --fp-ink → 新 --color-neutral-700
旧 --fp-muted → 新 --color-neutral-500
旧 --fp-bg → 新 --color-neutral-50
```

**间距映射**:
```
旧 --fp-space-2 (8px) → 新 --space-2
旧 --fp-space-3 (12px) → 新 --space-3
旧 --fp-space-4 (16px) → 新 --space-4
```

### 10.2 实施步骤

1. **第一阶段**: 建立新Token系统，与旧系统并存
2. **第二阶段**: 逐个组件迁移到新系统
3. **第三阶段**: 移除旧的CSS变量
4. **第四阶段**: 文档更新和团队培训

---

**文档版本**: 2.0.0  
**最后更新**: 2026年10月19日  
**维护者**: 五加一设计系统团队  
**下一步**: 核心组件视觉设计
