#!/usr/bin/env node

const {
  addTask,
  listTasks,
  markDone,
  deleteTask,
  updateTask,
  showHelp,
  remindTasks,
  archiveTasks,
  exportTasks,
  importTasks
} = require('./todo');
const fs = require('fs');
const path = require('path');

// === Helper: Parse CLI arguments ===
function parseArgs(argv) {
  const args = {};
  let key = null;

  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      key = arg.slice(2);
      args[key] = true; // default value for flags
    } else if (key) {
      args[key] = arg;
      key = null;
    }
  }

  return args;
}

// === Main ===
const args = parseArgs(process.argv);
const command = process.argv[2];

switch (command) {
  case 'add':
    addTask(args);
    break;
  case 'list':
    listTasks(args);
    break;
  case 'done':
    if (!args.id) {
      console.log('Usage: done --id <taskId>');
    } else {
      markDone(Number(args.id));
    }
    break;
  case 'delete':
    if (!args.id) {
      console.log('Usage: delete --id <taskId>');
    } else {
      deleteTask(Number(args.id));
    }
    break;
  case 'update':
    if (!args.id) {
      console.log('Usage: update --id <taskId> [--title ""] [--due "YYYY-MM-DD"] [--priority ""]');
    } else {
      updateTask(Number(args.id), args);
    }
    break;
  case 'remind':
    remindTasks();
    break;
  case 'archive':
    archiveTasks();
    break;
  case 'export':
    exportTasks(args.format);
    break;
  case 'import':
    if (!args.file) {
      console.log('Usage: import --file <path>');
    } else {
      importTasks(args.file);
    }
    break;
  case 'help':
    showHelp();
    break;
  case '--version':
  case 'version':
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json')));
    console.log(`v${pkg.version}`);
    break;
  default:
    console.log(`Unknown command: ${command}`);
    showHelp();
    break;
}
