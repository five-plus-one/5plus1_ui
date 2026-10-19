#!/usr/bin/env node
/**
 * KeZhan 组件批量生成工具
 * 基于清单自动生成五加一设计规范组件
 */

import fs from 'fs';
import path from 'path';

const MANIFEST = 'D:/5plus1/DEV/5plus1-ui/docs/kezhan-components-manifest.json';
const OUTPUT_DIR = 'D:/5plus1/DEV/5plus1-ui/src/lib/kezhan';
const CATALOG_FILE = 'D:/5plus1/DEV/5plus1-ui/src/kezhan-catalog.tsx';

console.log('📦 读取组件清单...');
const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));

// 创建输出目录
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 优先实现的核心组件
const PRIORITY_COMPONENTS = [
  'ChatInput', 'ChatMessage', 'ChatThread', 'ChatPanel',
  'TokenDashboard', 'ModelMenu', 'ThinkingMenu', 'ChatSettings',
  'FollowUpQuestions', 'ChatEmptyState', 'MessageContent',
  'FileTree', 'SubjectSidebar', 'GlobalSettings', 'TocTree',
  'NotebookManager', 'DirectoryManager', 'AccountCenter',
  'CreditsPanel', 'CloudSyncStatus',
];

let generated = 0;
let skipped = 0;

console.log('\n🚀 开始生成组件...\n');

Object.keys(manifest.categories).forEach(category => {
  const components = manifest.categories[category];

  components.forEach(comp => {
    const isPriority = PRIORITY_COMPONENTS.includes(comp.name);

    // 优先生成核心组件
    if (!isPriority && generated > 50) {
      skipped++;
      return;
    }

    const outputPath = path.join(OUTPUT_DIR, `${comp.name}.tsx`);

    // 跳过已存在的
    if (fs.existsSync(outputPath)) {
      console.log(`⏭️  跳过（已存在）: ${comp.name}`);
      skipped++;
      return;
    }

    // 生成组件模板
    const template = generateComponentTemplate(comp);
    fs.writeFileSync(outputPath, template);

    console.log(`✅ 生成: ${comp.name} (${category})`);
    generated++;
  });
});

console.log(`\n📊 生成完成:`);
console.log(`  ✅ 新增: ${generated} 个`);
console.log(`  ⏭️  跳过: ${skipped} 个`);
console.log(`  📁 输出目录: ${OUTPUT_DIR}`);

// 生成组件模板
function generateComponentTemplate(comp) {
  const { name, category, props } = comp;

  return `/** ${name} - 从 KeZhan ${category} 提取
 *
 * 按五加一设计规范重新实现
 * 原组件: ${comp.filePath}
 */

import { ReactNode } from "react";

export interface ${name}Props {
  children?: ReactNode;
  // TODO: 从原组件提取完整 props
}

export function ${name}({ children }: ${name}Props) {
  return (
    <div className="fp-${name.toLowerCase().replace(/([A-Z])/g, '-$1').slice(1)}">
      {children}
    </div>
  );
}
`;
}

console.log('\n下一步: 更新 catalog.tsx 添加新组件展示');
