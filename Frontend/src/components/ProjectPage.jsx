import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";

export default function ProjectPage() {
  const { id } = useParams();

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // store email per task
  const [emails, setEmails] = useState({});

  // 🔐 get logged-in user id from token
  const token = localStorage.getItem("token");
  const currentUserId = token
    ? JSON.parse(atob(token.split(".")[1])).id
    : null;

  // 🔄 Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await API.get(`/tasks/project/${id}`);
      setTasks(res.data.tasks);
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ✅ CREATE TASK
  const createTask = async () => {
    if (!title.trim()) {
      alert("Title required");
      return;
    }

    try {
      await API.post("/tasks", {
        title,
        description,
        projectUUID: id
      });

      setTitle("");
      setDescription("");
      fetchTasks();
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  // 👤 ASSIGN TASK USING EMAIL
  const assignTask = async (taskId) => {
    try {
      await API.post(`/tasks/${taskId}/assign`, {
        email: emails[taskId]
      });

      setEmails((prev) => ({ ...prev, [taskId]: "" }));
      fetchTasks();
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  // 🔄 UPDATE STATUS (ONLY ASSIGNED USER)
  const updateStatus = async (taskId, status) => {
    try {
      await API.patch(`/tasks/${taskId}/status`, { status });
      fetchTasks();
    } catch (err) {
      console.log("STATUS ERROR:", err.response?.data);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Project Tasks</h2>

      {/* 🟢 CREATE TASK */}
      <div className="flex gap-2 mb-6">
        <input
          className="border p-2 rounded"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="border p-2 rounded"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          onClick={createTask}
          className="bg-green-500 text-white px-4 rounded"
        >
          Add Task
        </button>
      </div>

      {/* 🔥 TASK LIST */}
      <div className="space-y-4">
        {tasks.map((t) => (
          <div key={t._id} className="border p-4 rounded shadow-sm">

            <h3 className="font-semibold text-lg">{t.title}</h3>
            <p className="text-sm text-gray-600">{t.description}</p>

            <p className="mt-1">
              <span className="font-medium">Assigned:</span>{" "}
              {t.assignedTo ? t.assignedTo.name : "Not Assigned"}
            </p>

            <p>
              <span className="font-medium">Status:</span> {t.status || "Todo"}
            </p>

            {/* 👤 ASSIGN SECTION */}
            <div className="flex gap-2 mt-3">
              <input
                className="border p-1 rounded"
                placeholder="Enter email"
                value={emails[t._id] || ""}
                onChange={(e) =>
                  setEmails({ ...emails, [t._id]: e.target.value })
                }
              />

              <button
                className="bg-blue-500 text-white px-3 rounded"
                onClick={() => assignTask(t._id)}
              >
                Assign
              </button>
            </div>

            {/* 🔄 STATUS CHANGE (ONLY IF YOU ARE ASSIGNED) */}
            {t.assignedTo?._id === currentUserId && (
              <div className="mt-3">
                <select
                  value={t.status}
                  onChange={(e) => updateStatus(t._id, e.target.value)}
                  className="border p-1 rounded"
                >
                  <option>Todo</option>
                  <option>In Progress</option>
                  <option>Done</option>
                </select>
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}