#!/bin/bash
# KeZhan 组件批量提取脚本
# 自动扫描、分析、生成组件清单

KEZHAN_COMPONENTS="D:/5plus1/DEV/KeZhan/KeZhan-notebook/KeZhan-notebook/.work/server-7-clean/components"
OUTPUT="D:/5plus1/DEV/5plus1-ui/docs/kezhan-all-components.json"

echo "正在扫描 KeZhan 的所有 224 个组件..."

# 生成完整组件清单
find "$KEZHAN_COMPONENTS" -name "*.tsx" -not -name "*.test.tsx" | \
  while read file; do
    filename=$(basename "$file" .tsx)
    dir=$(dirname "$file" | sed "s|$KEZHAN_COMPONENTS/||")

    # 提取组件导出
    exports=$(grep -E "^export (default )?(function|const|class)" "$file" | head -1)

    # 提取 props 接口
    props=$(grep -E "^(export )?interface.*Props" "$file" | head -1)

    # 统计行数
    lines=$(wc -l < "$file")

    echo "{\"file\":\"$filename\",\"dir\":\"$dir\",\"path\":\"$file\",\"lines\":$lines}"
  done | jq -s '.' > "$OUTPUT"

echo "✅ 组件清单已生成: $OUTPUT"
echo "总计: $(cat "$OUTPUT" | jq 'length') 个组件"
