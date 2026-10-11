
const validateTask = require("./middleware/validateTask");
const express = require("express");
const cors = require("cors");
const cache = require("./cache/cache");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const taskEvents = require("./events");
require("./listeners");

const Task = require("./models/Task");
const User = require("./models/User");
const auth = require("./middleware/auth");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Register
app.post("/register", async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password are required"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                error: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            password: hashedPassword
        });

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                email: user.email
            }
        });
    } catch (err) {
        next(err);
    }
});

// Login
app.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            message: "Login successful",
            token
        });
    } catch (err) {
        next(err);
    }
});

// Get all tasks
app.get("/tasks", auth, async (req, res, next) => {
    try {
        const cachedTasks = cache.get("tasks");

        if (cachedTasks) {
            return res.status(200).json(cachedTasks);
        }

        const tasks = await Task.find();

        cache.set("tasks", tasks);

        return res.status(200).json(tasks);
    } catch (err) {
        next(err);
    }
});

// Create a task
app.post("/tasks", auth, validateTask, async (req, res, next) => {
    try {
        const task = await Task.create(req.body);

        cache.del("tasks");

        setImmediate(() => {
            taskEvents.emit("taskCreated", task);
        });

        return res.status(201).json(task);
    } catch (err) {
        next(err);
    }
});

// Update a task
app.put("/tasks/:id", auth, async (req, res, next) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!task) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        cache.del("tasks");

        return res.status(200).json(task);
    } catch (err) {
        next(err);
    }
});

// Delete a task
app.delete("/tasks/:id", auth, async (req, res, next) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        cache.del("tasks");

        setImmediate(() => {
            taskEvents.emit("taskDeleted", task);
        });

        return res.status(200).json({
            message: "Task deleted successfully"
        });
    } catch (err) {
        next(err);
    }
});

// Health check
app.get("/health", (req, res) => {
    return res.status(200).json({
        status: "ok"
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: "Route not found"
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack || err);

    if (res.headersSent) {
        return next(err);
    }

    return res.status(500).json({
        error: "Internal server error"
    });
});

// Export the Express app for testing
module.exports = app;
