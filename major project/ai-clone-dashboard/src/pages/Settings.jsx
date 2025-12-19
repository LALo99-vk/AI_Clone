import React, { useState, useEffect } from 'react';
import { MdChevronRight, MdSettings } from 'react-icons/md';
import '../components/SettingsModal.css'; // Import your CSS

const API_BASE_URL = 'http://localhost:5000/api';

function SettingsModal({ category, aiSettings, setAiSettings, onClose }) {
  const [localSettings, setLocalSettings] = useState(aiSettings);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [validationMsg, setValidationMsg] = useState('');

  useEffect(() => {
    setLocalSettings(aiSettings);
    setValidationMsg('');
    setSaveStatus('');
  }, [aiSettings, category]);

  const handleChange = (key, value) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
    setValidationMsg('');
    setSaveStatus('');
  };
  const handleCheckbox = (key) => {
    setLocalSettings(prev => ({ ...prev, [key]: !prev[key] }));
    setValidationMsg('');
    setSaveStatus('');
  };

  const handleSave = async () => {
    // Inline validation example for Account email
    if (category === 'Account' && !localSettings.email) {
      setValidationMsg("Email is required.");
      return;
    }
    setSaving(true);
    setValidationMsg('');
    try {
      setAiSettings(prev => ({ ...prev, ...localSettings }));
      const response = await fetch(`${API_BASE_URL}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...aiSettings, ...localSettings })
      });
      if (response.ok) {
        setSaveStatus('Saved!');
        setTimeout(() => setSaveStatus(''), 1500);
        onClose();
      }
      else throw new Error("Failed to save");
    } catch (error) {
      setSaveStatus('Failed to save.');
      setTimeout(() => setSaveStatus(''), 2000);
    }
    setSaving(false);
  };

  return (
    <div className="modal-backdrop" tabIndex={-1} onClick={saving ? undefined : onClose}>
      <div className="settings-modal" tabIndex={0} onClick={e => e.stopPropagation()}>
        <h4>Edit {category} Settings</h4>
        {validationMsg && (
          <div className="status-msg error">{validationMsg}</div>
        )}
        {category === 'General' && (
          <>
            <label>Theme:</label>
            <select
              value={localSettings.theme || 'light'}
              onChange={e => handleChange('theme', e.target.value)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
              <option value="other">Other</option>
            </select>
            <label>Primary Color:</label>
            <input
              type="color"
              value={localSettings.primaryColor || "#635bff"}
              onChange={e => handleChange('primaryColor', e.target.value)}
              style={{ width: 55, height: 32, border: 0, marginBottom: 16 }}
            />
            <label>Accent Color:</label>
            <input
              type="color"
              value={localSettings.accentColor || "#ffb900"}
              onChange={e => handleChange('accentColor', e.target.value)}
              style={{ width: 55, height: 32, border: 0, marginBottom: 16 }}
            />
            <label>Language:</label>
            <select
              value={localSettings.language || 'English'}
              onChange={e => handleChange('language', e.target.value)}
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="Japanese">Japanese</option>
            </select>
            <label>Sidebar layout:</label>
            <select
              value={localSettings.sidebarLayout || 'expanded'}
              onChange={e => handleChange('sidebarLayout', e.target.value)}
            >
              <option value="expanded">Expanded</option>
              <option value="collapsed">Collapsed</option>
              <option value="auto">Auto</option>
            </select>
          </>
        )}
        {category === 'Account' && (
          <>
            <label>Email:</label>
            <input
              type="email"
              value={localSettings.email || ''}
              onChange={e => handleChange('email', e.target.value)}
              placeholder="Enter email"
            />
            <label>Full Name:</label>
            <input
              type="text"
              value={localSettings.fullName || ''}
              onChange={e => handleChange('fullName', e.target.value)}
              placeholder="Enter name"
            />
            <label>Password:</label>
            <input type="password" placeholder="Enter password" />
            <label>Timezone:</label>
            <select
              value={localSettings.timezone || 'UTC'}
              onChange={e => handleChange('timezone', e.target.value)}
            >
              <option value="UTC">UTC</option>
              <option value="IST">IST</option>
              <option value="EST">EST</option>
              <option value="PST">PST</option>
            </select>
          </>
        )}
        {category === 'Notifications' && (
          <>
            <label>Email Notifications:</label>
            <input
              type="checkbox"
              checked={localSettings.notificationsEnabled}
              onChange={() => handleCheckbox('notificationsEnabled')}
            /> Enable
            <br />
            <label>Push Notifications:</label>
            <input
              type="checkbox"
              checked={localSettings.pushNotifications || false}
              onChange={() => handleCheckbox('pushNotifications')}
            /> Enable
            <br />
            <label>Digest Frequency:</label>
            <select
              value={localSettings.digestFrequency || 'daily'}
              onChange={e => handleChange('digestFrequency', e.target.value)}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="never">Never</option>
            </select>
          </>
        )}
        {category === 'Integrations' && (
          <>
            <label>Google Calendar:</label>
            <input
              type="checkbox"
              checked={localSettings.gcalIntegrated || false}
              onChange={() => handleCheckbox('gcalIntegrated')}
            /> Connected
            <label>Slack:</label>
            <input
              type="checkbox"
              checked={localSettings.slackIntegrated || false}
              onChange={() => handleCheckbox('slackIntegrated')}
            /> Connected
            <label>Zoom:</label>
            <input
              type="checkbox"
              checked={localSettings.zoomIntegrated || false}
              onChange={() => handleCheckbox('zoomIntegrated')}
            /> Connected
          </>
        )}
        <div style={{ marginTop: 16 }}>
          <button onClick={handleSave} disabled={saving}>Save</button>
          <button className="cancel-btn" onClick={onClose} disabled={saving}>Cancel</button>
          {saveStatus && (
            <span className={`status-msg${saveStatus === 'Saved!' ? " saved" : " error"}`}>
              {saveStatus}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function Settings() {
  const [aiSettings, setAiSettings] = useState({
    theme: "light",
    primaryColor: "#635bff",
    accentColor: "#ffb900",
    language: "English",
    sidebarLayout: "expanded",
    realtimePrioritization: false,
    automatedAssignment: false,
    darkMode: false,
    notificationsEnabled: false,
    pushNotifications: false,
    digestFrequency: 'daily',
    email: '',
    fullName: '',
    timezone: 'UTC',
    gcalIntegrated: false,
    slackIntegrated: false,
    zoomIntegrated: false
  });
  const [loading, setLoading] = useState(true);
  const [modalCategory, setModalCategory] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/settings`);
        const data = await response.json();
        setAiSettings(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch settings:', error);
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const settingsCategories = [
    { name: 'General', description: 'Basic preferences' },
    { name: 'Account', description: 'Update your profile' },
    { name: 'Notifications', description: 'Manage your alerts' },
    { name: 'Integrations', description: 'Connected apps' },
  ];

  const handleSettingChange = (setting) => {
    setAiSettings(prev => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aiSettings),
      });

      if (response.ok) {
        alert('Settings saved successfully!');
      } else {
        alert('Failed to save settings.');
      }
    } catch (error) {
      console.error('Network error saving settings:', error);
      alert('Network error while saving settings.');
    }
  };

  if (loading) {
    return <div className="content-area">Loading Settings...</div>;
  }

  return (
    <div className="settings-page">
      <div className="settings-list-container card">
        {settingsCategories.map((category) => (
          <div
            key={category.name}
            className="settings-item"
            tabIndex={0}
            onClick={() => setModalCategory(category.name)}
          >
            <div className="settings-info">
              <h3 style={{ margin: "0 0 6px 0", fontWeight: 700 }}>{category.name}</h3>
              <p style={{ margin: 0, color: "#888fa5", fontSize: "15px" }}>{category.description}</p>
            </div>
            <MdChevronRight className="settings-arrow-icon" />
          </div>
        ))}
        <button className="settings-save-btn" onClick={handleSave}>
          Save
        </button>
      </div>
      {modalCategory && (
        <SettingsModal
          category={modalCategory}
          aiSettings={aiSettings}
          setAiSettings={setAiSettings}
          onClose={() => setModalCategory(null)}
        />
      )}
      <div className="card" style={{ marginTop: '30px', padding: '25px' }}>
        <h3><MdSettings style={{ marginRight: '5px' }} /> AI Optimization Settings</h3>
        <label className="checkbox-label" style={{ display: 'block', margin: '14px 0' }}>
          <input
            type="checkbox"
            name="realtimePrioritization"
            checked={aiSettings.realtimePrioritization}
            onChange={() => handleSettingChange('realtimePrioritization')}
          /> Enable Real-time Task Prioritization
        </label>
        <label className="checkbox-label" style={{ display: 'block', margin: '14px 0' }}>
          <input
            type="checkbox"
            name="automatedAssignment"
            checked={aiSettings.automatedAssignment}
            onChange={() => handleSettingChange('automatedAssignment')}
          /> Enable Automated Team Assignment
        </label>
      </div>
    </div>
  );
}

export default Settings;

