#!/usr/bin/env node
/**
 * 一次性完成所有组件导出和展示
 */

import fs from 'fs';
import path from 'path';

const KEZHAN_DIR = 'D:/5plus1/DEV/5plus1-ui/src/lib/kezhan';
const INDEX_FILE = 'D:/5plus1/DEV/5plus1-ui/src/lib/index.tsx';
const CATALOG_FILE = 'D:/5plus1/DEV/5plus1-ui/src/catalog.tsx';

console.log('🚀 一次性完成所有组件集成...\n');

// 1. 读取所有已生成的组件
const components = fs.readdirSync(KEZHAN_DIR)
  .filter(f => f.endsWith('.tsx'))
  .map(f => f.replace('.tsx', ''));

console.log(`✅ 找到 ${components.length} 个已生成组件\n`);

// 2. 生成导出语句
const exports = components
  .map(name => `export { ${name}, type ${name}Props } from "./kezhan/${name}";`)
  .join('\n');

// 3. 追加到 index.tsx
const indexContent = fs.readFileSync(INDEX_FILE, 'utf8');
if (!indexContent.includes('export { AccountCenter')) {
  const exportSection = `\n\n/* KeZhan 组件导出 (${components.length} 个) */\n${exports}\n`;
  fs.appendFileSync(INDEX_FILE, exportSection);
  console.log('✅ 已添加到 index.tsx 导出');
}

// 4. 生成 catalog 定义
const catalogDefs = components.map(name => {
  const group = inferGroup(name);
  return `  ${name}: ["${toZh(name)}", "${group}", "从课栈提取的 ${name} 组件。", "children?"]`;
}).join(',\n');

// 5. 生成 catalog 示例
const catalogExamples = components.map(name => {
  return `    ${name}: () => <U.${name}>${name} 示例</U.${name}>`;
}).join(',\n');

console.log('✅ 生成 catalog 定义');

// 6. 写入新的 catalog 文件
const newCatalogPath = 'D:/5plus1/DEV/5plus1-ui/src/kezhan-additions.tsx';
const catalogAdditions = `// KeZhan 组件 catalog 补充 (${components.length} 个)
const keZhanDefs: Record<string, [string, string, string, string]> = {
${catalogDefs}
};

const keZhanExamples = {
${catalogExamples}
};

export { keZhanDefs, keZhanExamples };
`;

fs.writeFileSync(newCatalogPath, catalogAdditions);
console.log(`✅ 写入: ${newCatalogPath}\n`);

console.log(`📊 完成统计:`);
console.log(`  - 组件总数: ${78 + components.length} 个 (原 78 + 新 ${components.length})`);
console.log(`  - 导出文件: src/lib/index.tsx`);
console.log(`  - catalog: src/kezhan-additions.tsx`);
console.log(`\n✅ 所有组件已完成导出和定义！`);

// 辅助函数
function inferGroup(name) {
  if (/Chat|Message|Agent|Model|Token/.test(name)) return 'AI 对话';
  if (/Account|Credit|Commerce|Notebook/.test(name)) return '账户管理';
  if (/Sidebar|Tree|Navigation|Panel/.test(name)) return '导航布局';
  if (/Canvas|Plot|Diagram|Visualization/.test(name)) return '可视化';
  if (/Quiz|Review|Note/.test(name)) return '学习工具';
  return '工作区';
}

function toZh(name) {
  const map = {
    'ChatInput': 'AI 输入框',
    'ChatMessage': 'AI 消息',
    'ChatThread': '对话流',
    'ChatPanel': '对话面板',
    'TokenDashboard': '积分仪表盘',
    'ModelMenu': '模型选择器',
    'FileTree': '文件树',
    'SubjectSidebar': '学科侧边栏',
    'AccountCenter': '账户中心',
    'CreditsPanel': '积分面板',
  };
  return map[name] || name;
}
