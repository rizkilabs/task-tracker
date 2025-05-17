const {
  addTask,
  listTasks,
  markTaskAsDone,
  deleteTask,
  updateTask
} = require('./todo');

const [, , command, ...args] = process.argv;
const options = parseArgs(args);

switch (command) {
  case 'add':
    if (!options.title || !options.due) {
      return console.log('Usage: add --title "Task title" --due "YYYY-MM-DD"');
    }
    addTask(options.title, options.due);
    break;

  case 'list':
    listTasks();
    break;

  case 'done':
    if (!options.id) {
      return console.log('Usage: done --id <taskId>');
    }
    markTaskAsDone(options.id);
    break;

  case 'delete':
    if (!options.id) {
      return console.log('Usage: delete --id <taskId>');
    }
    deleteTask(options.id);
    break;

  case 'update':
    if (!options.id || (!options.title && !options.due)) {
      return console.log('Usage: update --id <taskId> [--title "New title"] [--due "YYYY-MM-DD"]');
    }
    updateTask(options.id, { title: options.title, dueDate: options.due });
    break;

  default:
    printHelp();
    break;
}

// Helper to parse CLI args into an object
function parseArgs(args) {
  const result = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].substring(2);
      result[key] = args[i + 1];
      i++;
    }
  }
  return result;
}

// Help message
function printHelp() {
  console.log('\nUsage:');
  console.log('  node index.js add --title "Task" --due "YYYY-MM-DD"');
  console.log('  node index.js list');
  console.log('  node index.js done --id <taskId>');
  console.log('  node index.js delete --id <taskId>');
  console.log('  node index.js update --id <taskId> [--title "New title"] [--due "YYYY-MM-DD"]\n');
}
