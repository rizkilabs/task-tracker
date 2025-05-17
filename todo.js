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

module.exports = { addTask };
