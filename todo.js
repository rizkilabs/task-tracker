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

// function createTask(title, description, dueDate) {
//   return {
//     id: Date.now(), // Unique ID based on timestamp
//     title,
//     description,
//     dueDate,
//     status: "pending"
//   };
// }

// // Example usage
// const newTask = createTask("Read a book", "Read 'Clean Code'", "2025-05-20");
// console.log(newTask);


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

// const task = {
//   id: Date.now(), // or use a custom ID generator
//   title: "Example Task",
//   description: "This is a sample task description.",
//   dueDate: "2025-05-20", // Use ISO format (YYYY-MM-DD)
//   status: "pending" // or "done"
// };


module.exports = { addTask, listTasks };
