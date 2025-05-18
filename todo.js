const fs = require('fs');
const path = require('path');

// === File Paths ===
const TASK_FILE = 'tasks.json';
const ARCHIVE_FILE = 'archive.json';

// === ANSI Colors ===
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
};

// === Utility ===
function loadTasks(file = TASK_FILE) {
  try {
    const data = fs.readFileSync(file, 'utf8');
    return JSON.parse(data || '[]');
  } catch {
    return [];
  }
}

function saveTasks(tasks, file = TASK_FILE) {
  try {
    fs.writeFileSync(file, JSON.stringify(tasks, null, 2));
  } catch (err) {
    console.error(`${colors.red}Error writing to ${file}:${colors.reset}`, err.message);
  }
}

function isValidDate(dateStr) {
  return !isNaN(new Date(dateStr).getTime());
}

function getNextId(tasks) {
  return tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
}

// === Task Operations ===
function addTask(options) {
  const { title, desc = '', due, priority = 'medium' } = options;
  if (!title) return console.log(`${colors.red}--title is required.${colors.reset}`);
  if (due && !isValidDate(due)) return console.log(`${colors.red}Invalid date format. Use YYYY-MM-DD.${colors.reset}`);
  const tasks = loadTasks();
  const newTask = {
    id: getNextId(tasks),
    title,
    description: desc,
    dueDate: due || null,
    priority,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  tasks.push(newTask);
  saveTasks(tasks);
  console.log(`${colors.green}Task added:${colors.reset} "${title}"`);
}

function listTasks(filters = {}) {
  let tasks = loadTasks();

  if (filters.status) tasks = tasks.filter(t => t.status === filters.status);
  if (filters.due) tasks = tasks.filter(t => t.dueDate === filters.due);
  if (filters.priority) tasks = tasks.filter(t => t.priority === filters.priority);

  if (filters.sort === 'due') {
    tasks.sort((a, b) => new Date(a.dueDate || '') - new Date(b.dueDate || ''));
  } else if (filters.sort === 'created') {
    tasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  if (tasks.length === 0) return console.log(`${colors.yellow}No tasks found.${colors.reset}`);

  for (const task of tasks) {
    const color = task.status === 'done'
      ? colors.green
      : (task.dueDate && new Date(task.dueDate) < new Date())
        ? colors.red
        : colors.yellow;
    console.log(`${color}[${task.id}] ${task.title}${colors.reset}`);
    console.log(`  Status: ${task.status} | Due: ${task.dueDate || '-'} | Priority: ${task.priority}`);
  }
}

function markDone(id) {
  const tasks = loadTasks();
  const task = tasks.find(t => t.id === id);
  if (!task) return console.log(`${colors.red}Task with ID ${id} not found.${colors.reset}`);
  task.status = 'done';
  saveTasks(tasks);
  console.log(`${colors.green}Task ${id} marked as done.${colors.reset}`);
}

function deleteTask(id) {
  let tasks = loadTasks();
  const before = tasks.length;
  tasks = tasks.filter(t => t.id !== id);
  if (tasks.length === before) {
    return console.log(`${colors.red}Task with ID ${id} not found.${colors.reset}`);
  }
  saveTasks(tasks);
  console.log(`${colors.green}Task ${id} deleted.${colors.reset}`);
}

function updateTask(id, updates) {
  const tasks = loadTasks();
  const task = tasks.find(t => t.id === id);
  if (!task) return console.log(`${colors.red}Task with ID ${id} not found.${colors.reset}`);

  if (updates.title) task.title = updates.title;
  if (updates.due) {
    if (!isValidDate(updates.due)) return console.log(`${colors.red}Invalid due date.${colors.reset}`);
    task.dueDate = updates.due;
  }
  if (updates.priority) task.priority = updates.priority;

  saveTasks(tasks);
  console.log(`${colors.green}Task ${id} updated.${colors.reset}`);
}

function showHelp() {
  console.log(`
${colors.bold}To-Do CLI - Usage Guide${colors.reset}

${colors.cyan}Commands:${colors.reset}

  ${colors.yellow}add${colors.reset}       --title "Task" [--desc ""] [--due "YYYY-MM-DD"] [--priority low|medium|high]
  ${colors.yellow}list${colors.reset}      [--status pending|done] [--due "YYYY-MM-DD"] [--priority ...] [--sort due|created]
  ${colors.yellow}done${colors.reset}      --id 3
  ${colors.yellow}update${colors.reset}    --id 2 [--title ""] [--due "YYYY-MM-DD"] [--priority ...]
  ${colors.yellow}delete${colors.reset}    --id 4
  ${colors.yellow}remind${colors.reset}    Show tasks due in next 24h
  ${colors.yellow}archive${colors.reset}   Move done tasks to archive.json
  ${colors.yellow}export${colors.reset}    [--format txt|csv]
  ${colors.yellow}import${colors.reset}    --file path.csv
  ${colors.yellow}help${colors.reset}      Show this help message
  ${colors.yellow}--version${colors.reset} Show version from package.json
`);
}

function remindTasks() {
  const tasks = loadTasks();
  const now = new Date();
  const soon = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const upcoming = tasks.filter(t => t.status === 'pending' && t.dueDate && new Date(t.dueDate) <= soon);

  if (upcoming.length === 0) {
    return console.log(`${colors.green}No tasks due in the next 24 hours.${colors.reset}`);
  }

  console.log(`${colors.yellow}Tasks due soon:${colors.reset}`);
  for (const task of upcoming) {
    console.log(`[${task.id}] ${task.title} - Due: ${task.dueDate}`);
  }
}

function archiveTasks() {
  const tasks = loadTasks();
  const doneTasks = tasks.filter(t => t.status === 'done');
  const remaining = tasks.filter(t => t.status !== 'done');

  if (doneTasks.length === 0) {
    return console.log(`${colors.yellow}No completed tasks to archive.${colors.reset}`);
  }

  const archived = loadTasks(ARCHIVE_FILE);
  const combined = [...archived, ...doneTasks];

  saveTasks(combined, ARCHIVE_FILE);
  saveTasks(remaining);

  console.log(`${colors.green}${doneTasks.length} task(s) archived.${colors.reset}`);
}

function exportTasks(format = 'txt') {
  const tasks = loadTasks();
  if (format === 'csv') {
    const header = 'id,title,description,dueDate,priority,status,createdAt';
    const rows = tasks.map(t =>
      [t.id, t.title, t.description, t.dueDate, t.priority, t.status, t.createdAt].map(v => `"${(v || '').replace(/"/g, '""')}"`).join(',')
    );
    fs.writeFileSync('tasks.csv', [header, ...rows].join('\n'));
    console.log(`${colors.green}Exported to tasks.csv${colors.reset}`);
  } else {
    const content = tasks.map(t =>
      `ID: ${t.id}\nTitle: ${t.title}\nDesc: ${t.description}\nDue: ${t.dueDate || '-'}\nPriority: ${t.priority}\nStatus: ${t.status}\n---`
    ).join('\n\n');
    fs.writeFileSync('tasks.txt', content);
    console.log(`${colors.green}Exported to tasks.txt${colors.reset}`);
  }
}

function importTasks(filePath) {
  if (!fs.existsSync(filePath)) {
    return console.log(`${colors.red}File not found: ${filePath}${colors.reset}`);
  }

  const ext = path.extname(filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  const existing = loadTasks();

  let imported = [];

  if (ext === '.csv') {
    const lines = content.split('\n').slice(1);
    for (const line of lines) {
      const [id, title, description, dueDate, priority, status, createdAt] = line.split(',').map(s => s.replace(/^"|"$/g, ''));
      imported.push({
        id: getNextId(existing.concat(imported)),
        title, description, dueDate, priority, status, createdAt
      });
    }
  } else {
    return console.log(`${colors.red}Unsupported file format.${colors.reset}`);
  }

  saveTasks([...existing, ...imported]);
  console.log(`${colors.green}Imported ${imported.length} tasks from ${filePath}${colors.reset}`);
}

// === Exports ===
module.exports = {
  addTask,
  listTasks,
  markDone,
  deleteTask,
  updateTask,
  showHelp,
  remindTasks,
  archiveTasks,
  exportTasks,
  importTasks
};
