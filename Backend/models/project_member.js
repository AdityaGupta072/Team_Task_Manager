const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    projectId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Project", 
        required: true 
    },
    role: { 
        type: String, 
        enum: ["ADMIN", "MEMBER"], 
        required: true 
    }
}, { timestamps: true });

// Prevent duplicate membership
memberSchema.index({ userId: 1, projectId: 1 }, { unique: true });

module.exports = mongoose.model("ProjectMember", memberSchema);