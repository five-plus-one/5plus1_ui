#!/usr/bin/env node
/**
 * 组件去重与合并分析
 * 识别重复组件并生成合并方案
 */

import fs from 'fs';

const MANIFEST = 'D:/5plus1/DEV/5plus1-ui/docs/kezhan-components-manifest.json';
const EXISTING = 'D:/5plus1/DEV/5plus1-ui/src/catalog.tsx';

console.log('🔍 分析组件重复情况...\n');

const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
const existing = fs.readFileSync(EXISTING, 'utf8');

// 已有的基础组件
const existingComponents = [
  'Button', 'Input', 'Select', 'Checkbox', 'Radio', 'Switch',
  'Dialog', 'Drawer', 'Dropdown', 'Popover', 'Toast', 'Tooltip',
  'Tabs', 'Badge', 'Avatar', 'Card', 'Divider', 'Accordion',
  'Tree', 'Navigation', 'Toolbar', 'Footer', 'PageHeader',
  'FileCard', 'ResultCard', 'Citation', 'Callout',
  'AIMessage', 'AIComposer', 'TaskStatus',
];

// KeZhan 生成的组件
const keZhanComponents = Object.keys(manifest.categories).flatMap(cat =>
  manifest.categories[cat].map(c => c.name)
);

console.log('📊 组件统计:');
console.log(`  现有基础组件: ${existingComponents.length}`);
console.log(`  KeZhan 组件: ${keZhanComponents.length}`);

// 识别重复和可合并的组件
const duplicates = {
  // 完全重复（应删除 KeZhan 版本）
  exact: [],
  // 功能相似（应合并功能）
  similar: [],
  // 独特组件（保留）
  unique: []
};

keZhanComponents.forEach(kc => {
  const lower = kc.toLowerCase();

  // 检查是否与现有组件完全重复
  if (existingComponents.some(ec => ec.toLowerCase() === lower)) {
    duplicates.exact.push({ kezhan: kc, existing: existingComponents.find(ec => ec.toLowerCase() === lower) });
  }
  // 检查功能相似
  else if (
    (kc.includes('Button') && existingComponents.includes('Button')) ||
    (kc.includes('Input') && existingComponents.includes('Input')) ||
    (kc.includes('Menu') && existingComponents.includes('Dropdown')) ||
    (kc.includes('Settings') && existingComponents.includes('Dialog')) ||
    (kc.includes('Card') && (existingComponents.includes('Card') || existingComponents.includes('FileCard')))
  ) {
    duplicates.similar.push(kc);
  }
  // 独特组件
  else {
    duplicates.unique.push(kc);
  }
});

console.log('\n🔄 重复分析:');
console.log(`  完全重复: ${duplicates.exact.length} 个`);
console.log(`  功能相似: ${duplicates.similar.length} 个`);
console.log(`  独特组件: ${duplicates.unique.length} 个`);

// 生成去重方案
const dedupeReport = {
  timestamp: new Date().toISOString(),
  summary: {
    exact: duplicates.exact.length,
    similar: duplicates.similar.length,
    unique: duplicates.unique.length,
  },
  actions: {
    delete: duplicates.exact,
    merge: duplicates.similar,
    keep: duplicates.unique,
  },
  recommendations: [
    '删除完全重复的组件，使用现有基础组件',
    '合并功能相似的组件，增强现有组件功能',
    '保留独特的 KeZhan 专属组件（AI 对话、学习工具等）',
  ]
};

fs.writeFileSync(
  'D:/5plus1/DEV/5plus1-ui/docs/component-dedupe-report.json',
  JSON.stringify(dedupeReport, null, 2)
);

console.log('\n✅ 去重报告已生成: docs/component-dedupe-report.json');

// 显示详细的重复组件
console.log('\n📋 需要删除的重复组件:');
duplicates.exact.forEach(d => {
  console.log(`  ❌ ${d.kezhan} → 使用现有 ${d.existing}`);
});

console.log('\n📋 需要合并的相似组件:');
duplicates.similar.slice(0, 10).forEach(c => {
  console.log(`  🔀 ${c}`);
});

console.log('\n📋 独特组件（保留）:');
duplicates.unique.slice(0, 20).forEach(c => {
  console.log(`  ✅ ${c}`);
});

console.log(`\n💡 实际有意义的组件: ${duplicates.unique.length} 个`);
console.log(`📦 去重后总数: ${existingComponents.length + duplicates.unique.length} 个`);
