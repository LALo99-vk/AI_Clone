// ai-clone-dashboard-frontend/src/pages/Analytics.jsx
import React, { useState, useEffect } from 'react';
// 🛑 New: Import the chart component
import MonthlyChart from "../components/MonthlyChart.jsx"; 

const API_BASE_URL = 'http://localhost:5000/api'; 

function Analytics() {
  // Static stats reflect the screenshot data (1,250, 3,750, 125)
  const [stats, setStats] = useState({ users: '1,250', sessions: '3,750', conversions: '125' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading delay
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return <div className="content-area">Loading Analytics...</div>;
  }

  return (
    <div className="analytics-page">
      <h2>Analytics</h2>

      {/* Stats Grid */}
      <div className="grid-container dashboard-cards-grid analytics-stats" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div className="card dashboard-stat-card card-users bg-white p-6 rounded-xl shadow-lg">
          <p className="dashboard-stat-title text-gray-500 font-medium">Users</p>
          <h2 className="dashboard-stat-value text-3xl font-bold text-gray-800 mt-1">{stats.users}</h2>
        </div>
        <div className="card dashboard-stat-card card-sessions bg-white p-6 rounded-xl shadow-lg">
          <p className="dashboard-stat-title text-gray-500 font-medium">Sessions</p>
          <h2 className="dashboard-stat-value text-3xl font-bold text-gray-800 mt-1">{stats.sessions}</h2>
        </div>
        <div className="card dashboard-stat-card card-conversions bg-white p-6 rounded-xl shadow-lg">
          <p className="dashboard-stat-title text-gray-500 font-medium">Conversions</p>
          <h2 className="dashboard-stat-value text-3xl font-bold text-gray-800 mt-1">{stats.conversions}</h2>
        </div>
      </div>
      
      {/* Monthly Performance Chart Section */}
      <div className="card monthly-performance-section bg-white rounded-xl shadow-lg" 
           style={{ marginTop: '30px', padding: '25px' }}>
        
        <h3 className="text-2xl font-semibold text-gray-800 mb-3">Monthly Performance</h3>
        
        <p style={{ color: '#5b67e0', marginBottom: '20px', fontStyle: 'italic', fontSize: '0.9rem', borderLeft: '3px solid #5b67e0', paddingLeft: '10px' }}>
          **(AI Forecast): The system predicts a slight dip in performance next quarter due to expected market shifts.**
        </p>
        
        {/* 🛑 FIX: The chart component is rendered here */}
        <MonthlyChart />

      </div>
      
    </div>
  );
}

export default Analytics;