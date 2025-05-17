const { loadTasks, saveTasks } = require('./storage');

const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';

function addTask(title, dueDate) {
  const tasks = loadTasks();

  const newTask = {
    id: Date.now(),
    title,
    description: '',
    dueDate,
    status: 'pending'
  };

  tasks.push(newTask);
  saveTasks(tasks);
  console.log(`${GREEN}✔ Task added successfully!${RESET}`, newTask);
}

/**
 * Display all tasks grouped by status: pending and done
 */
function listTasks() {
  const tasks = loadTasks();

  if (tasks.length === 0) {
    console.log('No tasks found.');
    return;
  }

  const pending = tasks.filter(task => task.status === 'pending');
  const done = tasks.filter(task => task.status === 'done');

  console.log(`${YELLOW}\nPending Tasks:${RESET}`);
  if (pending.length === 0) {
    console.log('  (none)');
  } else {
    pending.forEach(task => {
      console.log(`${[task.id].padEnd(15)} ${[task.title].padEnd(30)} ${[task.dueDate].padEnd(15)} Status`);
    });
  }

  console.log(`${GREEN}\nCompleted Tasks:${RESET}`);
  if (done.length === 0) {
    console.log('  (none)');
  } else {
    done.forEach(task => {
      console.log(`- [${task.id}] ${task.title} (done)`);
    });
  }

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