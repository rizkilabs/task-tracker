const {
  addTask,
  listTasks,
  markTaskAsDone,
  deleteTask,
  updateTask
} = require('./todo');

const [, , command, ...args] = process.argv;
const options = parseArgs(args);
const confirm = require('readline').createInterface({ input: process.stdin, output: process.stdout });
const { exec } = require('child_process');

exec('node index.js list', (err, stdout, stderr) => {
  if (stdout.includes('Pending Tasks')) console.log('PASS');
});

switch (command) {
  case 'add':
    if (!options.title) showError('--title is required.');
    if (!options.due) {
      return console.log('Error: --due is required.');
    }
    if (!isValidDate(options.due)) {
      return console.log('Error: Invalid --due date. Use format YYYY-MM-DD.');
    }
    addTask(options.title, options.due);
    break;

  case 'list':
    listTasks({
      status: options.status,
      dueDate: options.due,
      sortBy: options.sort // e.g., 'due', 'due-desc', 'created'
    });
    break;

  case 'done':
    if (!options.id || isNaN(Number(options.id))) {
      console.log('Error: --id is required and must be a valid number.');
      return;
    }
    markTaskAsDone(options.id);
    break;

  case 'delete':
    if (!options.id || isNaN(Number(options.id))) {
      console.log('Error: --id is required and must be a valid number.');
      return;
    }
    confirm.question('Are you sure? (y/n): ', answer => {
      if (answer.toLowerCase() === 'y') deleteTask(options.id);
      confirm.close();
    });

    break;

  case 'update':
    if (!options.id || isNaN(Number(options.id))) {
      console.log('Error: --id is required and must be a valid number.');
      return;
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

function isValidDate(dateStr) {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr)) return false;
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

function showError(message) {
  console.error(`\x1b[31mError:\x1b[0m ${message}`);
  process.exit(1);
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
