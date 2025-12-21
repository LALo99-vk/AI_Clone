import React, { useState } from 'react';

const EmailSender = () => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [htmlBody, setHtmlBody] = useState('');
  const [status, setStatus] = useState(null);

  const sendEmail = () => {
    fetch('http://localhost:5000/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to,
        subject,
        htmlBody
      })
    })
      .then(res => res.json())
      .then(data => setStatus(data.status || data.error))
      .catch(() => setStatus('Error sending email'));
  };

  return (
    <div style={{
      maxWidth: 440,
      background: "#fff",
      margin: "48px auto",
      padding: "32px 32px 16px 32px",
      borderRadius: 10,
      boxShadow: "0 4px 12px rgba(0,0,0,0.07)"
    }}>
      <h2 style={{ textAlign: "center", marginBottom: 28, color: "#262E47", fontWeight: 700, fontSize: 28 }}>Send Test Email</h2>

      <label style={{ fontWeight: 500 }}>Recipient:</label>
      <input
        type="email"
        placeholder="Recipient email"
        value={to}
        onChange={e => setTo(e.target.value)}
        style={{ width: "100%", padding: 10, border: "1px solid #d1d5db", borderRadius: 6, marginBottom: 14, fontSize: 15 }}
      />

      <label style={{ fontWeight: 500 }}>Subject:</label>
      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={e => setSubject(e.target.value)}
        style={{ width: "100%", padding: 10, border: "1px solid #d1d5db", borderRadius: 6, marginBottom: 14, fontSize: 15 }}
      />

      <label style={{ fontWeight: 500 }}>HTML Body:</label>
      <textarea
        placeholder="HTML body"
        value={htmlBody}
        onChange={e => setHtmlBody(e.target.value)}
        rows={5}
        style={{ width: "100%", padding: 10, border: "1px solid #d1d5db", borderRadius: 6, marginBottom: 14, fontSize: 15, fontFamily: "inherit", resize: "vertical" }}
      />

      <button
        onClick={sendEmail}
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
        Send Email
      </button>

      {status && (
        <p style={{
          marginTop: 10,
          color: status === "HTML Email sent" ? "#25c382" : "#f43f5e",
          fontWeight: 500,
          textAlign: "center"
        }}>
          {status}
        </p>
      )}
    </div>
  );
};

export default EmailSender;
