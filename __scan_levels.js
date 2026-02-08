const fs = require('fs');
const lines = fs.readFileSync('app.js','utf8').split(/\r?\n/);
for (let i = 0; i < lines.length; i++) {
  const l = lines[i];
  if (l.includes('"level":')) {
    if (!/"level":\s*".*"\s*,?$/.test(l.trim())) {
      console.log(`${i + 1}: ${l}`);
    }
  }
}
