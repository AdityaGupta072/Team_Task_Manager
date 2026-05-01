const express = require("express");
const {createProject,addMember,getMyProjects} = require("../controllers/projectController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


router.post("/", authMiddleware, createProject);

router.post("/:projectId/add-member", authMiddleware, addMember);

router.get("/my", authMiddleware, getMyProjects);

module.exports = router;