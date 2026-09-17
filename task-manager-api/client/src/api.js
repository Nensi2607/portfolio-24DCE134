const BASE_URL = "http://localhost:5000";

const getAuthHeaders = () => {
    const token = localStorage.getItem("taskManagerToken");

    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
};

export const registerUser = async (email, password) => {
    const response = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Registration failed");
    }

    return data;
};

export const loginUser = async (email, password) => {
    const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Login failed");
    }

    return data;
};

export const getTasks = async () => {
    const response = await fetch(`${BASE_URL}/tasks`, {
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch tasks");
    }

    return response.json();
};

export const createTask = async (task) => {
    const response = await fetch(`${BASE_URL}/tasks`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(task)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create task");
    }

    return response.json();
};

export const updateTask = async (id, task) => {
    const response = await fetch(`${BASE_URL}/tasks/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(task)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update task");
    }

    return response.json();
};

export const deleteTask = async (id) => {
    const response = await fetch(`${BASE_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete task");
    }

    return response.json();
};