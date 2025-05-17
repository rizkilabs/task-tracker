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

module.exports = {
  addTask,
  listTasks,
  markTaskAsDone,
  deleteTask,
  updateTask,
  archiveTasks,
  cleanupTasks
};