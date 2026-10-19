#!/bin/bash
# KeZhan-notebook UI 重构自动化脚本
# 将 Material Design 3 变量批量替换为 5plus1-ui 变量

set -e

KEZHAN_DIR="D:/5plus1/DEV/KeZhan/KeZhan-notebook/KeZhan-notebook/.work/server-7-clean"

echo "开始 KeZhan-notebook UI 重构..."

# 1. 备份当前状态
echo "1. 创建备份..."
cd "$KEZHAN_DIR"
git checkout -b feat/5plus1-ui-migration 2>/dev/null || git checkout feat/5plus1-ui-migration

# 2. 替换颜色变量
echo "2. 替换颜色变量..."
find . -type f \( -name "*.tsx" -o -name "*.css" -o -name "*.scss" \) \
  -not -path "./node_modules/*" \
  -not -path "./.next/*" \
  -exec sed -i \
    -e 's/var(--md-sys-color-primary-container)/var(--fp-primary-soft)/g' \
    -e 's/var(--md-sys-color-on-primary-container)/var(--fp-primary-ink)/g' \
    -e 's/var(--md-sys-color-surface-container-high)/var(--fp-surface-muted)/g' \
    -e 's/var(--md-sys-color-surface-container)/var(--fp-surface-muted)/g' \
    -e 's/var(--md-sys-color-surface-variant)/var(--fp-surface-muted)/g' \
    -e 's/var(--md-sys-color-on-surface-variant)/var(--fp-muted)/g' \
    -e 's/var(--md-sys-color-on-surface)/var(--fp-ink)/g' \
    -e 's/var(--md-sys-color-surface)/var(--fp-surface)/g' \
    -e 's/var(--md-sys-color-primary)/var(--fp-primary)/g' \
    -e 's/var(--md-sys-color-on-primary)/var(--fp-on-primary)/g' \
    -e 's/var(--md-sys-color-outline-variant)/var(--fp-line)/g' \
    -e 's/var(--md-sys-color-outline)/var(--fp-line-strong)/g' \
    -e 's/var(--md-sys-color-error-container)/var(--fp-error-soft)/g' \
    -e 's/var(--md-sys-color-error)/var(--fp-error)/g' \
    -e 's/var(--md-sys-color-success)/var(--fp-success)/g' \
    -e 's/var(--md-sys-color-warning)/var(--fp-warning)/g' \
    -e 's/var(--md-sys-color-info)/var(--fp-info)/g' \
    {} +

# 3. 替换其他变量
echo "3. 替换间距、圆角、阴影变量..."
find . -type f \( -name "*.tsx" -o -name "*.css" -o -name "*.scss" \) \
  -not -path "./node_modules/*" \
  -not -path "./.next/*" \
  -exec sed -i \
    -e 's/var(--bg-panel)/var(--fp-surface)/g' \
    -e 's/var(--bg-muted)/var(--fp-surface-muted)/g' \
    -e 's/var(--bg)/var(--fp-bg)/g' \
    -e 's/var(--ink-soft)/var(--fp-muted)/g' \
    -e 's/var(--ink)/var(--fp-ink)/g' \
    -e 's/var(--line)/var(--fp-line)/g' \
    {} +

echo "✅ 变量替换完成"
echo ""
echo "后续步骤："
echo "1. 安装 5plus1-ui: npm install ../5plus1-ui/fiveplusone-ui-*.tgz"
echo "2. 在 app/layout.tsx 中导入: import '@fiveplusone/ui/styles.css'"
echo "3. 手动替换组件导入（参考 docs/kezhan-component-mapping.md）"
echo "4. 运行测试: npm run dev"
