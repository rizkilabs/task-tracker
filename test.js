const assert = require('assert');
const fs = require('fs');
const { readTasks, writeTasks } = require('./storage');
const {
  addTask,
  deleteTask,
  updateTask,
  markDone
} = require('./todo');

// === Setup: Clean the tasks file before tests ===
writeTasks([]);

// === Test: Add Task ===
addTask({ title: 'Test Task', due: '2025-06-01', priority: 'medium' });
let tasks = readTasks();
assert.strictEqual(tasks.length, 1, 'Task should be added');
assert.strictEqual(tasks[0].title, 'Test Task', 'Title should match');

// === Test: Update Task ===
updateTask(tasks[0].id, { title: 'Updated Task', due: '2025-06-02' });
tasks = readTasks();
assert.strictEqual(tasks[0].title, 'Updated Task', 'Title should be updated');
assert.strictEqual(tasks[0].dueDate, '2025-06-02', 'Due date should be updated');

// === Test: Mark as Done ===
markDone(tasks[0].id);
tasks = readTasks();
assert.strictEqual(tasks[0].status, 'done', 'Task should be marked as done');

// === Test: Delete Task ===
deleteTask(tasks[0].id);
tasks = readTasks();
assert.strictEqual(tasks.length, 0, 'Task should be deleted');

console.log('✅ All tests passed!');
