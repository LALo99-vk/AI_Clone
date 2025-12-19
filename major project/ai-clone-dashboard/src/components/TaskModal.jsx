// src/components/TaskModal.jsx
import React, { useState } from 'react';

const API_BASE_URL = 'http://localhost:5000/api';

function TaskModal({ isOpen, onClose, onTaskCreated }) {
  const [taskDetails, setTaskDetails] = useState({
    task: '',
    assignee: 'Anika', // Default assignee
    dueDate: new Date().toISOString().split('T')[0], // Default today
    priority: 'medium',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskDetails.task.trim()) {
      alert('Task name is required.');
      return;
    }
    
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskDetails),
      });

      if (response.ok) {
        alert(`Task "${taskDetails.task}" created successfully!`);
        // Reset state and notify parent component to refresh task list
        setTaskDetails({ task: '', assignee: 'Anika', dueDate: new Date().toISOString().split('T')[0], priority: 'medium' });
        onTaskCreated();
        onClose();
      } else {
        alert('Failed to create task.');
      }
    } catch (error) {
      alert('Network error while creating task.');
      console.error('Error creating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="task-modal card">
        <h3>Create New Task</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Task Name</label>
            <input 
              type="text" 
              name="task"
              value={taskDetails.task} 
              onChange={handleInputChange} 
              placeholder="e.g., Implement login feature"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Assignee</label>
            <select name="assignee" value={taskDetails.assignee} onChange={handleInputChange}>
              <option value="Anika">Anika</option>
              <option value="Riya">Riya</option>
              <option value="Rahul">Rahul</option>
              <option value="Priya">Priya</option>
              <option value="Unassigned">Unassigned</option>
            </select>
          </div>
          
          <div className="form-group-inline">
            <div className="form-group">
              <label>Due Date</label>
              <input 
                type="date" 
                name="dueDate"
                value={taskDetails.dueDate} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select name="priority" value={taskDetails.priority} onChange={handleInputChange}>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;