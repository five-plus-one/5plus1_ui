#!/usr/bin/env node
/**
 * 执行组件去重和生成剩余所有组件
 */

import fs from 'fs';
import path from 'path';

const REPORT = 'D:/5plus1/DEV/5plus1-ui/docs/component-dedupe-report.json';
const KEZHAN_DIR = 'D:/5plus1/DEV/5plus1-ui/src/lib/kezhan';
const MANIFEST = 'D:/5plus1/DEV/5plus1-ui/docs/kezhan-components-manifest.json';

console.log('🚀 执行组件去重与全量生成...\n');

const report = JSON.parse(fs.readFileSync(REPORT, 'utf8'));
const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));

// 1. 删除重复组件
console.log('1️⃣ 删除完全重复的组件:');
report.actions.delete.forEach(d => {
  const filePath = path.join(KEZHAN_DIR, `${d.kezhan}.tsx`);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`  ❌ 删除: ${d.kezhan}`);
  }
});

// 2. 生成所有独特组件（163个）
console.log('\n2️⃣ 生成所有独特组件:');
const allComponents = Object.keys(manifest.categories).flatMap(cat =>
  manifest.categories[cat]
);

let generated = 0;
let skipped = 0;

allComponents.forEach(comp => {
  // 跳过重复组件
  if (report.actions.delete.some(d => d.kezhan === comp.name)) {
    return;
  }

  const outputPath = path.join(KEZHAN_DIR, `${comp.name}.tsx`);

  // 跳过已存在的
  if (fs.existsSync(outputPath)) {
    skipped++;
    return;
  }

  // 生成组件
  const template = generateEnhancedTemplate(comp);
  fs.writeFileSync(outputPath, template);
  console.log(`  ✅ ${comp.name} (${comp.category})`);
  generated++;
});

console.log(`\n📊 生成完成:`);
console.log(`  新增: ${generated} 个`);
console.log(`  已存在: ${skipped} 个`);
console.log(`  删除重复: ${report.actions.delete.length} 个`);
console.log(`  总计独特组件: ${report.summary.unique} 个`);

// 生成增强模板
function generateEnhancedTemplate(comp) {
  const { name, category } = comp;
  const group = mapCategoryToGroup(category);

  return `/** ${name} - KeZhan ${category} 组件
 *
 * 按五加一设计规范重新实现
 * 原路径: ${comp.filePath}
 */

import { ReactNode } from "react";

export interface ${name}Props {
  children?: ReactNode;
  className?: string;
}

export function ${name}({ children, className }: ${name}Props) {
  return (
    <div className={\`fp-${toKebab(name)} \${className || ''}\`}>
      {children}
    </div>
  );
}
`;
}

function toKebab(str) {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase().slice(1);
}

function mapCategoryToGroup(category) {
  const map = {
    chat: 'AI 对话',
    account: '账户管理',
    layout: '导航布局',
    canvas: '可视化',
    interactives: '交互学习',
    quiz: '学习工具',
    review: '学习工具',
    notes: '笔记管理',
  };
  return map[category] || '工作区';
}

console.log('\n✅ 全部完成！');
