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

// Helper function to check if Google credentials exist
const checkGoogleCredentials = (res) => {
  const credentialsPath = path.join(__dirname, 'credentials.json');
  if (!fs.existsSync(credentialsPath)) {
    res.status(500).json({ 
      error: 'Google OAuth credentials not found',
      message: 'Please add credentials.json file to enable Google OAuth features. See SETUP_GUIDE.txt for instructions.'
    });
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(credentialsPath));
  } catch (error) {
    res.status(500).json({ 
      error: 'Invalid credentials.json file',
      message: 'Please check that credentials.json is valid JSON format.'
    });
    return null;
  }
};

// Helper function to check if token exists
const checkGoogleToken = (res) => {
  const tokenPath = path.join(__dirname, 'token.json');
  if (!fs.existsSync(tokenPath)) {
    res.status(401).json({ 
      error: 'Google OAuth token not found',
      message: 'Please authenticate first by visiting /login/google'
    });
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(tokenPath));
  } catch (error) {
    res.status(500).json({ 
      error: 'Invalid token.json file',
      message: 'Please re-authenticate by visiting /login/google'
    });
    return null;
  }
};

// --- Google OAuth Helper Endpoint: Visit to Start OAuth Flow ---
app.get('/login/google', (req, res) => {
  const credentials = checkGoogleCredentials(res);
  if (!credentials) return;
  
  const { client_secret, client_id, redirect_uris } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/gmail.readonly',
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
  const credentials = checkGoogleCredentials(res);
  if (!credentials) return;
  
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
  const credentials = checkGoogleCredentials(res);
  if (!credentials) return;
  
  const tokens = checkGoogleToken(res);
  if (!tokens) return;
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

// Helper function to extract email information using AI with regex fallback
async function extractEmailInfo(userPrompt) {
  // First try regex patterns for common email formats
  const emailRegex = /[\w\.-]+@[\w\.-]+\.\w+/g;
  const emails = userPrompt.match(emailRegex);
  const emailAddress = emails ? emails[0] : null;
  
  // Extract subject (look for "subject:", "about:", "re:")
  const subjectMatch = userPrompt.match(/(?:subject|about|re):\s*["']?([^"'\n]+)["']?/i);
  const subject = subjectMatch ? subjectMatch[1].trim() : null;
  
  // Extract body/content (everything after "saying", "message", "content", "body")
  const bodyMatch = userPrompt.match(/(?:saying|message|content|body|says?|write|tell):\s*["']?([^"']+)["']?/i);
  let body = bodyMatch ? bodyMatch[1].trim() : null;
  
  // If no explicit body found, try to get text after email/subject
  if (!body && emailAddress) {
    const afterEmail = userPrompt.split(emailAddress)[1];
    if (afterEmail && afterEmail.trim().length > 10) {
      body = afterEmail.trim().split(/\s+(?:subject|about):/i)[0].trim();
    }
  }
  
  // If we have enough info from regex, use it
  if (emailAddress) {
    return {
      action: 'send_email',
      to: emailAddress,
      subject: subject || 'AI Generated Email',
      body: body || userPrompt.replace(emailAddress, '').replace(subject || '', '').trim() || 'No content provided'
    };
  }
  
  // Fallback to AI extraction
  const prompt = `Extract email details from: "${userPrompt}". Respond ONLY with valid JSON: {"action":"send_email","to":"email@example.com","subject":"subject text","body":"message content"}`;
  
  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'llama2-short',
      prompt: prompt,
      stream: false
    });
    
    const responseText = response.data.response.trim();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return null;
  } catch (error) {
    console.error('Error extracting email info:', error);
    return null;
  }
}

// Helper function to extract calendar information with regex fallback
async function extractCalendarInfo(userPrompt) {
  const now = new Date();
  const emailRegex = /[\w\.-]+@[\w\.-]+\.\w+/g;
  const emails = userPrompt.match(emailRegex);
  const attendeeEmail = emails ? emails[0] : null;
  
  // Extract time patterns (2pm, 14:00, tomorrow at 3pm, etc.)
  const timePatterns = [
    /(\d{1,2}):(\d{2})\s*(am|pm)?/i,
    /(\d{1,2})\s*(am|pm)/i,
    /(tomorrow|today|monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i
  ];
  
  // Extract summary/title
  const summaryMatch = userPrompt.match(/(?:meeting|with|about|call)\s+["']?([^"'\n]+)["']?/i);
  let summary = summaryMatch ? summaryMatch[1].trim().split(/\s+(?:at|on|with)/i)[0] : 'AI Scheduled Meeting';
  
  // Calculate default times (1 hour from now, 2 hours duration)
  const defaultStart = new Date(now.getTime() + 60 * 60 * 1000);
  const defaultEnd = new Date(defaultStart.getTime() + 60 * 60 * 1000);
  
  const formatDateTime = (date) => {
    return date.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM format
  };
  
  // If we have email, try to parse time or use defaults
  if (attendeeEmail) {
    return {
      action: 'schedule_meeting',
      summary: summary,
      startDateTime: formatDateTime(defaultStart),
      endDateTime: formatDateTime(defaultEnd),
      attendeeEmail: attendeeEmail
    };
  }
  
  // Fallback to AI extraction
  const prompt = `Extract meeting details from: "${userPrompt}". Respond ONLY with valid JSON: {"action":"schedule_meeting","summary":"meeting title","startDateTime":"2025-01-20T14:00","endDateTime":"2025-01-20T15:00","attendeeEmail":"email@example.com"}`;
  
  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'llama2-short',
      prompt: prompt,
      stream: false
    });
    
    const responseText = response.data.response.trim();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return null;
  } catch (error) {
    console.error('Error extracting calendar info:', error);
    return null;
  }
}

// Available team members for delegation
const TEAM_MEMBERS = ['Anika', 'Riya', 'Rahul', 'Priya'];

// Helper function to extract task delegation information with regex fallback
async function extractTaskInfo(userPrompt) {
  // Extract assignee name (look for team member names)
  let assignee = null;
  for (const member of TEAM_MEMBERS) {
    if (userPrompt.toLowerCase().includes(member.toLowerCase())) {
      assignee = member;
      break;
    }
  }
  
  // Extract priority (high, medium, low, urgent, important)
  let priority = 'medium';
  if (/high|urgent|important|critical|priority/i.test(userPrompt)) {
    priority = 'high';
  } else if (/low|minor/i.test(userPrompt)) {
    priority = 'low';
  }
  
  // Extract due date patterns
  let dueDate = new Date(); // Default to today
  const datePatterns = [
    /(?:tomorrow|next day)/i,
    /(?:today)/i,
    /(\d+)\s*(?:days?|weeks?)\s*(?:from now|later)/i,
    /(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i
  ];
  
  // Try to extract task description (everything after "assign", "delegate", "task", "give")
  const taskKeywords = ['assign', 'delegate', 'task', 'give', 'create', 'new task'];
  let taskDescription = null;
  
  for (const keyword of taskKeywords) {
    const match = userPrompt.match(new RegExp(`${keyword}\\s+(?:to\\s+\\w+\\s+)?(.+?)(?:\\s+to\\s+|\\s+for\\s+|$)`, 'i'));
    if (match && match[1]) {
      taskDescription = match[1].trim();
      // Remove assignee name if included
      if (assignee) {
        taskDescription = taskDescription.replace(new RegExp(assignee, 'gi'), '').trim();
      }
      break;
    }
  }
  
  // If no keyword match, try to extract text after common patterns
  if (!taskDescription) {
    const patterns = [
      /(?:assign|delegate|give|create|add)\s+(.+)/i,
      /task:\s*(.+)/i,
      /"([^"]+)"/,  // Text in quotes
      /'([^']+)'/   // Text in single quotes
    ];
    
    for (const pattern of patterns) {
      const match = userPrompt.match(pattern);
      if (match && match[1]) {
        taskDescription = match[1].trim();
        break;
      }
    }
  }
  
  // If still no task description, use the whole prompt minus assignee and keywords
  if (!taskDescription) {
    taskDescription = userPrompt
      .replace(/\b(assign|delegate|task|to|give|create|new)\b/gi, '')
      .replace(new RegExp(assignee || '', 'gi'), '')
      .trim();
  }
  
  return {
    task: taskDescription || userPrompt,
    assignee: assignee || 'Anika', // Default assignee
    dueDate: dueDate,
    priority: priority,
    status: 'To Do'
  };
}

// Helper function to detect user intent using AI
async function detectIntent(userPrompt) {
  const lowerPrompt = userPrompt.toLowerCase();
  
  // Quick keyword-based detection first (faster than AI)
  if (/\b(assign|delegate|task|give.*task|create.*task|new task)\b/i.test(userPrompt)) {
    return 'delegate';
  }
  
  if (/\b(email|mail|send.*email|write.*email)\b/i.test(userPrompt)) {
    return 'email';
  }
  
  if (/\b(calendar|meeting|schedule|book.*calendar|set up.*meeting)\b/i.test(userPrompt)) {
    return 'calendar';
  }
  
  // Fallback to AI detection for ambiguous cases
  const prompt = `Analyze this request and determine the action: "${userPrompt}".
Respond with ONLY one word: "delegate" if it's about assigning/delegating a task, "email" if it's about sending/writing an email, "calendar" if it's about scheduling a meeting/event, or "chat" for general conversation.`;
  
  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'llama2-short',
      prompt: prompt,
      stream: false
    });
    
    const intent = response.data.response.trim().toLowerCase();
    if (intent.includes('delegate') || intent.includes('assign') || intent.includes('task')) return 'delegate';
    if (intent.includes('email') || intent.includes('mail')) return 'email';
    if (intent.includes('calendar') || intent.includes('meeting') || intent.includes('schedule')) return 'calendar';
    return 'chat';
  } catch (error) {
    console.error('Error detecting intent:', error);
    return 'chat';
  }
}

app.post('/api/ai/chat', async (req, res) => {
  const userPrompt = req.body.prompt || '';
  
  try {
    // Detect user intent
    const intent = await detectIntent(userPrompt);
    
    // Handle email intent (send or read)
    if (intent === 'email') {
      // Check if user wants to read emails
      const readKeywords = ['read', 'show', 'list', 'check', 'get', 'fetch', 'view'];
      const wantsToRead = readKeywords.some(keyword => userPrompt.toLowerCase().includes(keyword));
      
      if (wantsToRead) {
        // Read emails functionality
        const credentials = checkGoogleCredentials(res);
        if (!credentials) {
          return res.json({ response: 'Google credentials not configured. Cannot read emails.' });
        }
        
        const tokens = checkGoogleToken(res);
        if (!tokens) {
          return res.json({ response: 'Please authenticate with Google first by visiting /login/google' });
        }
        
        const { client_secret, client_id, redirect_uris } = credentials.web;
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
        oAuth2Client.setCredentials(tokens);
        
        const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
        
        try {
          // Get list of recent emails
          const listResponse = await gmail.users.messages.list({
            userId: 'me',
            maxResults: 10,
            q: 'in:inbox'
          });
          
          if (!listResponse.data.messages || listResponse.data.messages.length === 0) {
            return res.json({ response: 'No emails found in your inbox.' });
          }
          
          // Get details of first few emails
          const messages = listResponse.data.messages.slice(0, 5);
          const emailSummaries = [];
          
          for (const message of messages) {
            const msgResponse = await gmail.users.messages.get({
              userId: 'me',
              id: message.id,
              format: 'metadata',
              metadataHeaders: ['From', 'Subject', 'Date']
            });
            
            const headers = msgResponse.data.payload.headers;
            const from = headers.find(h => h.name === 'From')?.value || 'Unknown';
            const subject = headers.find(h => h.name === 'Subject')?.value || '(No subject)';
            const date = headers.find(h => h.name === 'Date')?.value || '';
            
            emailSummaries.push(`${from}: "${subject}"`);
          }
          
          return res.json({ 
            response: `Found ${listResponse.data.messages.length} emails. Recent ones:\n${emailSummaries.join('\n')}` 
          });
        } catch (error) {
          console.error('Error reading emails:', error);
          return res.json({ response: 'Error reading emails: ' + (error.message || 'Unknown error') });
        }
      }
      
      // Send email functionality
      const emailInfo = await extractEmailInfo(userPrompt);
      
      if (emailInfo && emailInfo.to && emailInfo.to !== 'unknown') {
        // Send the email
        const credentials = checkGoogleCredentials(res);
        if (!credentials) {
          return res.json({ response: 'Google credentials not configured. Cannot send email.' });
        }
        
        const tokens = checkGoogleToken(res);
        if (!tokens) {
          return res.json({ response: 'Please authenticate with Google first by visiting /login/google' });
        }
        
        const { client_secret, client_id, redirect_uris } = credentials.web;
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
        oAuth2Client.setCredentials(tokens);
        
        const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
        const emailLines = [
          `From: "AI Assistant" <${tokens.email || 'assistant@example.com'}>`,
          `To: ${emailInfo.to}`,
          `Subject: ${emailInfo.subject || 'AI Generated Email'}`,
          `Content-Type: text/html; charset=utf-8`,
          ``,
          emailInfo.body || 'No content provided'
        ];
        const email = emailLines.join('\r\n');
        const encodedEmail = Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        
        await gmail.users.messages.send({
          userId: 'me',
          requestBody: { raw: encodedEmail }
        });
        
        return res.json({ response: `Email sent successfully to ${emailInfo.to} with subject: "${emailInfo.subject || 'No subject'}"` });
      } else {
        return res.json({ response: 'I understood you want to send an email, but I couldn\'t extract the recipient email address. Please specify who to send it to.' });
      }
    }
    
    // Handle calendar intent
    if (intent === 'calendar') {
      const calendarInfo = await extractCalendarInfo(userPrompt);
      
      if (calendarInfo && calendarInfo.attendeeEmail && calendarInfo.attendeeEmail !== 'unknown') {
        // Format dates properly
        const formatDateTimeForGoogle = (dateTimeString) => {
          if (!dateTimeString) return null;
          if (dateTimeString.includes('Z') || dateTimeString.match(/[+-]\d{2}:\d{2}$/)) {
            return dateTimeString;
          }
          const date = new Date(dateTimeString);
          if (isNaN(date.getTime())) return null;
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          const seconds = String(date.getSeconds()).padStart(2, '0');
          const offsetMinutes = date.getTimezoneOffset();
          const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
          const offsetMins = Math.abs(offsetMinutes) % 60;
          const offsetSign = offsetMinutes <= 0 ? '+' : '-';
          const offsetStr = `${offsetSign}${String(offsetHours).padStart(2, '0')}:${String(offsetMins).padStart(2, '0')}`;
          return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${offsetStr}`;
        };
        
        const formattedStart = formatDateTimeForGoogle(calendarInfo.startDateTime);
        const formattedEnd = formatDateTimeForGoogle(calendarInfo.endDateTime);
        
        if (!formattedStart || !formattedEnd) {
          return res.json({ response: 'I understood you want to schedule a meeting, but I couldn\'t extract valid date/time. Please specify when the meeting should be.' });
        }
        
        // Schedule the meeting
        const credentials = checkGoogleCredentials(res);
        if (!credentials) {
          return res.json({ response: 'Google credentials not configured. Cannot schedule meeting.' });
        }
        
        const tokens = checkGoogleToken(res);
        if (!tokens) {
          return res.json({ response: 'Please authenticate with Google first by visiting /login/google' });
        }
        
        const { client_secret, client_id, redirect_uris } = credentials.web;
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
        oAuth2Client.setCredentials(tokens);
        
        const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
        const eventConfig = {
          summary: calendarInfo.summary || 'AI Scheduled Meeting',
          start: { dateTime: formattedStart, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
          end: { dateTime: formattedEnd, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
          attendees: [{ email: calendarInfo.attendeeEmail }],
          conferenceData: {
            createRequest: {
              conferenceSolutionKey: { type: 'hangoutsMeet' }
            }
          }
        };
        
        const response = await calendar.events.insert({
          calendarId: 'primary',
          resource: eventConfig,
          conferenceDataVersion: 1,
        });
        
        const meetLink = response.data.conferenceData?.entryPoints?.[0]?.uri || response.data.hangoutLink || null;
        
        // Send email with Meet link to attendee
        if (meetLink && calendarInfo.attendeeEmail) {
          try {
            const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
            const emailSubject = `Meeting Invitation: ${calendarInfo.summary || 'Scheduled Meeting'}`;
            const emailBody = `
              <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                  <h2>Meeting Invitation</h2>
                  <p><strong>Meeting:</strong> ${calendarInfo.summary || 'Scheduled Meeting'}</p>
                  <p><strong>Date & Time:</strong> ${new Date(formattedStart).toLocaleString()} - ${new Date(formattedEnd).toLocaleString()}</p>
                  <p><strong>Google Meet Link:</strong></p>
                  <p style="margin: 20px 0;">
                    <a href="${meetLink}" style="background-color: #4285f4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                      Join Google Meet
                    </a>
                  </p>
                  <p style="color: #666; font-size: 14px;">Or copy this link: ${meetLink}</p>
                  <p style="margin-top: 30px; color: #999; font-size: 12px;">This meeting was scheduled via AI Assistant.</p>
                </body>
              </html>
            `;
            
            const emailLines = [
              `From: "AI Assistant" <${tokens.email || 'assistant@example.com'}>`,
              `To: ${calendarInfo.attendeeEmail}`,
              `Subject: ${emailSubject}`,
              `Content-Type: text/html; charset=utf-8`,
              ``,
              emailBody
            ];
            const email = emailLines.join('\r\n');
            const encodedEmail = Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
            
            await gmail.users.messages.send({
              userId: 'me',
              requestBody: { raw: encodedEmail }
            });
            
            console.log(`Meeting invite email sent to ${calendarInfo.attendeeEmail} with Meet link`);
          } catch (emailError) {
            console.error('Error sending meeting invite email:', emailError);
            // Don't fail the whole request if email fails, just log it
          }
        }
        
        return res.json({ 
          response: `Meeting scheduled successfully! "${calendarInfo.summary || 'Meeting'}" with ${calendarInfo.attendeeEmail} on ${new Date(formattedStart).toLocaleString()}. Meet link sent via email. ${meetLink ? `Link: ${meetLink}` : ''}` 
        });
      } else {
        return res.json({ response: 'I understood you want to schedule a meeting, but I couldn\'t extract the attendee email or date/time. Please provide more details.' });
      }
    }
    
    // Handle delegation/task assignment intent
    if (intent === 'delegate') {
      const taskInfo = await extractTaskInfo(userPrompt);
      
      if (taskInfo && taskInfo.task && taskInfo.task.trim().length > 0) {
        try {
          // Create the task
          const newTask = await Task.create({
            task: taskInfo.task,
            assignee: taskInfo.assignee || 'Anika',
            dueDate: taskInfo.dueDate || new Date(),
            status: taskInfo.status || 'To Do',
            skill: 'General',
            effort: 5,
            priority: taskInfo.priority || 'medium',
            isAIPrioritized: true
          });
          
          console.log(`AI Delegated Task: "${newTask.task}" to ${newTask.assignee}`);
          
          return res.json({ 
            response: `Task "${newTask.task}" has been assigned to ${newTask.assignee} with ${newTask.priority} priority. Status: ${newTask.status}.` 
          });
        } catch (error) {
          console.error('Error creating delegated task:', error);
          return res.json({ response: 'Error creating task: ' + (error.message || 'Unknown error') });
        }
      } else {
        return res.json({ response: 'I understood you want to delegate a task, but I couldn\'t extract the task description. Please specify what task to assign.' });
      }
    }
    
    // Default chat response
    const prompt = `You are a helpful AI assistant. User input: ${userPrompt}`;
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'llama2-short',
      prompt: prompt,
      stream: false
    });
    res.json({ response: response.data.response });
    
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ response: 'Error: ' + (error.message || 'Something went wrong') });
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

// --- Event Creation Endpoint (Google Meet link) ---
app.post('/api/schedule-meeting', async (req, res) => {
  // frontend sends: summary, startDateTime, endDateTime, attendeeEmail
  const { summary, startDateTime, endDateTime, attendeeEmail } = req.body;

  // Load credentials and tokens
  const credentials = checkGoogleCredentials(res);
  if (!credentials) return;
  
  const tokens = checkGoogleToken(res);
  if (!tokens) return;
  const { client_secret, client_id, redirect_uris } = credentials.web;

  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  oAuth2Client.setCredentials(tokens);

  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

  // Convert datetime-local format to RFC3339 with timezone
  // Frontend sends "2025-12-21T07:00" (local time), we need "2025-12-21T07:00:00-08:00"
  const formatDateTimeForGoogle = (dateTimeString) => {
    if (!dateTimeString) return null;
    // If already has timezone info (Z, +, or -HH:MM), return as is
    if (dateTimeString.includes('Z') || dateTimeString.match(/[+-]\d{2}:\d{2}$/)) {
      return dateTimeString;
    }
    // Parse as local time and format with timezone offset
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date format: ${dateTimeString}`);
    }
    // Format manually to preserve local time with timezone offset
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    // Calculate timezone offset in minutes, convert to +/-HH:MM
    const offsetMinutes = date.getTimezoneOffset();
    const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
    const offsetMins = Math.abs(offsetMinutes) % 60;
    const offsetSign = offsetMinutes <= 0 ? '+' : '-'; // Note: getTimezoneOffset() returns negative for positive offsets
    const offsetStr = `${offsetSign}${String(offsetHours).padStart(2, '0')}:${String(offsetMins).padStart(2, '0')}`;
    
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${offsetStr}`;
  };

  try {
    const formattedStart = formatDateTimeForGoogle(startDateTime);
    const formattedEnd = formatDateTimeForGoogle(endDateTime);

    const eventConfig = {
      summary: summary,
      start: { dateTime: formattedStart, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
      end: { dateTime: formattedEnd, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
      attendees: [{ email: attendeeEmail }],
      conferenceData: {
        createRequest: {
          conferenceSolutionKey: { type: 'hangoutsMeet' }
        }
      }
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: eventConfig,
      conferenceDataVersion: 1,
    });
    // Meet link from response
    const meetLink = response.data.conferenceData?.entryPoints?.[0]?.uri || 
                     response.data.hangoutLink || null;
    
    // Send email with Meet link to attendee
    if (meetLink && attendeeEmail) {
      try {
        const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
        const emailSubject = `Meeting Invitation: ${summary || 'Scheduled Meeting'}`;
        const emailBody = `
          <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <h2>Meeting Invitation</h2>
              <p><strong>Meeting:</strong> ${summary || 'Scheduled Meeting'}</p>
              <p><strong>Date & Time:</strong> ${new Date(formattedStart).toLocaleString()} - ${new Date(formattedEnd).toLocaleString()}</p>
              <p><strong>Google Meet Link:</strong></p>
              <p style="margin: 20px 0;">
                <a href="${meetLink}" style="background-color: #4285f4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Join Google Meet
                </a>
              </p>
              <p style="color: #666; font-size: 14px;">Or copy this link: ${meetLink}</p>
              <p style="margin-top: 30px; color: #999; font-size: 12px;">This meeting was scheduled via AI Assistant.</p>
            </body>
          </html>
        `;
        
        const emailLines = [
          `From: "AI Assistant" <${tokens.email || 'assistant@example.com'}>`,
          `To: ${attendeeEmail}`,
          `Subject: ${emailSubject}`,
          `Content-Type: text/html; charset=utf-8`,
          ``,
          emailBody
        ];
        const email = emailLines.join('\r\n');
        const encodedEmail = Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        
        await gmail.users.messages.send({
          userId: 'me',
          requestBody: { raw: encodedEmail }
        });
        
        console.log(`Meeting invite email sent to ${attendeeEmail} with Meet link`);
      } catch (emailError) {
        console.error('Error sending meeting invite email:', emailError);
        // Don't fail the whole request if email fails
      }
    }
    
    res.json({
      event: response.data,
      meetLink: meetLink,
      message: 'Meeting scheduled and Meet link sent via email.'
    });
  } catch (error) {
    console.error('Google Calendar API error:', error);
    const errorMessage = error.response?.data?.error?.message || error.message || 'Failed to schedule meeting';
    res.status(500).json({ error: errorMessage, details: error.response?.data?.error });
  }
});



// --- Get Upcoming Meetings Endpoint ---
app.get('/api/meetings/upcoming', async (req, res) => {
  const credentials = checkGoogleCredentials(res);
  if (!credentials) {
    return res.json({ meetings: [], message: 'Google credentials not configured' });
  }
  
  const tokens = checkGoogleToken(res);
  if (!tokens) {
    return res.json({ meetings: [], message: 'Please authenticate with Google first' });
  }
  
  const { client_secret, client_id, redirect_uris } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  oAuth2Client.setCredentials(tokens);
  
  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
  
  try {
    const now = new Date().toISOString();
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: now,
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });
    
    const meetings = (response.data.items || []).map(event => ({
      id: event.id,
      summary: event.summary || '(No title)',
      start: event.start?.dateTime || event.start?.date,
      end: event.end?.dateTime || event.end?.date,
      meetLink: event.conferenceData?.entryPoints?.[0]?.uri || event.hangoutLink || null,
      attendees: event.attendees?.map(a => a.email) || [],
      location: event.location || null
    }));
    
    res.json({ meetings });
  } catch (error) {
    console.error('Error fetching meetings:', error);
    res.status(500).json({ meetings: [], error: 'Failed to fetch meetings' });
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
