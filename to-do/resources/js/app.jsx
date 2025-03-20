import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = "http://127.0.0.1:8000/api/tasks";

const App = () => {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [search, setSearch] = useState("");
    const [sortOrder, setSortOrder] = useState("desc");
    const [filterStatus, setFilterStatus] = useState("all");
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editedTitle, setEditedTitle] = useState("");

    useEffect(() => {
        fetchTasks();
    }, [search, sortOrder, filterStatus]);

    const fetchTasks = async () => {
        try {
            const { data } = await axios.get(`${API_URL}?search=${search}&sort=${sortOrder}&status=${filterStatus}`);
            setTasks(data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const addTask = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        try {
            const { data } = await axios.post(API_URL, { title });
            setTasks([...tasks, data]);
            setTitle("");
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    const toggleTask = async (id) => {
        try {
            const { data } = await axios.patch(`${API_URL}/${id}/toggle`);
            setTasks(tasks.map(task => (task.id === id ? data : task)));
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const deleteTask = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            setTasks(tasks.filter(task => task.id !== id));
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const startEditing = (task) => {
        setEditingTaskId(task.id);
        setEditedTitle(task.title);
    };

    const saveTitle = async (id) => {
        try {
            const { data } = await axios.patch(`${API_URL}/${id}`, { title: editedTitle });
            setTasks(tasks.map(task => (task.id === id ? data : task)));
            setEditingTaskId(null);
        } catch (error) {
            console.error("Error updating title:", error);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Task List</h2>

            {/* Search & Sort */}
            <div className="row mb-4">
                <div className="col-md-6">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search tasks..."
                        className="form-control"
                    />
                </div>
                <div className="col-md-3">
                    {/* Filter Dropdown */}
                    <select 
                        className="form-select"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">All</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>
            </div>

            {/* Add Task */}
            <form onSubmit={addTask} className="mb-4">
                <div className="input-group">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="New Task"
                        className="form-control"
                    />
                    <button type="submit" className="btn btn-success">Add</button>
                </div>
            </form>

            {/* Task List */}
            <table className="table table-bordered text-center">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th className="d-flex align-items-center justify-content-center">
                            Title
                            <div className="form-check form-switch ms-2">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={sortOrder === "asc"}
                                    onChange={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                                />
                            </div>
                        </th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.length > 0 ? (
                        tasks.map((task, index) => (
                            <tr key={task.id}>
                                <td>{index + 1}</td>
                                <td>
                                    {editingTaskId === task.id ? (
                                        <input
                                            type="text"
                                            value={editedTitle}
                                            onChange={(e) => setEditedTitle(e.target.value)}
                                            className="form-control"
                                        />
                                    ) : (
                                        <span className={task.completed ? "text-decoration-line-through" : ""}>
                                            {task.title}
                                        </span>
                                    )}
                                </td>
                                <td>
                                    <button
                                        onClick={() => toggleTask(task.id)}
                                        className={`btn btn-sm ${task.completed ? "btn-success" : "btn-secondary"}`}
                                    >
                                        {task.completed ? "Completed" : "Pending"}
                                    </button>
                                </td>
                                <td>
                                    {editingTaskId === task.id ? (
                                        <button
                                            onClick={() => saveTitle(task.id)}
                                            className="btn btn-primary btn-sm"
                                        >
                                            Save
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => startEditing(task)}
                                            className="btn btn-warning btn-sm"
                                        >
                                            Edit
                                        </button>
                                    )}
                                    <button onClick={() => deleteTask(task.id)} className="btn btn-danger btn-sm ms-2">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center text-muted">No tasks found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

createRoot(document.getElementById("app")).render(<App />);
