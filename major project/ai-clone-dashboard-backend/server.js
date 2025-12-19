require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');
const { chain } = require('stream-chain');
const { parser } = require('stream-json');
const { streamArray } = require('stream-json/streamers/StreamArray');
const Settings = require('./models/Settings');
const Task = require('./models/Task');
const { loadDataset } = require('./utils/dataLoader');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const { default: ollama } = require('ollama');

// --- Google OAuth & Gmail API Integration ---
// Ensure credentials.json is present in your backend folder

// Stream large file
const pipeline = chain([
  fs.createReadStream(path.join(__dirname, 'datasets', 'Employee_1000x.json')),
  parser(),
  streamArray()
]);
let employeeCount = 0;
pipeline.on('data', ({ value }) => {
  employeeCount++;
});
pipeline.on('end', () => {
  console.log('Finished processing large Employee_1000x file.');
  console.log('Total employees:', employeeCount);
});

// Load datasets (all listed)
const alertRiskPrediction = loadDataset('alert_risk_prediction_20k.json');
console.log('alertRiskPrediction:', Array.isArray(alertRiskPrediction) ? alertRiskPrediction.length : typeof alertRiskPrediction);
const chatNlpDataset = loadDataset('chat_nlp_dataset_20k.json');
console.log('chatNlpDataset:', Array.isArray(chatNlpDataset) ? chatNlpDataset.length : typeof chatNlpDataset);
const contextualInformation = loadDataset('contextual_information_20k.json');
console.log('contextualInformation:', Array.isArray(contextualInformation) ? contextualInformation.length : typeof contextualInformation);
const delegationFeedback = loadDataset('delegation_feedback_20k.json');
console.log('delegationFeedback:', Array.isArray(delegationFeedback) ? delegationFeedback.length : typeof delegationFeedback);
const domainSpecificData = loadDataset('domain_specific_20k.json');
console.log('domainSpecificData:', Array.isArray(domainSpecificData) ? domainSpecificData.length : typeof domainSpecificData);
const feedbackPerformance = loadDataset('feedback_performance_20k.json');
console.log('feedbackPerformance:', Array.isArray(feedbackPerformance) ? feedbackPerformance.length : typeof feedbackPerformance);
const humanAiCollaboration = loadDataset('human_ai_collaboration_20k.json');
console.log('humanAiCollaboration:', Array.isArray(humanAiCollaboration) ? humanAiCollaboration.length : typeof humanAiCollaboration);
const nlpDelegation = loadDataset('nlp_delegation_50k.json');
console.log('nlpDelegation:', Array.isArray(nlpDelegation) ? nlpDelegation.length : typeof nlpDelegation);
const performanceTest = loadDataset('performance_test_10k.json');
console.log('performanceTest:', Array.isArray(performanceTest) ? performanceTest.length : typeof performanceTest);
const performanceTrain = loadDataset('performance_train_40k.json');
console.log('performanceTrain:', Array.isArray(performanceTrain) ? performanceTrain.length : typeof performanceTrain);
const productivityAnalysis = loadDataset('productivity_analysis_20k.json');
console.log('productivityAnalysis:', Array.isArray(productivityAnalysis) ? productivityAnalysis.length : typeof productivityAnalysis);
const taskDataset = loadDataset('task_dataset_20k.json');
console.log('taskDataset:', Array.isArray(taskDataset) ? taskDataset.length : typeof taskDataset);
const taskDelegation = loadDataset('task_delegation_20k.json');
console.log('taskDelegation:', Array.isArray(taskDelegation) ? taskDelegation.length : typeof taskDelegation);
const taskPrioritization = loadDataset('task_prioritization_20k.json');
console.log('taskPrioritization:', Array.isArray(taskPrioritization) ? taskPrioritization.length : typeof taskPrioritization);
const taskToTeamMatching = loadDataset('task_to_team_matching_20k.json');
console.log('taskToTeamMatching:', Array.isArray(taskToTeamMatching) ? taskToTeamMatching.length : typeof taskToTeamMatching);
const teamMemberProfile = loadDataset('team_member_profile_20k.json');
console.log('teamMemberProfile:', Array.isArray(teamMemberProfile) ? teamMemberProfile.length : typeof teamMemberProfile);

console.log('All datasets loaded.');

const { tasks: mockTasks, teamMembers, addTask: addMockTask } = require('./data');

const app = express();
const PORT = 5000;
const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://1da22cs060cs_db_user:BwujDs4RELephWkg@harshitha.1jsxsnx.mongodb.net/?appName=harshitha';

// --- TASK SEED DATA (for database initialization) ---
const initialTasks = [
  { task: 'Q3 Financial Reporting (P0)', assignee: 'Rahul', dueDate: new Date('2025-10-14'), status: 'In-progress', skill: 'Finance', effort: 10, priority: 'high', isAIPrioritized: true },
  { task: 'Fix critical production bug (P1)', assignee: 'Anika', dueDate: new Date('2025-10-15'), status: 'In-progress', skill: 'Backend', effort: 1, priority: 'high', isAIPrioritized: true },
  { task: 'Design new marketing landing page (P2)', assignee: 'Riya', dueDate: new Date('2025-10-25'), status: 'To Do', skill: 'Design', effort: 5, priority: 'medium', isAIPrioritized: true },
  { task: 'Update API documentation', assignee: 'Riya', dueDate: new Date('2025-11-01'), status: 'To Do', skill: 'Frontend', effort: 3, priority: 'low', isAIPrioritized: true },
  { task: 'Project Reporting', assignee: 'Rahul', dueDate: new Date('2025-10-12'), status: 'To Do', skill: 'Data Modeling', effort: 2, priority: 'medium', isAIPrioritized: true },
  { task: 'Completed Feature X review', assignee: 'Priya', dueDate: new Date('2025-10-05'), status: 'Done', skill: 'QA', effort: 2, priority: 'medium', isAIPrioritized: true },
  { task: 'User feedback session scheduling', assignee: 'Anika', dueDate: new Date('2025-11-05'), status: 'To Do', skill: 'Backend', effort: 4, priority: 'low', isAIPrioritized: true }
];

// --- MONGODB CONNECTION & INITIALIZATION ---
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully to Atlas.');
    initializeSettings();
    initializeTasks();
  })
  .catch(err => console.error('🛑 MongoDB connection error:', err));

const initializeSettings = async () => {
  try {
    const settingsDoc = await Settings.findOne({ uniqueId: 'GLOBAL_SETTINGS' });
    if (!settingsDoc) {
      await Settings.create({
        uniqueId: 'GLOBAL_SETTINGS',
        realtimePrioritization: true,
        automatedAssignment: false,
        darkMode: false,
        notificationsEnabled: true
      });
      console.log('Default settings document created in DB.');
    }
  } catch (error) {
    console.error('Error initializing settings:', error);
  }
};

const initializeTasks = async () => {
  try {
    const count = await Task.countDocuments();
    if (count === 0) {
      await Task.insertMany(initialTasks);
      console.log('Default tasks seeded into DB.');
    }
  } catch (error) {
    console.error('Error initializing tasks:', error);
  }
};

const prioritizeTasks = (taskList) => {
  return taskList.sort((a, b) => {
    const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
    const pA = priorityOrder[a.priority] || 0;
    const pB = priorityOrder[b.priority] || 0;
    if (pA !== pB) return pB - pA;
    const dateA = new Date(a.dueDate);
    const dateB = new Date(b.dueDate);
    if (a.status === 'Done' || a.status === 'Completed') return 1;
    if (b.status === 'Done' || b.status === 'Completed') return -1;
    return dateA - dateB;
  });
};

const analyzeSkillGap = (taskList) => {
  const skillLoad = {};
  const activeTasks = taskList.filter(t => t.status !== 'Done' && t.status !== 'Completed');
  activeTasks.forEach(task => {
    skillLoad[task.skill] = (skillLoad[task.skill] || 0) + task.effort;
  });
  if (Object.keys(skillLoad).length === 0) {
    return { focus: 'None', effort: 0 };
  }
  const highestLoadSkill = Object.keys(skillLoad).reduce((a, b) =>
    skillLoad[a] > skillLoad[b] ? a : b
  );
  return {
    focus: highestLoadSkill,
    effort: skillLoad[highestLoadSkill],
    recommendation: `High predicted load in **${highestLoadSkill}** (Total effort: ${skillLoad[highestLoadSkill]} units). Focus team capacity here.`
  };
};

const calculateProductivity = (taskList) => {
  const totalCompleted = taskList.filter(t => t.status === 'Done' || t.status === 'Completed').length;
  const totalTasks = taskList.length;
  const completionRate = totalTasks > 0 ? (totalCompleted / totalTasks) * 100 : 0;
  const forecast = completionRate >= 70 ? 'Stable' : 'Risk: Needs attention';
  return {
    completionRate: completionRate.toFixed(1) + '%',
    forecast: forecast
  };
};

// Middleware
app.use(cors());
app.use(express.json());

// --- Google OAuth Helper Endpoint: Visit to Start OAuth Flow ---
app.get('/login/google', (req, res) => {
  const credentials = JSON.parse(fs.readFileSync(path.join(__dirname, 'credentials.json')));
  const { client_secret, client_id, redirect_uris } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/classroom.courses',
      'https://www.googleapis.com/auth/classroom.coursework.me',
      'https://www.googleapis.com/auth/classroom.rosters'
      // Add/remove scopes here as needed for more Google services
    ]
  });
  res.redirect(authUrl);
});


// --- Google OAuth2 Callback: Handles Code Exchange & Token Storage ---
app.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;
  const credentials = JSON.parse(fs.readFileSync(path.join(__dirname, 'credentials.json')));
  const { client_secret, client_id, redirect_uris } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    fs.writeFileSync(path.join(__dirname, 'token.json'), JSON.stringify(tokens));
    res.send('OAuth successful! Tokens saved. You can now use Gmail, Calendar, and Classroom APIs.');

  } catch (error) {
    console.error('Error exchanging code for token:', error);
    res.status(500).send('OAuth exchange failed');
  }
});

// --- Gmail API Send Email HTML Endpoint ---
app.post('/api/send-email', async (req, res) => {
  const { to, subject, htmlBody, textBody } = req.body;
  const credentials = JSON.parse(fs.readFileSync(path.join(__dirname, 'credentials.json')));
  const tokens = JSON.parse(fs.readFileSync(path.join(__dirname, 'token.json')));
  const { client_secret, client_id, redirect_uris } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  oAuth2Client.setCredentials(tokens);

  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
  const emailLines = [
    `From: "Harshitha KGS" <1da22cs060.cs@drait.edu.in>`, // Change this to your Google account
    `To: ${to}`,
    `Subject: ${subject}`,
    `Content-Type: text/html; charset=utf-8`,
    ``,
    htmlBody || textBody
  ];
  const email = emailLines.join('\r\n');
  const encodedEmail = Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  try {
    await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw: encodedEmail }
    });
    res.json({ status: 'HTML Email sent' });
  } catch (error) {
    console.error('Gmail API error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// --- API Endpoints ---
app.get('/api/dashboard/stats', async (req, res) => {
  let allTasks;
  try {
    allTasks = await Task.find({});
  } catch (error) {
    console.warn('DB fetch failed, using mock tasks:', error);
    allTasks = mockTasks;
  }
  const prioritizedTasks = prioritizeTasks(allTasks);
  const completed = prioritizedTasks.filter(t => t.status === 'Done' || t.status === 'Completed').length;
  const pending = prioritizedTasks.filter(t => t.status !== 'Done' && t.status !== 'Completed' && t.status !== 'In-progress').length;
  const overdue = prioritizedTasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'Done' && t.status !== 'Completed').length;
  const productivity = calculateProductivity(allTasks);

  res.json({
    stats: [
      { id: 1, title: 'Pending', value: pending, type: 'pending' },
      { id: 2, title: 'Completed', value: completed, type: 'completed' },
      { id: 3, title: 'Overdue', value: overdue, type: 'overdue' }
    ],
    productivity
  });
});

app.get('/api/dashboard/recent-tasks', async (req, res) => {
  let allTasks;
  try {
    allTasks = await Task.find({});
  } catch (error) {
    console.warn('DB fetch failed, using mock tasks:', error);
    allTasks = mockTasks;
  }
  const prioritized = prioritizeTasks(allTasks);
  res.json(prioritized.slice(0, 4).map(t => ({
    ...t.toObject ? t.toObject() : t,
    isAIPrioritized: true
  })));
});

app.get('/api/team/insights', async (req, res) => {
  let allTasks;
  try {
    allTasks = await Task.find({});
  } catch (error) {
    console.warn('DB fetch failed, using mock tasks:', error);
    allTasks = mockTasks;
  }
  const skillAnalysis = analyzeSkillGap(allTasks);
  res.json({
    members: teamMembers,
    aiInsight: skillAnalysis
  });
});

app.get('/api/tasks/kanban', async (req, res) => {
  let allTasks;
  try {
    allTasks = await Task.find({});
  } catch (error) {
    console.warn('DB fetch failed, using mock tasks:', error);
    allTasks = mockTasks;
  }

  const kanbanData = { 'To Do': [], 'In-progress': [], 'Done': [] };

  allTasks.forEach(t => {
    const statusKey = t.status.replace('Pending', 'To Do');
    if (kanbanData[statusKey]) {
      kanbanData[statusKey].push(t.toObject ? t.toObject() : t);
    } else if (t.status === 'Completed') {
      kanbanData['Done'].push(t.toObject ? t.toObject() : t);
    }
  });
  res.json(kanbanData);
});

app.get('/api/settings', async (req, res) => {
  try {
    const settings = await Settings.findOne({ uniqueId: 'GLOBAL_SETTINGS' }, { _id: 0, uniqueId: 0, createdAt: 0, updatedAt: 0, __v: 0 });
    if (settings) {
      res.json(settings);
    } else {
      res.status(404).json({ message: "Settings document not found." });
    }
  } catch (error) {
    console.error('DB Fetch Error:', error);
    res.status(500).json({ message: "Error fetching settings from database." });
  }
});

app.post('/api/tasks', async (req, res) => {
  const { task, assignee, dueDate, status, skill, effort, priority } = req.body;
  try {
    const newTask = await Task.create({
      task,
      assignee: assignee || 'Unassigned',
      dueDate: dueDate || new Date(),
      status: status || 'To Do',
      skill: skill || 'General',
      effort: effort || 5,
      priority: priority || 'medium',
      isAIPrioritized: true
    });
    console.log(`New Task Created and saved to DB: ${newTask.task}`);
    res.status(201).json(newTask.toObject());
  } catch (error) {
    console.error('Error creating new task:', error);
    res.status(500).json({ message: 'Error creating task.' });
  }
});

app.post('/api/ai/chat', async (req, res) => {
  const userPrompt = req.body.prompt || '';
  const prompt = `You are a helpful AI assistant. User input: ${userPrompt}`;
  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'llama2-short',
      prompt: prompt,
      stream: false
    });
    res.json({ response: response.data.response });
  } catch (error) {
    console.error('Ollama API error:', error);
    res.status(500).json({ response: 'Error generating response' });
  }
});

app.put('/api/settings', async (req, res) => {
  try {
    const updated = await Settings.findOneAndUpdate(
      { uniqueId: 'GLOBAL_SETTINGS' },
      { $set: req.body },
      { new: true, upsert: true }
    );
    const responseData = updated.toObject();
    delete responseData._id;
    delete responseData.uniqueId;
    delete responseData.__v;

    console.log('Settings successfully updated in MongoDB.');
    res.json(responseData);
  } catch (error) {
    console.error('DB Update Error:', error);
    res.status(500).json({ message: "Error updating settings in database." });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  const updates = req.body;
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found.' });
    }
    console.log(`Task ${updatedTask.task} updated to status: ${updatedTask.status}`);
    res.json(updatedTask.toObject());
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Error updating task details.' });
  }
});
// --- Google Calendar OAuth Helper Endpoint ---
app.get('/login/google', (req, res) => {
  const credentials = JSON.parse(fs.readFileSync(path.join(__dirname, 'credentials.json')));
  const { client_secret, client_id, redirect_uris } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar'] // Calendar scope for Meet
  });
  res.redirect(authUrl);
});

// --- Google OAuth2 Callback: Handles Code Exchange & Token Storage ---
app.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;
  const credentials = JSON.parse(fs.readFileSync(path.join(__dirname, 'credentials.json')));
  const { client_secret, client_id, redirect_uris } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    fs.writeFileSync(path.join(__dirname, 'token.json'), JSON.stringify(tokens));
    res.send('OAuth successful! Tokens saved. You can now schedule meetings with Google Calendar.');
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    res.status(500).send('OAuth exchange failed');
  }
});

// --- Event Creation Endpoint (Google Meet link) ---
app.post('/api/schedule-meeting', async (req, res) => {
  // frontend sends: summary, startDateTime, endDateTime, attendeeEmail
  const { summary, startDateTime, endDateTime, attendeeEmail } = req.body;

  // Load credentials and tokens
  const credentials = JSON.parse(fs.readFileSync(path.join(__dirname, 'credentials.json')));
  const tokens = JSON.parse(fs.readFileSync(path.join(__dirname, 'token.json')));
  const { client_secret, client_id, redirect_uris } = credentials.web;

  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  oAuth2Client.setCredentials(tokens);

  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

  const eventConfig = {
    summary: summary,
    start: { dateTime: startDateTime },
    end: { dateTime: endDateTime },
    attendees: [{ email: attendeeEmail }],
    conferenceData: {
      createRequest: {
        conferenceSolutionKey: { type: 'hangoutsMeet' }
      }
    }
  };

  try {
    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: eventConfig,
      conferenceDataVersion: 1,
    });
    // Meet link from response
    const meetLink = response.data.conferenceData.entryPoints?.[0]?.uri || null;
    res.json({
      event: response.data,
      meetLink: meetLink,
      message: 'Meeting scheduled and Meet link generated.'
    });
  } catch (error) {
    console.error('Google Calendar API error:', error);
    res.status(500).json({ error: 'Failed to schedule meeting' });
  }
});



// Root route
app.get('/', (req, res) => {
  res.send('AI Clone Dashboard Backend API is running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('API endpoints are ready.');
});
