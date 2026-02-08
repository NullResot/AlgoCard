const fs = require('fs');
const html = fs.readFileSync('d:/AlgoCard/index.html', 'utf8');
const start = '<script id="fallback-data" type="application/json">';
const end = '</script>';
const i = html.indexOf(start);
if (i < 0) { console.log('no tag'); process.exit(0); }
const j = html.indexOf(end, i + start.length);
const raw = html.slice(i + start.length, j).trim();
try {
  const data = JSON.parse(raw);
  console.log('embedded ok', Array.isArray(data) ? data.length : (data.algorithms || []).length);
} catch (e) {
  console.log('embedded bad', e.message);
}
