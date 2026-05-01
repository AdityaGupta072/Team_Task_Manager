const Project = require("../models/project");
const ProjectMember = require("../models/project_member");
const User = require("../models/user");
const { v4: uuidv4 } = require("uuid");


// CREATE PROJECT
const createProject = async (req, res) => {
    try {
        const { projectName, description } = req.body;

        if (!projectName) {
            return res.status(400).json({ message: "Project name is required" });
        }

        // Generate UUID for external usage
        const projectUUID = uuidv4();

        // Create project
        const project = await Project.create({
            uuid: projectUUID,
            name:projectName,
            description,
            createdBy: req.user.id
        });

        // Add creator as ADMIN in ProjectMember
        await ProjectMember.create({
            userId: req.user.id,
            projectId: project._id,
            role: "ADMIN"
        });

        res.status(201).json({
            message: "Project created successfully",
            project
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



// ADD MEMBER TO PROJECT
const addMember = async (req, res) => {
    try {
        const { email } = req.body;
        const { projectId } = req.params;

        // Check if project exists
        const project = await Project.findOne({ uuid: projectId });
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Check if current user is ADMIN
        const isAdmin = await ProjectMember.findOne({
            userId: req.user.id,
            projectId: project._id,
            role: "ADMIN"
        });

        if (!isAdmin) {
            return res.status(403).json({ message: "Only admin can add members" });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Prevent duplicate entry
        const alreadyMember = await ProjectMember.findOne({
            userId: user._id,
            projectId: project._id
        });

        if (alreadyMember) {
            return res.status(400).json({ message: "User already part of project" });
        }

        // Add member
        await ProjectMember.create({
            userId: user._id,
            projectId: project._id,
            role: "MEMBER"
        });

        res.json({ message: "Member added successfully" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



// 🟢 GET MY PROJECTS
const getMyProjects = async (req, res) => {
    try {
        const memberships = await ProjectMember.find({
            userId: req.user.id
        }).populate("projectId");

        const projects = memberships.map(m => ({
            project: m.projectId,
            role: m.role
        }));

        res.json({ projects });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


module.exports = {
    createProject,
    addMember,
    getMyProjects
};