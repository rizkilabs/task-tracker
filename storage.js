const fs = require('fs');
const path = './tasks.json';

/**
 * Load tasks from tasks.json file
 * @returns {Array} Array of task objects
 */
function loadTasks() {
    try {
        if (!fs.existsSync(path)) {
            // If file doesn't exist, create it with an empty array
            fs.writeFileSync(path, '[]');
        }

        const data = fs.readFileSync(path, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading tasks.json:', err.message);
        return [];
    }
}

/**
 * Save tasks array to tasks.json file
 * @param {Array} tasks - Array of task objects
 */
function saveTasks(tasks) {
    try {
        fs.writeFileSync(path, JSON.stringify(tasks, null, 2));
    } catch (err) {
        console.error('Error writing to tasks.json:', err.message);
    }
}

module.exports = { loadTasks, saveTasks };
