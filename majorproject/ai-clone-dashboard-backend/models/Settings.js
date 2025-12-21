const mongoose = require('mongoose');

// Define the schema for the user settings
const SettingsSchema = new mongoose.Schema({
    // Use a fixed uniqueId to ensure only one settings document exists globally.
    uniqueId: { 
        type: String, 
        required: true, 
        default: 'GLOBAL_SETTINGS' 
    },
    realtimePrioritization: {
        type: Boolean,
        default: true
    },
    automatedAssignment: {
        type: Boolean,
        default: false
    },
    darkMode: {
        type: Boolean,
        default: false
    },
    notificationsEnabled: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Create the model
const Settings = mongoose.model('Settings', SettingsSchema);

module.exports = Settings;