import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPasswordForm from "./ForgotPasswordForm";

const AuthPopup = ({ onClose }) => {
  const [currentView, setCurrentView] = useState("login"); // 'login', 'register', or 'forgot'

  const handleSuccess = (token) => {
    console.log("User authenticated successfully, token:", token);
    onClose(); // Close the popup on success
  };

  return (
    <div className="auth-popup">
      <div className="popup-content">
        {currentView === "login" && (
          <LoginForm onSuccess={handleSuccess} />
        )}
        {currentView === "register" && (
          <RegisterForm onSwitchView={(view) => setCurrentView(view)} />
        )}
        {currentView === "forgot" && (
          <ForgotPasswordForm />
        )}
        <div className="switch-links">
          {currentView !== "login" && (
            <button onClick={() => setCurrentView("login")}>Login</button>
          )}
          {currentView !== "register" && (
            <button onClick={() => setCurrentView("register")}>Register</button>
          )}
          {currentView !== "forgot" && (
            <button onClick={() => setCurrentView("forgot")}>
              Forgot Password
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPopup;
