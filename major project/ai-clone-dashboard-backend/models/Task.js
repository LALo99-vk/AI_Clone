// ai-clone-dashboard-backend/models/Task.js

const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    // Using a simple auto-incrementing ID in mock data is okay,
    // but MongoDB uses its own _id by default, so we'll rely on that.
    task: { 
        type: String, 
        required: true 
    },
    assignee: { 
        type: String, 
        default: 'Unassigned' 
    },
    dueDate: { 
        type: Date, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['To Do', 'In-progress', 'Done', 'Pending'], // Define valid status options
        default: 'To Do' 
    },
    skill: { 
        type: String, 
        default: 'General' 
    },
    effort: { 
        type: Number, 
        default: 5 
    },
    priority: { 
        type: String, 
        enum: ['high', 'medium', 'low'], 
        default: 'medium' 
    },
    // Optional flag used in the Dashboard to show AI priority
    isAIPrioritized: { 
        type: Boolean, 
        default: true
    }
}, { timestamps: true });

const Task = mongoose.model('Task', TaskSchema);
module.exports = Task;