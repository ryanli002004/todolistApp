import React from "react";
import "./LogoutButton.css"; 

const LogoutButton = ({ onLogout }) => {
  return (
    <button className="logout-button" onClick={onLogout}>
      Log Out
    </button>
  );
};

export default LogoutButton;