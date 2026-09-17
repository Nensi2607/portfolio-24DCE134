
import "./App.css";
import { useEffect, useState } from "react";
import {
    getTasks,
    createTask,
    updateTask,
    deleteTask
} from "./api";

function App() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // GET tasks
    useEffect(() => {
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
    }, []);

    // POST task
    const handleCreate = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            setError("Title is required");
            return;
        }

        try {
            setError("");

            const newTask = await createTask({
                title,
                description
            });

            setTasks((prev) => [...prev, newTask]);

            setTitle("");
            setDescription("");

            alert("Task created successfully");
        } catch (err) {
            setError(err.message);
        }
    };

    // PUT task
    const handleUpdate = async (task) => {
        try {
            setError("");

            const updatedTask = await updateTask(task._id, {
                completed: !task.completed
            });

            setTasks((prev) =>
                prev.map((item) =>
                    item._id === updatedTask._id
                        ? updatedTask
                        : item
                )
            );

            alert("Task updated successfully");
        } catch (err) {
            setError(err.message);
        }
    };

    // DELETE task
    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this task?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            await deleteTask(id);

            setTasks((prev) =>
                prev.filter((task) => task._id !== id)
            );

            alert("Task deleted successfully");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="app">
            <div className="container">
                <header className="header">
                    <h1>Task Manager</h1>
                    <p>Stay organized and keep track of your work.</p>
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
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
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
                            className={`task-card ${
                                task.completed ? "completed" : ""
                            }`}
                        >
                            <div className="task-top">
                                <div>
                                    <h3 className="task-title">{task.title}</h3>
                                    <p className="task-description">
                                        {task.description || "No description provided."}
                                    </p>
                                </div>

                                <span
                                    className={`status ${
                                        task.completed ? "completed" : "pending"
                                    }`}
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
                                    {task.completed
                                        ? "Mark Pending"
                                        : "Mark Completed"}
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
