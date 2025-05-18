# 📝 Task Tracker

A simple command-line to-do list manager built with Node.js using only built-in modules — no external libraries.

## 🚀 Features

- Add, update, delete, complete, and list tasks
- Supports priorities (low, medium, high)
- Filter by status, due date, or priority
- Archive completed tasks
- Export/import tasks to `.txt` or `.csv`
- Terminal color output for better UX
- Local due-date reminder (within 24h)

## 📷 Screenshot

![Task Tracker Screenshot](https://i.imgur.com/F3fpN8K.png)

## 📦 Requirements

- Node.js (v12+)

## 📄 Usage

### Add a task

```bash
node index.js add --title "Buy milk" --due "2025-06-01" --priority high
````

### List tasks

```bash
node index.js list
node index.js list --status pending
node index.js list --due 2025-06-01
node index.js list --priority high
node index.js list --sort dueAsc
```

### Mark task as done

```bash
node index.js done --id 3
```

### Delete a task

```bash
node index.js delete --id 2
```

### Update a task

```bash
node index.js update --id 1 --title "New title" --due "2025-06-02"
```

### Archive completed tasks

```bash
node index.js archive
```

### Export and Import

```bash
node index.js export --format txt
node index.js import --file tasks.csv
```

### Show help

```bash
node index.js help
```

### Show version

```bash
node index.js --version
```

---

## 📁 File Structure

```
.
├── index.js         # CLI command handler
├── todo.js          # Core task logic
├── storage.js       # File read/write helpers
├── tasks.json       # Task database (auto-generated)
├── archive.json     # Archived completed tasks
├── README.md
└── .gitignore
```

---

## 🌐 License

MIT
