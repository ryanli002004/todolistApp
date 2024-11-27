import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import ResetPasswordForm from "./ResetPasswordForm";

const AuthPopup = ({ onClose }) => {
  const [currentView, setCurrentView] = useState("login"); // 'login', 'register', 'forgot', or 'reset'
  const [emailForReset, setEmailForReset] = useState(""); // Store email for reset password view

  const handleSuccess = (token) => {
    console.log("User authenticated successfully, token:", token);
    onClose(); // Close the popup on success
  };

  const handleForgotPassword = (email) => {
    setEmailForReset(email); // Save the email for the reset password view
    setCurrentView("reset"); // Switch to the reset password form
  };

  return (
    <div className="auth-popup">
      <div className="popup-content">
        {currentView === "login" && (
          <LoginForm onSuccess={handleSuccess} />
        )}
        {currentView === "register" && (
          <RegisterForm onSuccess={handleSuccess} />
        )}
        {currentView === "forgot" && (
          <ForgotPasswordForm onReset={handleForgotPassword} />
        )}
        {currentView === "reset" && (
          <ResetPasswordForm email={emailForReset}/>
        )}

        {/* Buttons for switching views */}
        <div className="switch-links">
          {currentView !== "reset" && currentView !== "login" && (
            <button onClick={() => setCurrentView("login")}>Login</button>
          )}
          {currentView !== "reset" && currentView !== "register" && (
            <button onClick={() => setCurrentView("register")}>Register</button>
          )}
          {currentView !== "reset" && currentView !== "register" && currentView !== "forgot" && (
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
