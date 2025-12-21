// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { listEvents } from '../api/googleCalendar';


const API_BASE_URL = 'http://localhost:5000/api'; 

function Dashboard() {
  const [stats, setStats] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [productivity, setProductivity] = useState({ completionRate: '0%', forecast: 'Loading...' });
  const [loading, setLoading] = useState(true);
  
  // State for Task Assignment form
  const [newTask, setNewTask] = useState({
    task: '',
    assignee: 'Anika', // Default assignee (Assuming Anika is a default team member)
  });

  // State for AI Chat
  const [chatPrompt, setChatPrompt] = useState('');
  const [chatResponse, setChatResponse] = useState('Welcome! Ask me for a productivity insight.');
  const [isSending, setIsSending] = useState(false);


  const fetchData = async () => {
      try {
        const statsResponse = await fetch(`${API_BASE_URL}/dashboard/stats`);
        const statsData = await statsResponse.json();
        setStats(statsData.stats);
        setProductivity(statsData.productivity);

        const tasksResponse = await fetch(`${API_BASE_URL}/dashboard/recent-tasks`);
        const tasksData = await tasksResponse.json();
        setRecentTasks(tasksData);

        // Fetch upcoming meetings
        try {
          const meetingsResponse = await fetch(`${API_BASE_URL}/meetings/upcoming`);
          const meetingsData = await meetingsResponse.json();
          setUpcomingMeetings(meetingsData.meetings || []);
        } catch (meetingError) {
          console.error('Failed to fetch meetings:', meetingError);
          setUpcomingMeetings([]);
        }

        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchData();
  }, []); 

  // --- 1. Task Assignment Handler (POST) ---
  const handleAssignTask = async () => {
    if (!newTask.task.trim()) {
      alert('Task description cannot be empty.');
      return;
    }

    try {
      // NOTE: This POST request uses the same endpoint as the Tasks page modal
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task: newTask.task,
          assignee: newTask.assignee,
          // Status, priority, etc., are defaulted by the backend
        }),
      });

      if (response.ok) {
        // Task created successfully, refresh data and clear form
        await fetchData(); 
        setNewTask({ task: '', assignee: 'Anika' });
        alert(`Task assigned successfully to ${newTask.assignee}!`);
      } else {
        alert('Failed to assign task.');
      }
    } catch (error) {
      console.error('Error assigning task:', error);
      alert('Network error while assigning task.');
    }
  };

  // --- 2. AI Chat Handler (POST) ---
  const handleSendChat = async () => {
    if (!chatPrompt.trim()) return;

    setIsSending(true);
    setChatResponse('AI is thinking...');

    try {
      const response = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: chatPrompt }),
      });

      const data = await response.json();
      setChatResponse(data.response); // Display simulated AI response
      setChatPrompt('');
    } catch (error) {
      setChatResponse('Error: Could not connect to AI service.');
    } finally {
      setIsSending(false);
    }
  };


  if (loading) {
    return <div className="content-area">Loading Dashboard Data...</div>;
  }

  // Determine the AI Focus Recommendation
  const aiFocusRecommendation = (() => {
    if (!stats || stats.length === 0) return "Analyzing project data...";

    const overdue = stats.find(s => s.title === 'Overdue')?.value || 0;
    const pending = stats.find(s => s.title === 'Pending')?.value || 0;

    if (overdue > 0) {
      return `⚠️ **Critical Alert:** ${overdue} tasks are overdue! Immediate focus is required on backlog resolution.`;
    } else if (pending > 5) {
      return `✨ **AI Focus Recommendation:** ${pending} tasks are pending. Focus on assignment and initialization to prevent future delays.`;
    }
    return `✅ **System Status:** All metrics are stable. Productivity is ${productivity.forecast}.`;
  })();


  return (
    <div className="dashboard-page">
      {/* AI Focus Recommendation Card */}
      <div className="ai-card" style={{ marginBottom: '30px', borderLeft: '4px solid #5b67e0' }}>
        <p dangerouslySetInnerHTML={{ __html: aiFocusRecommendation }} />
        <p className="ai-label">Productivity Forecast: {productivity.completionRate} completion rate.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid-container dashboard-cards-grid">
        {stats.map((stat) => (
          <div key={stat.title} className={`card dashboard-stat-card card-${stat.type}`}>
            <p className="dashboard-stat-title">{stat.title}</p>
            <h2 className="dashboard-stat-value">{stat.value}</h2>
          </div>
        ))}
         {/* Display Productivity as a fourth card */}
        <div className="card dashboard-stat-card card-productivity">
            <p className="dashboard-stat-title">Productivity</p>
            <h2 className="dashboard-stat-value">{productivity.completionRate}</h2>
        </div>
      </div>

      <div className="flex-container dashboard-main-content">
        <div className="card recent-tasks-section">
          <div className="flex-container recent-tasks-header" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            {/* Task Input Form (Assign Task) */}
            <div style={{ display: 'flex', gap: '10px', width: '100%', marginBottom: '15px' }}>
              <input
                type="text"
                placeholder={`Enter task for ${newTask.assignee}...`}
                value={newTask.task}
                onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
                style={{ flexGrow: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
              <button 
                className="btn btn-primary" 
                onClick={handleAssignTask}
                style={{ flexShrink: 0 }}
              >
                Assign Task
              </button>
            </div>
            <h3>AI Prioritized Tasks</h3>
          </div>
          <table className="tasks-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Assignee</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTasks.map((task) => (
                <tr key={task.id}>
                  <td>
                    {task.task}
                    {task.isAIPrioritized && <span style={{marginLeft: '10px', fontSize: '0.75rem', color: '#5b67e0'}}>*AI Priority</span>}
                  </td>
                  <td>{task.assignee}</td>
                  <td>{task.dueDate}</td>
                  <td><span className={`status-badge ${task.status.toLowerCase().replace(' ', '-')}`}>{task.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* AI Assistant Chat */}
        <div className="card ai-assistant-chat">
          <h3 className="ai-assistant-title">🤖 AI Assistant</h3>
          <div className="ai-chat-box">
            {/* Display AI Response */}
            {chatResponse && (
              <div style={{ backgroundColor: '#f0f2f5', padding: '10px', borderRadius: '6px', marginBottom: '10px', fontSize: '0.9rem' }}>
                <p style={{ fontWeight: 600, color: '#5b67e0' }}>AI:</p>
                <p>{chatResponse}</p>
              </div>
            )}
            
            <textarea 
              placeholder="Ask something..." 
              className="ai-chat-input"
              value={chatPrompt}
              onChange={(e) => setChatPrompt(e.target.value)}
              disabled={isSending}
            ></textarea>
            <button 
              className="btn btn-primary ai-send-btn"
              onClick={handleSendChat}
              disabled={isSending || !chatPrompt.trim()}
            >
              {isSending ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </div>

      {/* Upcoming Meetings Section */}
      <div className="card" style={{ marginTop: '30px' }}>
        <h3 style={{ marginBottom: '20px' }}>📅 Upcoming Meetings</h3>
        {upcomingMeetings.length === 0 ? (
          <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
            No upcoming meetings. Schedule one using the AI chat or the Schedule Meeting page!
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {upcomingMeetings.map((meeting) => {
              const startDate = new Date(meeting.start);
              const endDate = new Date(meeting.end);
              const isAllDay = !meeting.start.includes('T');
              
              return (
                <div 
                  key={meeting.id} 
                  style={{ 
                    border: '1px solid #e0e0e0', 
                    borderRadius: '8px', 
                    padding: '15px',
                    backgroundColor: '#fafafa'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 8px 0', color: '#262E47' }}>{meeting.summary}</h4>
                      <p style={{ margin: '4px 0', color: '#666', fontSize: '0.9rem' }}>
                        <strong>When:</strong> {isAllDay 
                          ? startDate.toLocaleDateString() 
                          : `${startDate.toLocaleString()} - ${endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                        }
                      </p>
                      {meeting.attendees && meeting.attendees.length > 0 && (
                        <p style={{ margin: '4px 0', color: '#666', fontSize: '0.9rem' }}>
                          <strong>Attendees:</strong> {meeting.attendees.join(', ')}
                        </p>
                      )}
                      {meeting.location && (
                        <p style={{ margin: '4px 0', color: '#666', fontSize: '0.9rem' }}>
                          <strong>Location:</strong> {meeting.location}
                        </p>
                      )}
                    </div>
                    {meeting.meetLink && (
                      <a 
                        href={meeting.meetLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                          backgroundColor: '#4285f4',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '5px',
                          textDecoration: 'none',
                          fontSize: '0.9rem',
                          whiteSpace: 'nowrap',
                          marginLeft: '15px'
                        }}
                      >
                        Join Meet
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div style={{ marginTop: '15px', textAlign: 'center' }}>
          <a 
            href="https://calendar.google.com" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#5b67e0', textDecoration: 'none', fontSize: '0.9rem' }}
          >
            View all meetings in Google Calendar →
          </a>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;