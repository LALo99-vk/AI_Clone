# AI Clone Dashboard - Complete Setup Guide

## 📋 Overview

This is an AI-powered task management dashboard that allows you to:
- Manage tasks and delegate them to team members
- Use AI to send emails, schedule meetings, and delegate tasks via natural language
- View upcoming meetings and tasks in a unified dashboard
- Automate email and calendar operations through AI

**Key Features:**
- 🤖 AI Assistant for natural language commands
- 📧 Email sending and reading via Gmail API
- 📅 Calendar scheduling with Google Meet integration
- ✅ Task management and delegation
- 📊 Analytics and productivity tracking

---

## 🎯 Prerequisites

Before starting, ensure you have:

1. **Node.js** (v16 or higher)
   - Download from: https://nodejs.org/
   - Verify: `node --version`

2. **MongoDB** (local or cloud)
   - Local: Install from https://www.mongodb.com/try/download/community
   - Cloud: Create free cluster at https://www.mongodb.com/cloud/atlas

3. **Google Account** (for email and calendar features)
   - Any Gmail account works

4. **macOS/Linux/Windows** (all supported)

---

## 📦 Step 1: Project Setup

### 1.1 Extract/Navigate to Project

```bash
cd /path/to/majorproject
```

### 1.2 Install Backend Dependencies

```bash
cd ai-clone-dashboard-backend
npm install
```

### 1.3 Install Frontend Dependencies

```bash
cd ../ai-clone-dashboard
npm install
```

---

## 🔧 Step 2: Environment Configuration

### 2.1 Backend Environment Variables

Create `ai-clone-dashboard-backend/.env`:

```env
# MongoDB Connection (optional - will use default if not set)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=ai-clone-dashboard

# Or for local MongoDB:
# MONGODB_URI=mongodb://localhost:27017/ai-clone-dashboard
```

**Note:** If you skip this step, the backend will use a default MongoDB connection string.

### 2.2 Frontend Environment Variables

Create `ai-clone-dashboard/.env`:

```env
# Google OAuth Client ID (from Google Cloud Console)
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com

# Google API Key (optional, for Calendar API)
VITE_GOOGLE_API_KEY=your-api-key
```

**Note:** You'll get these values after setting up Google OAuth (Step 4).

---

## 🤖 Step 3: Install and Configure Ollama (AI Chat)

Ollama is required for the AI chat functionality.

### 3.1 Install Ollama

**macOS:**
```bash
brew install ollama
```

**Linux:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

**Windows:**
- Download installer from: https://ollama.com/download
- Run the installer

### 3.2 Verify Installation

```bash
ollama --version
```

### 3.3 Start Ollama Service

```bash
ollama serve
```

Keep this terminal window open. The service runs on `http://localhost:11434`.

### 3.4 Download Base Model

In a **new terminal window**:

```bash
ollama pull llama2
```

This may take several minutes depending on your internet connection (~4GB download).

### 3.5 Create Custom Model

```bash
cd ai-clone-dashboard-backend
ollama create llama2-short -f Modelfile
```

### 3.6 Verify Model Creation

```bash
ollama list
```

You should see `llama2-short` in the list.

---

## 🔐 Step 4: Google OAuth Setup (Email & Calendar)

This step is required for email sending and calendar scheduling features.

### 4.1 Create Google Cloud Project

1. Go to: https://console.cloud.google.com/
2. Click "Select a project" → "New Project"
3. Name it: `AI Clone Dashboard`
4. Click "Create"

### 4.2 Enable Required APIs

1. Go to: https://console.cloud.google.com/apis/library
2. Search and enable these APIs (click "Enable" for each):
   - **Gmail API**
   - **Google Calendar API**
   - (Optional) **Google Classroom API**

### 4.3 Create OAuth 2.0 Credentials

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure OAuth consent screen:
   - User Type: **External** (or Internal if using Google Workspace)
   - App name: `AI Clone Dashboard`
   - User support email: Your email
   - Developer contact: Your email
   - Click "Save and Continue" through all steps
   - Click "Back to Dashboard"

4. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: `AI Clone Dashboard`
   
   **Authorized JavaScript origins:**
   ```
   http://localhost:5173
   http://localhost:5000
   ```
   
   **Authorized redirect URIs:**
   ```
   http://localhost:5000/oauth2callback
   ```
   
   Click "Create"

### 4.4 Download Credentials

1. After creating, click the **download icon** (arrow) next to your OAuth client
2. Save the file as: `credentials.json`
3. Move it to: `ai-clone-dashboard-backend/credentials.json`

**Important:** Keep this file secure. Never commit it to version control.

### 4.5 Update Frontend Environment Variables

Open `ai-clone-dashboard/.env` and add:

```env
VITE_GOOGLE_CLIENT_ID=your-client-id-from-credentials.json
VITE_GOOGLE_API_KEY=your-api-key-optional
```

To find your Client ID:
- Open `credentials.json`
- Copy the value from `web.client_id`

### 4.6 Authenticate with Google

1. Start the backend server (see Step 5.1)
2. Open browser and visit: `http://localhost:5000/login/google`
3. Sign in with your Google account
4. Grant permissions when prompted
5. You'll be redirected and see "OAuth successful!"
6. A `token.json` file will be auto-generated in `ai-clone-dashboard-backend/`

**Note:** You only need to do this once. The `token.json` file stores your authentication.

---

## 🚀 Step 5: Start the Application

### 5.1 Start Backend Server

```bash
cd ai-clone-dashboard-backend
npm run dev
```

You should see:
```
Server running on http://localhost:5000
MongoDB Connected
```

### 5.2 Start Frontend Server

In a **new terminal window**:

```bash
cd ai-clone-dashboard
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

### 5.3 Verify Services

Make sure all services are running:

- ✅ **Ollama**: `http://localhost:11434` (background service)
- ✅ **Backend**: `http://localhost:5000`
- ✅ **Frontend**: `http://localhost:5173`

---

## ✅ Step 6: Verify Installation

### 6.1 Test Backend API

Open browser or use curl:

```bash
curl http://localhost:5000/
```

Should return: `AI Clone Dashboard Backend API is running!`

### 6.2 Test Dashboard Stats

```bash
curl http://localhost:5000/api/dashboard/stats
```

Should return JSON with statistics.

### 6.3 Test AI Chat

```bash
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello, how are you?"}'
```

Should return JSON with AI response.

### 6.4 Open Dashboard

1. Open browser: `http://localhost:5173`
2. You should see the login/dashboard page
3. Try the AI chat feature
4. Check the "Upcoming Meetings" section

---

## 🎯 Step 7: Testing Features

### 7.1 Test AI Email Sending

In the AI chat box, try:
```
send email to someone@example.com about project update saying the project is on track
```

### 7.2 Test AI Calendar Scheduling

In the AI chat box, try:
```
schedule a meeting with someone@example.com tomorrow at 2pm
```

### 7.3 Test Task Delegation

In the AI chat box, try:
```
assign fix login bug to Anika
```

### 7.4 Test Email Reading

In the AI chat box, try:
```
read my emails
show my inbox
```

---

## 📁 Project Structure

```
majorproject/
├── ai-clone-dashboard-backend/     # Backend server (Node.js/Express)
│   ├── server.js                   # Main server file
│   ├── credentials.json            # Google OAuth (you add this)
│   ├── token.json                  # Auto-generated after auth
│   ├── .env                        # Environment variables
│   └── models/                     # Database models
│
├── ai-clone-dashboard/             # Frontend (React/Vite)
│   ├── src/
│   │   ├── pages/                  # Dashboard pages
│   │   ├── components/             # React components
│   │   └── api/                    # API clients
│   └── .env                        # Frontend environment variables
│
└── ollama-agent/                   # Python agent (optional)
```

---

## 🔍 Troubleshooting

### Backend won't start

**Error:** `Port 5000 already in use`
- **Solution:** Kill the process: `lsof -ti:5000 | xargs kill -9`
- Or change port in `server.js`

**Error:** `Cannot connect to MongoDB`
- **Solution:** 
  - Check MongoDB is running: `mongosh` (local) or verify cloud connection string
  - Verify `MONGODB_URI` in `.env` is correct

### Ollama not working

**Error:** `Cannot find module 'ollama'` or AI chat fails
- **Solution:**
  - Verify Ollama is installed: `ollama --version`
  - Start Ollama service: `ollama serve`
  - Verify model exists: `ollama list` (should show `llama2-short`)
  - If model missing: `cd ai-clone-dashboard-backend && ollama create llama2-short -f Modelfile`

### Google OAuth errors

**Error:** `Google credentials not configured`
- **Solution:** 
  - Ensure `credentials.json` exists in `ai-clone-dashboard-backend/`
  - Verify file format is valid JSON

**Error:** `Redirect URI mismatch`
- **Solution:**
  - In Google Cloud Console, verify redirect URI is exactly: `http://localhost:5000/oauth2callback`
  - Check authorized JavaScript origins include: `http://localhost:5173` and `http://localhost:5000`

**Error:** `Token expired` or authentication fails
- **Solution:**
  - Delete `ai-clone-dashboard-backend/token.json`
  - Re-authenticate: Visit `http://localhost:5000/login/google`

### Frontend can't connect to backend

**Error:** CORS errors or API calls fail
- **Solution:**
  - Verify backend is running on port 5000
  - Check browser console for errors
  - Verify `API_BASE_URL` in frontend code points to `http://localhost:5000`

### Meetings/Emails not working

**Error:** Email sending fails or meetings not scheduling
- **Solution:**
  - Verify Google OAuth is set up (Step 4)
  - Check you've authenticated: `http://localhost:5000/login/google`
  - Verify `token.json` exists in `ai-clone-dashboard-backend/`
  - Check Gmail API and Calendar API are enabled in Google Cloud Console

---

## 📊 Port Summary

| Service | Port | URL |
|---------|------|-----|
| Frontend | 5173 | http://localhost:5173 |
| Backend | 5000 | http://localhost:5000 |
| Ollama | 11434 | http://localhost:11434 |
| MongoDB (local) | 27017 | mongodb://localhost:27017 |

---

## 🎓 Usage Guide

### AI Chat Commands

The AI understands natural language for:

**Email:**
- `send email to john@example.com about meeting saying we need to discuss the project`
- `read my emails`
- `show my inbox`

**Calendar:**
- `schedule a meeting with sarah@example.com tomorrow at 3pm`
- `book calendar event with team@company.com`
- `set up a meeting with client@example.com next Monday at 10am`

**Task Delegation:**
- `assign fix bug to Anika`
- `delegate update documentation to Riya`
- `create task review code for Rahul high priority`

### Available Team Members

- **Anika** (Backend, DevOps)
- **Riya** (Design, Frontend)
- **Rahul** (Data Modeling, Finance)
- **Priya** (QA, Testing)

---

## 🔒 Security Notes

1. **Never commit credentials:**
   - `credentials.json` should be in `.gitignore`
   - `token.json` should be in `.gitignore`
   - `.env` files should be in `.gitignore`

2. **Keep credentials secure:**
   - Don't share `credentials.json` or `token.json`
   - Rotate credentials if compromised

3. **Production deployment:**
   - Use environment variables instead of `.env` files
   - Set up proper CORS policies
   - Use HTTPS
   - Secure MongoDB connection

---

## 📞 Support

If you encounter issues:

1. Check the Troubleshooting section above
2. Verify all prerequisites are installed
3. Check service logs (backend console, browser console)
4. Ensure all services are running on correct ports

---

## ✅ Quick Checklist

Before considering setup complete:

- [ ] Node.js installed
- [ ] MongoDB accessible (local or cloud)
- [ ] Backend dependencies installed (`npm install`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Ollama installed and running
- [ ] `llama2-short` model created
- [ ] Google OAuth credentials downloaded
- [ ] `credentials.json` in `ai-clone-dashboard-backend/`
- [ ] `.env` files created (backend and frontend)
- [ ] Google OAuth authentication completed
- [ ] Backend server running (`npm run dev`)
- [ ] Frontend server running (`npm run dev`)
- [ ] Dashboard accessible at `http://localhost:5173`
- [ ] AI chat responding
- [ ] Can send emails via AI
- [ ] Can schedule meetings via AI
- [ ] Can delegate tasks via AI

---

**Setup Complete! 🎉**

Your AI Clone Dashboard is now ready to use. Visit `http://localhost:5173` to get started.

