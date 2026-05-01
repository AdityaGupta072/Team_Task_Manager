const express = require("express");
const {createTask,assignTask,updateTaskStatus,getProjectTasks,getDashboard} = require("../controllers/taskControllers");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createTask);
router.post("/:taskId/assign", authMiddleware, assignTask);
router.patch("/:taskId/status", authMiddleware, updateTaskStatus);
router.get("/project/:projectUUID", authMiddleware, getProjectTasks);
router.get("/dashboard/me", authMiddleware, getDashboard);

module.exports = router;