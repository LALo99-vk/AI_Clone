// src/App.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, Routes, Route, useNavigate } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Team from './pages/Team';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import EmailSender from './components/EmailSender';
import MeetingScheduler from './components/MeetingScheduler';

// Import initializeGapi from your API folder
import { initializeGapi } from "./api/googleCalendar";

const getPageTitle = (pathname) => {
  switch (pathname) {
    case '/tasks':
      return 'Task Management';
    case '/team':
      return 'Team Overview';
    case '/analytics':
      return 'Analytics';
    case '/settings':
      return 'Settings';
    case '/send-email':
      return 'Send Email';
    case '/schedule-meeting':
      return 'Schedule Meeting';
    case '/dashboard':
    default:
      return 'Dashboard';
  }
};

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('loggedInUser'));
  const [aiSettings, setAiSettings] = useState({ theme: "light" });

  // Initialize Google Calendar API Client ONCE (add this useEffect near the top)
  useEffect(() => {
    initializeGapi().catch(console.error);
  }, []);

  // Load AI settings on mount
  useEffect(() => {
    const raw = localStorage.getItem('aiSettings');
    if (raw) {
      setAiSettings(JSON.parse(raw));
    }
  }, []);

  // Save theme changes
  useEffect(() => {
    localStorage.setItem('aiSettings', JSON.stringify(aiSettings));
  }, [aiSettings]);

  // Theme toggle effect
  useEffect(() => {
    let shouldDark = false;
    if (aiSettings.theme === "system") {
      shouldDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      shouldDark = aiSettings.theme === "dark";
    }
    document.body.classList.toggle("darkmode", shouldDark);
  }, [aiSettings.theme]);

  // Keep session
  useEffect(() => {
    if (localStorage.getItem('loggedInUser')) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = (email) => {
    setIsAuthenticated(true);
    localStorage.setItem('loggedInUser', email);
    if (location.pathname === '/' || location.pathname === '/login') {
      navigate('/dashboard');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('loggedInUser');
    navigate('/');
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const currentPageTitle = getPageTitle(location.pathname);

  return (
    <div className="app-container">
      <Sidebar handleLogout={handleLogout} />
      <div className="main-content-wrapper">
        <Header pageTitle={currentPageTitle} handleLogout={handleLogout} />
        <main className="content-area">
          <Routes>
            <Route path="/" element={<Dashboard />} /> 
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/team" element={<Team />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={
              <Settings aiSettings={aiSettings} setAiSettings={setAiSettings} />
            } />
            <Route path="/send-email" element={<EmailSender />} />
            <Route path="/schedule-meeting" element={<MeetingScheduler />} />
            <Route path="*" element={<h1>404 Not Found</h1>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
