const { addTask, listTasks } = require('./todo');
const [,, command, ...args] = process.argv;

switch (command) {
  case 'add':
    const [title, ...rest] = args;
    const description = rest.join(' ');
    addTask(title, description);
    break;

  case 'list':
    listTasks();
    break;

  default:
    console.log('Usage:');
    console.log('  node index.js add "Title" "Description"');
    console.log('  node index.js list');
}
