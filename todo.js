const { loadTasks, saveTasks } = require('./storage');

function addTask(title, description) {
  const tasks = loadTasks();
  const newTask = {
    id: Date.now(),
    title,
    description,
    dueDate: null,
    status: 'pending'
  };
  tasks.push(newTask);
  saveTasks(tasks);
  console.log('Task added:', newTask);
}

function listTasks() {
  const tasks = loadTasks();
  if (tasks.length === 0) {
    console.log('No tasks found.');
    return;
  }
  tasks.forEach((task, index) => {
    console.log(`${index + 1}. [${task.status}] ${task.title}`);
  });
}

module.exports = { addTask, listTasks };
