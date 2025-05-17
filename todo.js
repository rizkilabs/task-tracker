const { loadTasks, saveTasks } = require('./storage');

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
  console.log('Task added:', newTask);
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

  console.log('\n=== PENDING TASKS ===');
  if (pending.length === 0) {
    console.log('  (none)');
  } else {
    pending.forEach(task => {
      console.log(`- [${task.id}] ${task.title} (due: ${task.dueDate})`);
    });
  }

  console.log('\n=== DONE TASKS ===');
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

module.exports = { addTask, listTasks, markTaskAsDone };
