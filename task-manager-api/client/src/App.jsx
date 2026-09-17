
import "./App.css";
import { useEffect, useState } from "react";
import {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    registerUser,
    loginUser
} from "./api";

function App() {
    const [token, setToken] = useState(localStorage.getItem("taskManagerToken") || "");
    const [authMode, setAuthMode] = useState("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const isAuthenticated = Boolean(token);

    useEffect(() => {
        if (!token) return;

        const load = async () => {
            try {
                setLoading(true);
                setError("");
                const data = await getTasks();
                setTasks(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [token]);

    const handleAuthSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim() || !password.trim()) {
            setError("Email and password are required");
            return;
        }

        try {
            setError("");

            if (authMode === "register") {
                if (password !== confirmPassword) {
                    setError("Passwords do not match");
                    return;
                }

                await registerUser(email, password);
                setAuthMode("login");
                setError("Registration successful. Please log in.");
                setPassword("");
                setConfirmPassword("");
                return;
            }

            const data = await loginUser(email, password);
            localStorage.setItem("taskManagerToken", data.token);
            setToken(data.token);
            setPassword("");
            setConfirmPassword("");
        } catch (err) {
            setError(err.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("taskManagerToken");
        setToken("");
        setTasks([]);
        setError("");
    };

    const handleCreate = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            setError("Title is required");
            return;
        }

        try {
            setError("");
            const newTask = await createTask({ title, description });
            setTasks((prev) => [...prev, newTask]);
            setTitle("");
            setDescription("");
        } catch (err) {
            setError(err.message);
        }
    };

    const handleUpdate = async (task) => {
        try {
            setError("");
            const updatedTask = await updateTask(task._id, {
                completed: !task.completed
            });

            setTasks((prev) =>
                prev.map((item) =>
                    item._id === updatedTask._id ? updatedTask : item
                )
            );
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this task?");

        if (!confirmed) return;

        try {
            setError("");
            await deleteTask(id);
            setTasks((prev) => prev.filter((task) => task._id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="auth-screen">
                <div className="auth-card">
                    <h1>{authMode === "login" ? "Welcome back" : "Create account"}</h1>
                    <p className="auth-subtitle">
                        {authMode === "login"
                            ? "Sign in to manage your tasks."
                            : "Register to start managing tasks."}
                    </p>

                    {error && <p className="error">{error}</p>}

                    <form className="auth-form" onSubmit={handleAuthSubmit}>
                        <input
                            className="auth-field"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <input
                            className="auth-field"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        {authMode === "register" && (
                            <input
                                className="auth-field"
                                type="password"
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        )}

                        <button type="submit" className="add-btn auth-btn">
                            {authMode === "login" ? "Login" : "Register"}
                        </button>
                    </form>

                    <div className="auth-toggle">
                        <span>
                            {authMode === "login"
                                ? "Need an account?"
                                : "Already have an account?"}
                        </span>
                        <button
                            type="button"
                            className="link-btn"
                            onClick={() => {
                                setAuthMode(authMode === "login" ? "register" : "login");
                                setError("");
                                setPassword("");
                                setConfirmPassword("");
                            }}
                        >
                            {authMode === "login" ? "Register" : "Login"}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="app">
            <div className="container">
                <header className="header">
                    <h1>Task Manager</h1>
                    <p>Stay organized and keep track of your work.</p>
                    <button type="button" className="logout-btn" onClick={handleLogout}>
                        Logout
                    </button>
                </header>

                <section className="form-card">
                    <h2>Add a new task</h2>

                    <form className="task-form" onSubmit={handleCreate}>
                        <input
                            type="text"
                            placeholder="Task title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <input
                            type="text"
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <button className="add-btn" type="submit">
                            Add Task
                        </button>
                    </form>
                </section>

                {loading && <p className="loading">Loading tasks...</p>}

                {error && <p className="error">{error}</p>}

                <div className="tasks-header">
                    <h2>Tasks</h2>
                    <span className="task-count">{tasks.length} tasks</span>
                </div>

                {tasks.length === 0 && !loading && (
                    <div className="empty">No tasks found.</div>
                )}

                <div className="task-list">
                    {tasks.map((task) => (
                        <div
                            key={task._id}
                            className={`task-card ${task.completed ? "completed" : ""}`}
                        >
                            <div className="task-top">
                                <div>
                                    <h3 className="task-title">{task.title}</h3>
                                    <p className="task-description">
                                        {task.description || "No description provided."}
                                    </p>
                                </div>

                                <span
                                    className={`status ${task.completed ? "completed" : "pending"}`}
                                >
                                    {task.completed ? "Completed" : "Pending"}
                                </span>
                            </div>

                            <div className="task-actions">
                                <button
                                    type="button"
                                    className="update-btn"
                                    onClick={() => handleUpdate(task)}
                                >
                                    {task.completed ? "Mark Pending" : "Mark Completed"}
                                </button>

                                <button
                                    type="button"
                                    className="delete-btn"
                                    onClick={() => handleDelete(task._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default App;
