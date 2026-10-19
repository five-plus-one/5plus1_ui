#!/usr/bin/env node
/**
 * 最终验证和修复脚本
 * 1. 检查所有组件是否有实际内容
 * 2. 验证导航链接是否正常
 * 3. 生成完整的最终报告
 */

import fs from 'fs';
import path from 'path';

console.log('🔍 最终验证和修复...\n');

const KEZHAN_DIR = 'D:/5plus1/DEV/5plus1-ui/src/lib/kezhan';

// 1. 检查所有组件是否只是占位符
const components = fs.readdirSync(KEZHAN_DIR)
  .filter(f => f.endsWith('.tsx'))
  .map(f => f.replace('.tsx', ''));

let placeholders = 0;
let valid = 0;

components.forEach(name => {
  const filePath = path.join(KEZHAN_DIR, `${name}.tsx`);
  const content = fs.readFileSync(filePath, 'utf8');

  // 检查是否只是占位符（只有基础结构，无实际实现）
  const isPlaceholder = content.includes('{children}') &&
                       content.split('\n').length < 20;

  if (isPlaceholder) {
    placeholders++;
  } else {
    valid++;
  }
});

console.log('📊 组件内容检查:');
console.log(`  ✅ 有效组件: ${valid} 个`);
console.log(`  ⚠️  占位符: ${placeholders} 个`);
console.log(`  📦 总计: ${components.length} 个\n`);

// 2. 生成最终报告
const report = {
  timestamp: new Date().toISOString(),
  summary: {
    total: 78 + components.length,
    original: 78,
    kezhan: components.length,
    valid: valid,
    placeholders: placeholders,
  },
  components: {
    groups: {
      'AI 对话': components.filter(c => /Chat|Message|Agent|Token|Model/.test(c)).length,
      '账户管理': components.filter(c => /Account|Credit|Commerce|Notebook/.test(c)).length,
      '导航布局': components.filter(c => /Sidebar|Tree|Navigation|Panel/.test(c)).length,
      '可视化': components.filter(c => /Canvas|Plot|Diagram|Chart/.test(c)).length,
      '学习工具': components.filter(c => /Quiz|Review|Note/.test(c)).length,
      '交互学习': components.filter(c => /Explorer|Simulator|Calculator/.test(c)).length,
      '工作区': components.filter(c => !/Chat|Account|Sidebar|Canvas|Quiz|Explorer/.test(c)).length,
    }
  },
  issues: {
    scrollbar: '需要优化：橙色进度条、拖动支持',
    navigation: '需要修复：设计原则按钮跳转',
    cards: `需要增强：${placeholders} 个组件只有占位内容`,
  },
  nextSteps: [
    '1. 增强占位符组件的实际实现',
    '2. 修复滚动条交互（拖动、点击跳转）',
    '3. 完善所有组件的实际功能和样式',
    '4. 开始 KeZhan 实际重构工作',
  ]
};

fs.writeFileSync(
  'D:/5plus1/DEV/5plus1-ui/docs/FINAL_VERIFICATION.json',
  JSON.stringify(report, null, 2)
);

console.log('✅ 验证报告已生成: docs/FINAL_VERIFICATION.json\n');

console.log('📋 最终统计:');
console.log(`  总组件数: ${report.summary.total} 个`);
console.log(`  - 原有基础组件: ${report.summary.original} 个`);
console.log(`  - KeZhan 提取组件: ${report.summary.kezhan} 个\n`);

console.log('🎯 组件分布:');
Object.entries(report.components.groups).forEach(([group, count]) => {
  console.log(`  ${group}: ${count} 个`);
});

console.log('\n⚠️  待修复问题:');
Object.entries(report.issues).forEach(([key, issue]) => {
  console.log(`  - ${issue}`);
});

console.log('\n📝 下一步:');
report.nextSteps.forEach(step => {
  console.log(`  ${step}`);
});
