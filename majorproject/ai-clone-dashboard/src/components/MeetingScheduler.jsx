import React, { useState } from 'react';

const MeetingScheduler = () => {
  const [summary, setSummary] = useState('');
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [attendeeEmail, setAttendeeEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [meetLink, setMeetLink] = useState('');

  const scheduleMeeting = () => {
    if (!summary || !startDateTime || !endDateTime || !attendeeEmail) {
      setStatus('Please fill in all fields');
      return;
    }

    fetch('http://localhost:5000/api/schedule-meeting', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        summary,
        startDateTime,
        endDateTime,
        attendeeEmail
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.meetLink) {
          setStatus('Meeting scheduled successfully!');
          setMeetLink(data.meetLink);
        } else if (data.error) {
          setStatus(`Error: ${data.error}`);
          setMeetLink('');
        } else {
          setStatus('Meeting scheduled successfully!');
          setMeetLink(data.event?.hangoutLink || '');
        }
      })
      .catch(err => {
        setStatus('Error scheduling meeting: ' + err.message);
        setMeetLink('');
      });
  };

  // Helper to get default times (next hour, 1 hour duration)
  const getDefaultTimes = () => {
    const now = new Date();
    const start = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now
    const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour after start
    
    const formatDateTime = (date) => {
      return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM
    };
    
    return {
      start: formatDateTime(start),
      end: formatDateTime(end)
    };
  };

  // Set default times on component mount
  React.useEffect(() => {
    const { start, end } = getDefaultTimes();
    if (!startDateTime) setStartDateTime(start);
    if (!endDateTime) setEndDateTime(end);
  }, []);

  return (
    <div style={{
      maxWidth: 440,
      background: "#fff",
      margin: "48px auto",
      padding: "32px 32px 16px 32px",
      borderRadius: 10,
      boxShadow: "0 4px 12px rgba(0,0,0,0.07)"
    }}>
      <h2 style={{ textAlign: "center", marginBottom: 28, color: "#262E47", fontWeight: 700, fontSize: 28 }}>Schedule Meeting</h2>

      <label style={{ fontWeight: 500, display: 'block', marginBottom: 5 }}>Meeting Title:</label>
      <input
        type="text"
        placeholder="e.g., Team Sync Meeting"
        value={summary}
        onChange={e => setSummary(e.target.value)}
        style={{ width: "100%", padding: 10, border: "1px solid #d1d5db", borderRadius: 6, marginBottom: 14, fontSize: 15 }}
      />

      <label style={{ fontWeight: 500, display: 'block', marginBottom: 5 }}>Start Date & Time:</label>
      <input
        type="datetime-local"
        value={startDateTime}
        onChange={e => setStartDateTime(e.target.value)}
        style={{ width: "100%", padding: 10, border: "1px solid #d1d5db", borderRadius: 6, marginBottom: 14, fontSize: 15 }}
      />

      <label style={{ fontWeight: 500, display: 'block', marginBottom: 5 }}>End Date & Time:</label>
      <input
        type="datetime-local"
        value={endDateTime}
        onChange={e => setEndDateTime(e.target.value)}
        style={{ width: "100%", padding: 10, border: "1px solid #d1d5db", borderRadius: 6, marginBottom: 14, fontSize: 15 }}
      />

      <label style={{ fontWeight: 500, display: 'block', marginBottom: 5 }}>Attendee Email:</label>
      <input
        type="email"
        placeholder="attendee@example.com"
        value={attendeeEmail}
        onChange={e => setAttendeeEmail(e.target.value)}
        style={{ width: "100%", padding: 10, border: "1px solid #d1d5db", borderRadius: 6, marginBottom: 14, fontSize: 15 }}
      />

      <button
        onClick={scheduleMeeting}
        style={{
          width: "100%",
          padding: 12,
          background: "#635bff",
          color: "#fff",
          fontWeight: 600,
          fontSize: 15,
          border: "none",
          borderRadius: 7,
          cursor: "pointer",
          marginBottom: 10
        }}>
        Schedule Meeting
      </button>

      {status && (
        <p style={{
          marginTop: 10,
          color: status.includes('Error') ? "#f43f5e" : "#25c382",
          fontWeight: 500,
          textAlign: "center",
          marginBottom: 10
        }}>
          {status}
        </p>
      )}

      {meetLink && (
        <div style={{
          marginTop: 15,
          padding: 12,
          background: "#f0f9ff",
          border: "1px solid #0ea5e9",
          borderRadius: 6
        }}>
          <p style={{ fontWeight: 600, marginBottom: 8, color: "#0c4a6e" }}>Google Meet Link:</p>
          <a 
            href={meetLink} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              color: "#0284c7",
              textDecoration: "underline",
              wordBreak: "break-all"
            }}
          >
            {meetLink}
          </a>
        </div>
      )}
    </div>
  );
};

export default MeetingScheduler;

