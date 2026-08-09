const express = require("express");

const app = express();

app.use(express.json());


// In-memory task storage
let tasks = [
    {
        id: 1,
        title: "Learn React",
        completed: false
    },
    {
        id: 2,
        title: "Build REST API",
        completed: false
    }
];


// Logging middleware
app.use((req, res, next) => {

    console.log(
        `${req.method} ${req.url} - ${new Date().toISOString()}`
    );

    next();
});


// GET - Get all tasks
app.get("/tasks", (req, res) => {

    res.status(200).json(tasks);

});


// POST - Create a task
app.post("/tasks", (req, res) => {

    const newTask = {
        id: tasks.length + 1,
        title: req.body.title,
        completed: false
    };

    tasks.push(newTask);

    res.status(201).json(newTask);

});


// PUT - Update a task
app.put("/tasks/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const task = tasks.find(task => task.id === id);

    if (!task) {
        return res.status(404).json({
            error: "Task not found"
        });
    }

    task.title = req.body.title ?? task.title;
    task.completed = req.body.completed ?? task.completed;

    res.status(200).json(task);

});


// DELETE - Delete a task
app.delete("/tasks/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const index = tasks.findIndex(task => task.id === id);

    if (index === -1) {
        return res.status(404).json({
            error: "Task not found"
        });
    }

    const deletedTask = tasks.splice(index, 1);

    res.status(200).json(deletedTask[0]);

});


// Global error handling middleware
app.use((err, req, res, next) => {

    console.error(err.stack);

    res.status(500).json({
        error: "Something went wrong"
    });

});


// Start server
app.listen(5000, () => {

    console.log("Server running on port 5000");

});