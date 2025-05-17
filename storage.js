const fs = require('fs');
const path = './tasks.json';

function loadTasks() {
  try {
    const data = fs.readFileSync(path, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveTasks(tasks) {
  fs.writeFileSync(path, JSON.stringify(tasks, null, 2));
}

module.exports = { loadTasks, saveTasks };
