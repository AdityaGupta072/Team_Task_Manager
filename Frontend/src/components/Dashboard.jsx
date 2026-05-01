import { useEffect, useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // email per project
  const [emails, setEmails] = useState({});

  const fetchProjects = async () => {
    const res = await API.get("/projects/my");
    setProjects(res.data.projects);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // ✅ CREATE PROJECT
  const createProject = async () => {
    if (!name.trim() || !description.trim()) {
      alert("Enter all fields");
      return;
    }

    try {
      await API.post("/projects", {
        projectName: name,
        description
      });

      setName("");
      setDescription("");
      fetchProjects();
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  // 👥 ADD MEMBER
  const addMember = async (projectUUID) => {
    try {
      await API.post(`/projects/${projectUUID}/add-member`, {
        email: emails[projectUUID]
      });

      alert("Member added");
      setEmails({ ...emails, [projectUUID]: "" });
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

      {/* 🔹 CREATE PROJECT */}
      <div className="flex gap-2 mb-6">
        <input
          className="border p-2 rounded"
          placeholder="Project Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="border p-2 rounded"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          onClick={createProject}
          className="bg-green-500 text-white px-4 rounded"
        >
          Create
        </button>
      </div>

      {/* 🔥 PROJECT LIST */}
      <div className="space-y-4">
        {projects.map((p, i) => (
          <div key={i} className="border p-4 rounded shadow">

            <Link
              to={`/project/${p.project.uuid}`}
              className="text-lg font-semibold text-blue-600"
            >
              {p.project.name}
            </Link>

            <p className="text-sm text-gray-600">
              {p.project.description}
            </p>

            <p className="text-sm mt-1">
              Role: <b>{p.role}</b>
            </p>

            {/* 👥 ADD MEMBER (ONLY ADMIN) */}
            {p.role === "ADMIN" && (
              <div className="flex gap-2 mt-3">
                <input
                  className="border p-1 rounded"
                  placeholder="Enter member email"
                  value={emails[p.project.uuid] || ""}
                  onChange={(e) =>
                    setEmails({
                      ...emails,
                      [p.project.uuid]: e.target.value
                    })
                  }
                />

                <button
                  onClick={() => addMember(p.project.uuid)}
                  className="bg-blue-500 text-white px-3 rounded"
                >
                  Add Member
                </button>
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}