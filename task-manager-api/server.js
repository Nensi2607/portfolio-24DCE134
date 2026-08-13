const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const Task = require("./models/Task");

const app = express();

// Middleware to read JSON data
app.use(express.json());

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.log("MongoDB connection error:", err);
    });

// Logging middleware
app.use((req, res, next) => {
    console.log(
        `${req.method} ${req.url} - ${new Date().toISOString()}`
    );

    next();
});

// ====================
// GET ALL TASKS
// ====================
app.get("/tasks", async (req, res, next) => {
    try {
        const tasks = await Task.find();

        res.status(200).json(tasks);
    } catch (err) {
        next(err);
    }
});

// ====================
// CREATE TASK
// ====================
app.post("/tasks", async (req, res, next) => {
    try {
        const task = await Task.create({
            title: req.body.title,
            description: req.body.description,
            completed: req.body.completed
        });

        res.status(201).json(task);
    } catch (err) {
        next(err);
    }
});

// ====================
// UPDATE TASK
// ====================
app.put("/tasks/:id", async (req, res, next) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!task) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        res.status(200).json(task);
    } catch (err) {
        next(err);
    }
});

// ====================
// DELETE TASK
// ====================
app.delete("/tasks/:id", async (req, res, next) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        res.status(200).json(task);
    } catch (err) {
        next(err);
    }
});

// ====================
// 404 HANDLER
// ====================
app.use((req, res) => {
    res.status(404).json({
        error: "Route not found"
    });
});

// ====================
// GLOBAL ERROR HANDLER
// ====================
app.use((err, req, res, next) => {
    console.error(err);

    // Mongoose validation error
    if (err.name === "ValidationError") {
        return res.status(400).json({
            error: "Validation failed",
            details: Object.values(err.errors).map(
                (error) => error.message
            )
        });
    }

    // Invalid MongoDB ID
    if (err.name === "CastError") {
        return res.status(400).json({
            error: "Invalid task ID"
        });
    }

    // Other errors
    res.status(500).json({
        error: "Something went wrong"
    });
});

// Start server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});