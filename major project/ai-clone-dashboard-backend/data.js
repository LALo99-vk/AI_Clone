// ai-clone-dashboard-backend/data.js

// Make tasks mutable with 'let'
let tasks = [
    { id: 101, task: 'Fix critical production bug (P1)', assignee: 'Anika', dueDate: '2025-10-15', status: 'In progress', effort: 8, skill: 'Backend', priority: 'high' },
    { id: 102, task: 'Design new marketing landing page (P2)', assignee: 'Riya', dueDate: '2025-10-25', status: 'Pending', effort: 5, skill: 'Design', priority: 'medium' },
    { id: 103, task: 'Q3 Financial Reporting (P0)', assignee: 'Rahul', dueDate: '2025-10-14', status: 'In-progress', effort: 10, skill: 'Data Modeling', priority: 'high' },
    { id: 104, task: 'Update API documentation', assignee: 'Riya', dueDate: '2025-11-01', status: 'Pending', effort: 3, skill: 'Backend', priority: 'low' },
    { id: 105, task: 'Completed Feature X review', assignee: 'Priya', dueDate: '2025-10-10', status: 'Completed', effort: 6, skill: 'QA', priority: 'medium' },
    { id: 106, task: 'User feedback session scheduling', assignee: 'Rahul', dueDate: '2025-11-10', status: 'Pending', effort: 2, skill: 'Soft Skills', priority: 'low' },
];

const teamMembers = [
    { id: 301, name: 'Riya', status: 'Available', progress: 75, skillSet: ['Design', 'Frontend'], avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
    { id: 302, name: 'Rahul', status: 'Available', progress: 60, skillSet: ['Data Modeling', 'Finance'], avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { id: 303, name: 'Anika', status: 'Available', progress: 90, skillSet: ['Backend', 'DevOps'], avatar: 'https://randomuser.me/api/portraits/women/3.jpg' },
    { id: 304, name: 'Priya', status: 'Inactive', progress: 20, skillSet: ['QA', 'Testing'], avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
];

// --- REMOVED userSettings AND updateSettings ---

// Function to add a task to the mutable list
const addTask = (newTask) => {
    tasks.push(newTask);
    return newTask;
};

// NOTE: updateSettings and userSettings are removed from data.js.

module.exports = {
    tasks,
    teamMembers,
    addTask,
    // userSettings and updateSettings are no longer exported
};