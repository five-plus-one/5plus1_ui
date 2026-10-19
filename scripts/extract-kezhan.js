#!/usr/bin/env node
/**
 * KeZhan 组件自动提取工具
 * 批量分析组件并生成五加一设计规范实现
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const KEZHAN_DIR = 'D:/5plus1/DEV/KeZhan/KeZhan-notebook/KeZhan-notebook/.work/server-7-clean/components';
const OUTPUT_DIR = 'D:/5plus1/DEV/5plus1-ui/src/lib/kezhan';

// 组件分类
const CATEGORIES = {
  chat: ['Chat', 'Message', 'Agent', 'Model', 'Token'],
  account: ['Account', 'Credits', 'Commerce', 'User', 'Notebook'],
  layout: ['Sidebar', 'Navigation', 'Tree', 'Panel', 'Window'],
  ui: ['Button', 'Input', 'Dialog', 'Menu', 'Tooltip'],
  content: ['Canvas', 'Plot', 'Diagram', 'Svg', 'Visualization'],
};

// 扫描所有组件
function scanComponents(dir) {
  const files = [];

  function walk(d) {
    const entries = fs.readdirSync(d, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(d, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.name.endsWith('.tsx') && !entry.name.includes('.test.')) {
        files.push(fullPath);
      }
    }
  }

  walk(dir);
  return files;
}

// 提取组件元数据
function extractMetadata(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const name = path.basename(filePath, '.tsx');
  const category = path.relative(KEZHAN_DIR, path.dirname(filePath)).split(path.sep)[0];

  // 提取 props 接口
  const propsMatch = content.match(/interface\s+(\w+Props)\s*{([^}]+)}/);
  const props = propsMatch ? propsMatch[2].trim() : '';

  // 提取导出
  const hasDefault = /export default/.test(content);
  const hasNamed = /export (function|const)/.test(content);

  return {
    name,
    category,
    filePath,
    props,
    hasDefault,
    hasNamed,
    lines: content.split('\n').length,
  };
}

console.log('🔍 扫描 KeZhan 组件...');
const files = scanComponents(KEZHAN_DIR);
console.log(`✅ 找到 ${files.length} 个组件文件`);

console.log('\n📊 组件分布：');
const byCategory = {};
files.forEach(f => {
  const meta = extractMetadata(f);
  if (!byCategory[meta.category]) byCategory[meta.category] = [];
  byCategory[meta.category].push(meta);
});

Object.keys(byCategory).sort().forEach(cat => {
  console.log(`  ${cat}: ${byCategory[cat].length} 个`);
});

// 生成组件清单
const manifest = {
  timestamp: new Date().toISOString(),
  total: files.length,
  categories: byCategory,
};

fs.writeFileSync(
  'D:/5plus1/DEV/5plus1-ui/docs/kezhan-components-manifest.json',
  JSON.stringify(manifest, null, 2)
);

console.log('\n✅ 清单已生成: docs/kezhan-components-manifest.json');
console.log('\n下一步: 批量生成五加一设计规范实现');
