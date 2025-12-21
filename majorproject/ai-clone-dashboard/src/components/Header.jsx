import React from 'react';
import { IoIosSearch } from 'react-icons/io';
import { IoNotificationsOutline } from 'react-icons/io5';
import profilePic from '../assets/profile.png';

function Header({ pageTitle, handleLogout }) {
  return (
    <header
      className="header"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px 28px",
        borderBottom: "1px solid #eee",
        background: "#fff",
        minHeight: "70px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.01)"
      }}
    >
      <h1 className="page-title" style={{ fontSize: 28, color: "#262e47", fontWeight: 700, margin: 0 }}>
        {pageTitle}
      </h1>
      <div className="header-right" style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div className="search-bar" style={{
          display: "flex",
          alignItems: "center",
          background: "#f6f7fb",
          borderRadius: 7,
          padding: "6px 12px"
        }}>
          <IoIosSearch className="search-icon" style={{ color: "#aaa", fontSize: 20 }} />
          <input
            type="text"
            placeholder="Search..."
            style={{
              border: "none",
              background: "transparent",
              marginLeft: 4,
              outline: "none",
              fontSize: 16,
              color: "#262e47"
            }}
          />
        </div>
        <IoNotificationsOutline className="notification-icon" style={{ fontSize: 26, color: "#7a849c", cursor: "pointer" }} />
        <div className="profile-section" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img src={profilePic} alt="Profile" className="profile-pic" style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            objectFit: "cover",
            border: "1.5px solid #eee"
          }} />
          {/* <span className="profile-name">Admin</span> */}
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: "#ff4d4f",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            fontWeight: 600,
            cursor: "pointer",
            fontSize: 16,
            padding: "10px 24px",
            marginLeft: 15,
            boxShadow: "0 1px 3px rgba(255,77,79,0.09)"
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
