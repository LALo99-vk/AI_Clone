import React from 'react';
import { NavLink } from 'react-router-dom';
import { MdDashboard, MdAssignment, MdGroup, MdSettings, MdBarChart, MdEmail } from 'react-icons/md';

const navItems = [
  { to: '/', name: 'Dashboard', icon: <MdDashboard /> },
  { to: '/tasks', name: 'Tasks', icon: <MdAssignment /> },
  { to: '/team', name: 'Team', icon: <MdGroup /> },
  { to: '/analytics', name: 'Analytics', icon: <MdBarChart /> },
  { to: '/settings', name: 'Settings', icon: <MdSettings /> },
  { to: '/send-email', name: 'Send Email', icon: <MdEmail /> }  // <-- NEW MENU ITEM
];

const Sidebar = () => (
  <nav className="sidebar">
    {navItems.map(item => (
      <NavLink
        key={item.to}
        to={item.to}
        className={({ isActive }) =>
          isActive ? 'sidebar-link active' : 'sidebar-link'
        }
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 24px',
          color: '#262e47',
          textDecoration: 'none',
          fontWeight: 500,
          fontSize: 17,
          borderRadius: '7px',
          marginBottom: 4,
          transition: 'background 0.17s, color 0.17s'
        }}
      >
        {item.icon}
        <span>{item.name}</span>
      </NavLink>
    ))}
  </nav>
);

export default Sidebar;
