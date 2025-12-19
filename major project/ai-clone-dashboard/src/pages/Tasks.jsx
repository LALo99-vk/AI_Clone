// src/pages/Tasks.jsx
import React, { useState, useEffect, useCallback } from 'react';
import TaskModal from '../components/TaskModal'; // <-- IMPORT THE NEW MODAL

const API_BASE_URL = 'http://localhost:5000/api';

function Tasks() {
  // 1. Initialize state with the EXACT keys the frontend UI expects, 
  // but be ready to map the backend keys in fetchTasks.
  const [tasksData, setTasksData] = useState({
    'To-Do': [],
    'In Progress': [],
    'Done': [],
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 2. Fetch tasks and CORRECT the status keys on the frontend
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/tasks/kanban`);
      const data = await response.json();
      
      // 🛑 CRITICAL FIX: The backend returns keys like 'To Do' and 'In-progress'.
      // We must map them to the keys the frontend UI uses ('To-Do', 'In Progress').
      const remappedData = {
        'To-Do': data['To Do'] || [], // Map backend 'To Do' to frontend 'To-Do'
        'In Progress': data['In-progress'] || [], // Map backend 'In-progress' to frontend 'In Progress'
        'Done': data['Done'] || [], // 'Done' key is consistent
      };

      setTasksData(remappedData);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch kanban data:', error);
      setLoading(false);
    }
  }, []); // useCallback ensures fetchTasks is stable

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]); // Rerun fetchTasks when component mounts

  // Handler passed to the modal to close it and refresh the list
  const handleTaskCreated = () => {
    setIsModalOpen(false); // Close the modal
    fetchTasks(); // Refresh the list to show the new task from the DB
  };
  
  // Helper function for rendering task priority dots
  const getPriorityColor = (priority) => {
    switch ((priority || '').toLowerCase()) {
      case 'high': return '#e57373'; 
      case 'medium': return '#ffb74d'; 
      case 'low': return '#aed581'; 
      default: return '#ccc';
    }
  };

  if (loading) {
    return <div className="content-area">Loading Tasks Data...</div>;
  }

  // Use the frontend's expected column keys
  const statusColumns = ['To-Do', 'In Progress', 'Done']; 

  return (
    <div className="tasks-page">
      <div className="flex-container tasks-toolbar">
        {/* Button now opens the modal */}
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>Create Task</button>
      </div>

      <div className="kanban-board grid-container">
        {statusColumns.map((status) => (
          <div key={status} className="kanban-column card">
            <h3>{status}</h3>
            <div className="tasks-list">
              {/* Ensure you use the correct data key */}
              {(tasksData[status] || []).map((task) => (
                // Use task._id if available (from MongoDB) otherwise fallback to task.id
                <div key={task._id || task.id} className="kanban-task-card"> 
                  <span className="task-priority-dot" style={{ backgroundColor: getPriorityColor(task.priority) }}></span>
                  <span>{task.task}</span>
                  {/* Optional: Display assignee or due date */}
                  <small style={{display: 'block', color: '#666'}}>Assigned: {task.assignee}</small>
                </div>
              ))}
              {(tasksData[status] || []).length === 0 && (
                <p style={{ color: '#aaa', fontSize: '0.9rem', textAlign: 'center' }}>No tasks in this column.</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="card filters-section" style={{ marginTop: '30px' }}>
        <h3>Filters</h3>
        <div className="grid-container filters-grid">
          <input type="text" placeholder="Priority" className="filter-input" />
          <input type="date" placeholder="Due Date" className="filter-input" />
          <input type="text" placeholder="Assignee" className="filter-input" />
        </div>
      </div>
      
      {/* Modal Component */}
      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onTaskCreated={handleTaskCreated} // Pass the handler to refresh the list
      />
    </div>
  );
}

export default Tasks;