const fs = require('fs');

const data = JSON.parse(fs.readFileSync('data/algorithms.json', 'utf8'));
let app = fs.readFileSync('app.js', 'utf8');

let replaced = 0;

app = app.replace(/const FALLBACK_ALGORITHMS = \[[\s\S]*?\n\];/, () => {
  replaced += 1;
  return `const FALLBACK_ALGORITHMS = ${JSON.stringify(data, null, 2)};`;
});

app = app.replace('    Object.entries(byLevel[lvl]).forEach(([cat, items]) => {', `    const categoryEntries = Object.entries(byLevel[lvl]);
    if (lvl === '\\u5165\\u95e8') {
      const preferredOrder = { 'STL': 0, '\\u8bed\\u6cd5': 1 };
      categoryEntries.sort(([catA], [catB]) => {
        const rankA = Object.prototype.hasOwnProperty.call(preferredOrder, catA) ? preferredOrder[catA] : 99;
        const rankB = Object.prototype.hasOwnProperty.call(preferredOrder, catB) ? preferredOrder[catB] : 99;
        if (rankA !== rankB) return rankA - rankB;
        return 0;
      });
    }

    categoryEntries.forEach(([cat, items]) => {`);

const invertPattern = /filtered\.forEach\(item => \{\r?\n\s*if \(state\.selections\.has\(item\.id\)\) \{\r?\n\s*state\.selections\.delete\(item\.id\);\r?\n\s*\} else \{\r?\n\s*state\.selections\.add\(item\.id\);\r?\n\s*masteryChanged = ensureDefaultMastery\(item\.id\) \|\| masteryChanged;\r?\n\s*\}\r?\n\s*\}\);/;
if (invertPattern.test(app)) {
  app = app.replace(invertPattern, `filtered.forEach(item => {
      if (state.selections.has(item.id)) {
        state.selections.delete(item.id);
        if (state.mastery.has(item.id)) {
          state.mastery.delete(item.id);
          masteryChanged = true;
        }
      } else {
        state.selections.add(item.id);
        masteryChanged = ensureDefaultMastery(item.id) || masteryChanged;
      }
    });`);
} else {
  throw new Error('invertVisible pattern not found');
}

const togglePattern = /function toggleSelection\(id\) \{\r?\n\s*let masteryChanged = false;\r?\n\s*if \(state\.selections\.has\(id\)\) \{\r?\n\s*state\.selections\.delete\(id\);\r?\n\s*\} else \{\r?\n\s*state\.selections\.add\(id\);\r?\n\s*masteryChanged = ensureDefaultMastery\(id\);\r?\n\s*\}\r?\n\s*persistSelection\(\);\r?\n\s*if \(masteryChanged\) persistMastery\(\);\r?\n\}/;
if (togglePattern.test(app)) {
  app = app.replace(togglePattern, `function toggleSelection(id) {
  let masteryChanged = false;
  if (state.selections.has(id)) {
    state.selections.delete(id);
    if (state.mastery.has(id)) {
      state.mastery.delete(id);
      masteryChanged = true;
    }
  } else {
    state.selections.add(id);
    masteryChanged = ensureDefaultMastery(id) || masteryChanged;
  }
  persistSelection();
  if (masteryChanged) persistMastery();
}`);
} else {
  throw new Error('toggleSelection pattern not found');
}

fs.writeFileSync('app.js', app, 'utf8');
console.log('patched app.js successfully');
