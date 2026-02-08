const fs = require('fs');
const { execSync } = require('child_process');

const data = JSON.parse(fs.readFileSync('data/algorithms.json', 'utf8'));
let app = execSync('git show HEAD:app.js', { encoding: 'utf8' });

const fallbackRegex = /const FALLBACK_ALGORITHMS = \[[\s\S]*?\n\];/;
if (!fallbackRegex.test(app)) throw new Error('fallback block not found in HEAD app.js');
app = app.replace(fallbackRegex, `const FALLBACK_ALGORITHMS = ${JSON.stringify(data, null, 2)};`);

const levelLoopFrom = "    Object.entries(byLevel[lvl]).forEach(([cat, items]) => {";
const levelLoopTo = `    const categoryEntries = Object.entries(byLevel[lvl]);
    if (lvl === '\\u5165\\u95e8') {
      const preferredOrder = { 'STL': 0, '\\u8bed\\u6cd5': 1 };
      categoryEntries.sort(([catA], [catB]) => {
        const rankA = Object.prototype.hasOwnProperty.call(preferredOrder, catA) ? preferredOrder[catA] : 99;
        const rankB = Object.prototype.hasOwnProperty.call(preferredOrder, catB) ? preferredOrder[catB] : 99;
        if (rankA !== rankB) return rankA - rankB;
        return 0;
      });
    }

    categoryEntries.forEach(([cat, items]) => {`;
if (!app.includes(levelLoopFrom)) throw new Error('renderLevels category loop not found');
app = app.replace(levelLoopFrom, levelLoopTo);

const invertFrom = `    filtered.forEach(item => {
      if (state.selections.has(item.id)) {
        state.selections.delete(item.id);
      } else {
        state.selections.add(item.id);
        masteryChanged = ensureDefaultMastery(item.id) || masteryChanged;
      }
    });`;
const invertTo = `    filtered.forEach(item => {
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
    });`;
if (!app.includes(invertFrom)) throw new Error('invertVisible block not found');
app = app.replace(invertFrom, invertTo);

const toggleFrom = `function toggleSelection(id) {
  let masteryChanged = false;
  if (state.selections.has(id)) {
    state.selections.delete(id);
  } else {
    state.selections.add(id);
    masteryChanged = ensureDefaultMastery(id);
  }
  persistSelection();
  if (masteryChanged) persistMastery();
}`;
const toggleTo = `function toggleSelection(id) {
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
}`;
if (!app.includes(toggleFrom)) throw new Error('toggleSelection block not found');
app = app.replace(toggleFrom, toggleTo);

fs.writeFileSync('app.js', app, 'utf8');
console.log('app.js rebuilt from HEAD + patched');
