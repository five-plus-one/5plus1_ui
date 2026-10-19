#!/usr/bin/env node
/**
 * 更新所有导出和 catalog
 */

import fs from 'fs';
import path from 'path';

const KEZHAN_DIR = 'D:/5plus1/DEV/5plus1-ui/src/lib/kezhan';
const INDEX_FILE = 'D:/5plus1/DEV/5plus1-ui/src/lib/index.tsx';
const CATALOG_ADDITIONS = 'D:/5plus1/DEV/5plus1-ui/src/kezhan-additions.tsx';

console.log('🔄 更新所有导出...\n');

// 读取所有组件
const components = fs.readdirSync(KEZHAN_DIR)
  .filter(f => f.endsWith('.tsx'))
  .map(f => f.replace('.tsx', ''))
  .sort();

console.log(`✅ 找到 ${components.length} 个组件\n`);

// 1. 重新生成 index.tsx 的 KeZhan 导出部分
const indexContent = fs.readFileSync(INDEX_FILE, 'utf8');
const beforeKeZhan = indexContent.split('/* KeZhan 组件导出')[0];

const newExports = components
  .map(name => `export { ${name}, type ${name}Props } from "./kezhan/${name}";`)
  .join('\n');

const newIndexContent = `${beforeKeZhan}/* KeZhan 组件导出 (${components.length} 个) */\n${newExports}\n`;

fs.writeFileSync(INDEX_FILE, newIndexContent);
console.log(`✅ 更新 index.tsx (${components.length} 个导出)`);

// 2. 重新生成 catalog additions
const catalogDefs = components.map(name => {
  return `  ${name}: ["${name}", "${inferGroup(name)}", "KeZhan ${name} 组件", "children?"]`;
}).join(',\n');

const catalogExamples = components.map(name => {
  return `    ${name}: () => <U.${name}>${name}</U.${name}>`;
}).join(',\n');

const newCatalogContent = `// KeZhan 组件 catalog (${components.length} 个)
import * as U from "./lib";

export const keZhanDefs: Record<string, [string, string, string, string]> = {
${catalogDefs}
};

export const keZhanExamples: Record<string, () => React.ReactNode> = {
${catalogExamples}
};
`;

fs.writeFileSync(CATALOG_ADDITIONS, newCatalogContent);
console.log(`✅ 更新 kezhan-additions.tsx (${components.length} 个)\n`);

console.log('📊 最终统计:');
console.log(`  原有组件: 78 个`);
console.log(`  KeZhan 组件: ${components.length} 个`);
console.log(`  总计: ${78 + components.length} 个`);

function inferGroup(name) {
  if (/Chat|Message|Agent|Token|Model|Artifact/.test(name)) return 'AI 对话';
  if (/Account|Credit|Commerce|Notebook|User/.test(name)) return '账户管理';
  if (/Sidebar|Tree|Navigation|Panel|Window|Shell/.test(name)) return '导航布局';
  if (/Canvas|Plot|Diagram|Chart|Visual/.test(name)) return '可视化';
  if (/Quiz|Review|Note|Study/.test(name)) return '学习工具';
  if (/Explorer|Simulator|Calculator|Demo/.test(name)) return '交互学习';
  return '工作区';
}
