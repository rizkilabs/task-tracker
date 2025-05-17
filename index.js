const { addTask, listTasks } = require('./todo');

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

} else {
  console.log('Usage:');
  console.log('  node index.js add --title "Task" --due "YYYY-MM-DD"');
  console.log('  node index.js list');
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
