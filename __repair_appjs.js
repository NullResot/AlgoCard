const fs = require('fs');

const appPath = 'app.js';
const dataPath = 'data/algorithms.json';

let app = fs.readFileSync(appPath, 'utf8');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

app = app.replace(/^\/\/[^\n]*const state = \{/m, '// core state\nconst state = {');

const levelDefs = `const LEVEL_CLASS = {
  '\\u5165\\u95e8': 'level-beginner',
  '\\u666e\\u53ca': 'level-regular',
  '\\u63d0\\u9ad8': 'level-advanced',
  '\\u7701\\u9009': 'level-province',
  'NOI': 'level-noi',
  '\\u7701\\u9009/NOI': 'level-province',
  '\\u666e\\u53ca/\\u63d0\\u9ad8': 'level-regular',
  '\\u63d0\\u9ad8/\\u7701\\u9009': 'level-province',
  '\\u5165\\u95e8/\\u666e\\u53ca': 'level-beginner',
  '\\u666e\\u53ca/\\u7701\\u9009/NOI': 'level-regular',
  '\\u63d0\\u9ad8/\\u7701\\u9009/NOI': 'level-advanced',
  '\\u63d0\\u9ad8/\\u666e\\u53ca': 'level-regular',
  '\\u672a\\u6807\\u6ce8': 'level-neutral'
};

const LEVEL_FILTERS = ['\\u5165\\u95e8', '\\u666e\\u53ca', '\\u63d0\\u9ad8', '\\u7701\\u9009', 'NOI'];`;

if (!/const LEVEL_CLASS = \{[\s\S]*?const LEVEL_FILTERS = \[[\s\S]*?\];/.test(app)) {
  throw new Error('LEVEL_CLASS / LEVEL_FILTERS block not found');
}
app = app.replace(/const LEVEL_CLASS = \{[\s\S]*?const LEVEL_FILTERS = \[[\s\S]*?\];/, levelDefs);

const fallbackBlock = `const FALLBACK_ALGORITHMS = ${JSON.stringify(data, null, 2)};`;
if (!/const FALLBACK_ALGORITHMS = \[[\s\S]*?\n\];/.test(app)) {
  throw new Error('FALLBACK_ALGORITHMS block not found');
}
app = app.replace(/const FALLBACK_ALGORITHMS = \[[\s\S]*?\n\];/, fallbackBlock);

app = app.replace('const preferredOrder = { "\\u8bed\\u6cd5": 0, "STL": 1 };', 'const preferredOrder = { "STL": 0, "\\u8bed\\u6cd5": 1 };');
app = app.replace('const preferredOrder = { "语法": 0, "STL": 1 };', 'const preferredOrder = { "STL": 0, "语法": 1 };');

fs.writeFileSync(appPath, app, 'utf8');
console.log('app.js repaired');
