const Task = require("../models/task");
const Project = require("../models/project");
const ProjectMember = require("../models/project_member");
const User = require("../models/user");


// CREATE TASK
const createTask = async (req, res) => {
    try {
        const { title, description, projectUUID, dueDate } = req.body;

        if (!title || !projectUUID) {
            return res.status(400).json({ message: "Title and project are required" });
        }

        // Find project using UUID
        const project = await Project.findOne({ uuid: projectUUID });
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Check if user is part of project
        const member = await ProjectMember.findOne({
            userId: req.user.id,
            projectId: project._id
        });

        if (!member) {
            return res.status(403).json({ message: "You are not part of this project" });
        }

        const task = await Task.create({
            title,
            description,
            projectId: project._id,
            dueDate
        });

        res.status(201).json({
            message: "Task created",
            task
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



// ASSIGN TASK
const assignTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { email } = req.body;

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if user belongs to same project
        const member = await ProjectMember.findOne({
            userId: user._id,
            projectId: task.projectId
        });

        if (!member) {
            return res.status(400).json({ message: "User not in this project" });
        }

        task.assignedTo = user._id;
        await task.save();

        res.json({ message: "Task assigned", task });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



// UPDATE TASK STATUS
const updateTaskStatus = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { status } = req.body;

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Only assigned user can update
        if (task.assignedTo?.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not allowed to update this task" });
        }

        task.status = status;
        await task.save();

        res.json({ message: "Status updated", task });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



// GET TASKS BY PROJECT
const getProjectTasks = async (req, res) => {
    try {
        const { projectUUID } = req.params;

        const project = await Project.findOne({ uuid: projectUUID });
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const tasks = await Task.find({ projectId: project._id })
            .populate("assignedTo", "name email");

        res.json({ tasks });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



// DASHBOARD 
const getDashboard = async (req, res) => {
    try {
        const tasks = await Task.find({ assignedTo: req.user.id });

        const summary = {
            total: tasks.length,
            todo: tasks.filter(t => t.status === "Todo").length,
            inProgress: tasks.filter(t => t.status === "In Progress").length,
            done: tasks.filter(t => t.status === "Done").length,
            overdue: tasks.filter(t => t.dueDate && t.dueDate < new Date()).length
        };

        res.json({ summary, tasks });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


module.exports = {
    createTask,
    assignTask,
    updateTaskStatus,
    getProjectTasks,
    getDashboard
};