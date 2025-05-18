const { loadTasks, saveTasks } = require('./storage');
const path = require('path');
const fs = require('fs');

const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';

const ARCHIVE_FILE = path.join(__dirname, 'archive.json');

function addTask(title, dueDate, priority = 'medium') {
  const tasks = loadTasks();
  const id = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;

  const task = {
    id,
    title,
    description: '',
    dueDate,
    status: 'pending',
    createdAt: new Date().toISOString(),
    priority: priority.toLowerCase() // new field
  };

  tasks.push(task);
  saveTasks(tasks);
  console.log('\x1b[32mTask added with priority: ' + priority + '\x1b[0m');
}


function colorText(text, color) {
  const RESET = '\x1b[0m';
  return `${color}${text}${RESET}`;
}

/**
 * Display all tasks grouped by status: pending and done
 */
function listTasks(filters = {}) {
  let tasks = loadTasks();
  const { status, dueDate, sortBy, priority } = filters;

  // Filtering
  if (status) tasks = tasks.filter(t => t.status === status.toLowerCase());
  if (dueDate) tasks = tasks.filter(t => t.dueDate === dueDate);
  if (priority) tasks = tasks.filter(t => t.priority === priority.toLowerCase());

  // Sort
  if (sortBy) {
    if (sortBy === 'due') {
      tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (sortBy === 'due-desc') {
      tasks.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
    } else if (sortBy === 'created') {
      tasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
  }

  console.log('\n\x1b[1m\x1b[36mTask List\x1b[0m');
  console.log('='.repeat(60));

  tasks.forEach(task => {
    const priorityColor =
      task.priority === 'high' ? '\x1b[31m' :
        task.priority === 'medium' ? '\x1b[33m' : '\x1b[32m';

    const statusIcon = task.status === 'done' ? '✔' : '•';
    const line = `${statusIcon} [${task.id}] ${task.title} (due: ${task.dueDate}, priority: ${task.priority})`;

    console.log(priorityColor + line + '\x1b[0m');
  });

  console.log('');
}

/**
 * Mark a task as done by its ID
 * @param {number|string} id - The task ID to mark as done
 */
function markTaskAsDone(id) {
  const tasks = loadTasks();
  const taskIndex = tasks.findIndex(task => String(task.id) === String(id));

  if (taskIndex === -1) {
    console.log(`Task with ID ${id} not found.`);
    return;
  }

  if (tasks[taskIndex].status === 'done') {
    console.log(`Task with ID ${id} is already marked as done.`);
    return;
  }

  tasks[taskIndex].status = 'done';
  saveTasks(tasks);

  console.log(`Task "${tasks[taskIndex].title}" marked as done.`);
}

/**
 * Delete a task by its ID
 * @param {number|string} id - The ID of the task to delete
 */
function deleteTask(id) {
  const tasks = loadTasks();
  const taskIndex = tasks.findIndex(task => String(task.id) === String(id));

  if (taskIndex === -1) {
    console.log(`Task with ID ${id} not found.`);
    return;
  }

  const removed = tasks.splice(taskIndex, 1)[0];
  saveTasks(tasks);

  console.log(`Task "${removed.title}" deleted.`);
}

/**
 * Update a task by ID. Accepts optional new title and/or dueDate.
 * @param {string|number} id - ID of the task to update
 * @param {object} updates - Object with optional `title` and/or `dueDate`
 */
function updateTask(id, updates = {}) {
  const tasks = loadTasks();
  const index = tasks.findIndex(task => String(task.id) === String(id));

  if (index === -1) {
    console.log(`Task with ID ${id} not found.`);
    return;
  }

  const task = tasks[index];

  if (updates.title) {
    task.title = updates.title;
  }
  if (updates.dueDate) {
    task.dueDate = updates.dueDate;
  }

  saveTasks(tasks);
  console.log(`Task "${task.title}" updated.`);
}

function archiveTasks() {
  const tasks = loadTasks();
  const doneTasks = tasks.filter(t => t.status === 'done');
  const remainingTasks = tasks.filter(t => t.status !== 'done');

  if (doneTasks.length === 0) {
    console.log('\x1b[33mNo completed tasks to archive.\x1b[0m');
    return;
  }

  let archive = [];
  if (fs.existsSync(ARCHIVE_FILE)) {
    const archiveData = fs.readFileSync(ARCHIVE_FILE, 'utf8');
    archive = archiveData ? JSON.parse(archiveData) : [];
  }

  archive.push(...doneTasks);

  fs.writeFileSync(ARCHIVE_FILE, JSON.stringify(archive, null, 2));
  saveTasks(remainingTasks);

  console.log(`\x1b[32mArchived ${doneTasks.length} completed task(s).\x1b[0m`);
}

function cleanupTasks() {
  const tasks = loadTasks();
  const remaining = tasks.filter(t => t.status !== 'done');
  const removedCount = tasks.length - remaining.length;

  if (removedCount === 0) {
    console.log('\x1b[33mNo completed tasks to remove.\x1b[0m');
    return;
  }

  saveTasks(remaining);
  console.log(`\x1b[32mDeleted ${removedCount} completed task(s).\x1b[0m`);
}

function remindTasks() {
  const tasks = loadTasks();
  const now = new Date();
  const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const upcomingTasks = tasks.filter(task => {
    if (task.status !== 'pending') return false;
    const due = new Date(task.dueDate);
    return due >= now && due <= oneDayLater;
  });

  if (upcomingTasks.length === 0) {
    console.log('\x1b[36mNo tasks due within 24 hours.\x1b[0m');
    return;
  }

  console.log('\x1b[1m\x1b[33m⏰ Upcoming Tasks (due within 24 hours):\x1b[0m');
  upcomingTasks.forEach(task => {
    console.log(`\x1b[33m[${task.id}] ${task.title} → Due: ${task.dueDate}\x1b[0m`);
  });
}

const EXPORTS_DIR = path.join(__dirname, 'exports');
if (!fs.existsSync(EXPORTS_DIR)) fs.mkdirSync(EXPORTS_DIR);

function exportTasks(format = 'txt') {
  const tasks = loadTasks();
  const filename = `tasks_export_${Date.now()}.${format}`;
  const filePath = path.join(EXPORTS_DIR, filename);

  let content = '';

  if (format === 'csv') {
    content = 'id,title,description,dueDate,status,priority,createdAt\n';
    content += tasks.map(t =>
      `${t.id},"${t.title.replace(/"/g, '""')}","${t.description.replace(/"/g, '""')}",${t.dueDate},${t.status},${t.priority},${t.createdAt}`
    ).join('\n');
  } else {
    content = tasks.map(t =>
      `ID: ${t.id}\nTitle: ${t.title}\nDescription: ${t.description}\nDue: ${t.dueDate}\nStatus: ${t.status}\nPriority: ${t.priority}\nCreated At: ${t.createdAt}\n---`
    ).join('\n\n');
  }

  fs.writeFileSync(filePath, content);
  console.log(`\x1b[32mTasks exported to ${filePath}\x1b[0m`);
}

function importTasks(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log('\x1b[31mFile not found:\x1b[0m', filePath);
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const existingTasks = loadTasks();
  let newTasks = [];

  if (ext === '.csv') {
    const lines = fileContent.trim().split('\n').slice(1); // skip header
    newTasks = lines.map(line => {
      const [id, title, description, dueDate, status, priority, createdAt] = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(val => val.replace(/^"|"$/g, ''));
      return {
        id: Number(id),
        title,
        description,
        dueDate,
        status,
        priority,
        createdAt
      };
    });
  } else {
    console.log('\x1b[33mImport from .txt not supported yet. Use .csv format.\x1b[0m');
    return;
  }

  // Prevent duplicate IDs
  const maxId = existingTasks.reduce((max, t) => Math.max(max, t.id), 0);
  newTasks.forEach((t, index) => {
    t.id = maxId + index + 1;
  });

  saveTasks([...existingTasks, ...newTasks]);
  console.log(`\x1b[32mImported ${newTasks.length} tasks from ${filePath}\x1b[0m`);
}

function showHelp() {
  console.log(`
\x1b[1mTo-Do CLI - Usage Guide\x1b[0m

\x1b[36mCommands:\x1b[0m

  \x1b[33madd\x1b[0m         Add a new task
    --title "Task Title"         (required)
    --desc "Task description"    (optional)
    --due "YYYY-MM-DD"           (optional)
    --priority low|medium|high   (optional)

  \x1b[33mlist\x1b[0m        Show all tasks
    --status pending|done        (optional)
    --due "YYYY-MM-DD"           (optional)
    --priority low|medium|high   (optional)
    --sort due|created           (optional)

  \x1b[33mdone\x1b[0m        Mark task as done
    --id <task_id>

  \x1b[33mupdate\x1b[0m      Update task info
    --id <task_id>
    --title "New title"          (optional)
    --due "YYYY-MM-DD"           (optional)
    --priority low|medium|high   (optional)

  \x1b[33mdelete\x1b[0m      Delete a task by ID
    --id <task_id>

  \x1b[33mremind\x1b[0m      Show tasks due within 24 hours

  \x1b[33mexport\x1b[0m      Export tasks
    --format txt|csv             (optional, default: txt)

  \x1b[33mimport\x1b[0m      Import tasks from file
    --file <path/to/file.csv>

  \x1b[33marchive\x1b[0m     Move completed tasks to archive.json

  \x1b[33mcleanup\x1b[0m     Alias for archive

  \x1b[33mhelp\x1b[0m        Show this help message

\x1b[36mExamples:\x1b[0m

  node index.js add --title "Buy milk" --due "2025-05-20"
  node index.js list --status pending --sort due
  node index.js done --id 2
  node index.js update --id 3 --title "Submit project" --priority high
  node index.js delete --id 5
  node index.js export --format csv
  node index.js import --file ./exports/tasks.csv
  node index.js remind
  node index.js help
`);
}


module.exports = {
  addTask,
  listTasks,
  markTaskAsDone,
  deleteTask,
  updateTask,
  archiveTasks,
  cleanupTasks,
  remindTasks,
  exportTasks,
  importTasks,
  showHelp
};