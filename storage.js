const fs = require('fs');
const path = require('path');

const TASKS_FILE = path.join(__dirname, 'tasks.json');
const ARCHIVE_FILE = path.join(__dirname, 'archive.json');

// === Read tasks from file ===
function readTasks() {
    try {
        if (!fs.existsSync(TASKS_FILE)) return [];
        const data = fs.readFileSync(TASKS_FILE, 'utf8');
        return JSON.parse(data || '[]');
    } catch (err) {
        console.error('Error reading tasks file:', err.message);
        return [];
    }
}

// === Write tasks to file ===
function writeTasks(tasks) {
    try {
        fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
    } catch (err) {
        console.error('Error writing tasks file:', err.message);
    }
}

// === Read archived tasks ===
function readArchivedTasks() {
    try {
        if (!fs.existsSync(ARCHIVE_FILE)) return [];
        const data = fs.readFileSync(ARCHIVE_FILE, 'utf8');
        return JSON.parse(data || '[]');
    } catch (err) {
        console.error('Error reading archive file:', err.message);
        return [];
    }
}

// === Write archived tasks ===
function writeArchivedTasks(tasks) {
    try {
        fs.writeFileSync(ARCHIVE_FILE, JSON.stringify(tasks, null, 2));
    } catch (err) {
        console.error('Error writing archive file:', err.message);
    }
}

module.exports = {
    readTasks,
    writeTasks,
    readArchivedTasks,
    writeArchivedTasks
};
