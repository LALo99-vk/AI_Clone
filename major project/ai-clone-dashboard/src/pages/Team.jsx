import React, { useState, useEffect } from 'react';
import { MdCheckCircle, MdGroup } from 'react-icons/md'; 

const API_BASE_URL = 'http://localhost:5000/api';

function Team() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [aiInsight, setAiInsight] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/team/insights`);
        const data = await response.json();
        setTeamMembers(data.members);
        setAiInsight(data.aiInsight);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch team data:', error);
        setLoading(false);
      }
    };
    fetchTeamData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return '#aed581'; // Green
      case 'Inactive': return '#ffb74d'; // Orange
      case 'On Leave': return '#ef9a9a'; // Red
      default: return '#ccc';
    }
  };

  const activeMembers = teamMembers.filter(m => m.status === 'Available').length;
  const teamStats = [
    { title: 'Active Members', value: activeMembers, colorClass: 'stat-active' },
    { title: 'Total Members', value: teamMembers.length, colorClass: 'stat-total', icon: <MdGroup /> },
    { title: 'Highest Skill Load', value: aiInsight.focus || 'N/A', colorClass: 'stat-load' },
  ];

  if (loading) {
    return <div className="content-area">Loading Team Data...</div>;
  }

  return (
    <div className="team-page">
      {/* Team Stats Grid */}
      <div className="grid-container team-stats-grid">
        {teamStats.map((stat) => (
          <div key={stat.title} className={`card team-stat-card ${stat.colorClass}`}>
            <p className="team-stat-title">{stat.title}</p>
            <h2 className="team-stat-value">{stat.icon} {stat.value}</h2>
          </div>
        ))}
      </div>

      {/* AI Skill Gap Alert */}
      {aiInsight.recommendation && (
        <div className="ai-alert card" style={{ padding: '20px', borderLeft: '4px solid #5b67e0', marginBottom: '30px', backgroundColor: '#eef2f8' }}>
            <p style={{ fontWeight: 600, color: '#5b67e0', marginBottom: '5px' }}>🚨 AI Skill/Load Insight</p>
            <p>{aiInsight.recommendation}</p>
        </div>
      )}

      {/* Team Member Cards Grid */}
      <div className="grid-container team-members-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        {teamMembers.map((member) => (
          <div key={member.id} className="card team-member-card">
            <img src={member.avatar} alt={member.name} className="member-avatar" />
            <h3>{member.name}</h3>
            <p className="member-status" style={{ color: getStatusColor(member.status) }}>
              {member.status}
            </p>
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${member.progress}%`, backgroundColor: getStatusColor(member.status) }}></div>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#777', marginTop: '10px' }}>
              Skills: {member.skillSet ? member.skillSet.join(', ') : 'N/A'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Team;