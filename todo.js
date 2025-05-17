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

module.exports = { addTask, listTasks };
