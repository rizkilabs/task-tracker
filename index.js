const { addTask, listTasks, markTaskAsDone } = require('./todo');

const [, , command, ...args] = process.argv;

if (command === 'add') {
  const parsedArgs = parseArgs(args);
  if (!parsedArgs.title || !parsedArgs.due) {
    console.log('Missing required --title and/or --due');
    process.exit(1);
  }
  addTask(parsedArgs.title, parsedArgs.due);

} else if (command === 'list') {
  listTasks();

} else if (command === 'done') {
  const parsedArgs = parseArgs(args);
  if (!parsedArgs.id) {
    console.log('Please provide --id to mark as done');
    process.exit(1);
  }
  markTaskAsDone(parsedArgs.id);

} else {
  console.log('Usage:');
  console.log('  node index.js add --title "Task" --due "YYYY-MM-DD"');
  console.log('  node index.js list');
  console.log('  node index.js done --id <taskId>');
}

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
