const { loadTasks, saveTasks } = require('./storage');

const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';

function addTask(title, dueDate) {
  const tasks = loadTasks();
  const id = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;

  const task = {
    id,
    title,
    description: '',
    dueDate,
    status: 'pending',
    createdAt: new Date().toISOString() // NEW
  };

  tasks.push(task);
  saveTasks(tasks);
  console.log('\x1b[32mTask added successfully!\x1b[0m');
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
  const { status, dueDate, sortBy } = filters;

  // Filter
  if (status) tasks = tasks.filter(t => t.status === status.toLowerCase());
  if (dueDate) tasks = tasks.filter(t => t.dueDate === dueDate);

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
    const isDone = task.status === 'done';
    const now = new Date();
    const due = new Date(task.dueDate);
    const statusColor = isDone
      ? '\x1b[32m' // Green
      : (due < now ? '\x1b[31m' : '\x1b[33m'); // Red if overdue, yellow otherwise

    const statusIcon = isDone ? '✔' : '•';
    const line = `${statusIcon} [${task.id}] ${task.title} (due: ${task.dueDate})`;

    console.log(colorText(line, statusColor));
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

module.exports = {
  addTask,
  listTasks,
  markTaskAsDone,
  deleteTask,
  updateTask
};