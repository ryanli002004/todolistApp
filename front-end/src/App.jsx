import React, { useState, useEffect } from "react";
import AuthPopup from "./components/auth/AuthPopup";
import LogoutButton from "./components/logout-button/LogoutButton";
import "./App.css";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      const verifyToken = async () => {
        try {
          const response = await fetch("http://localhost:3000/auth/verify-token", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setIsAuthenticated(true);
            setUserName(userData.name);
          } else {
            console.error("Token verification failed");
            localStorage.removeItem("authToken");
            setIsAuthenticated(false);
          }
        } catch (err) {
          console.error("Error verifying token:", err);
          localStorage.removeItem("authToken");
          setIsAuthenticated(false);
        }
      };

      verifyToken();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove the token
    setIsAuthenticated(false); // Update authentication state
    setUserName(""); // Clear username
  };

  return (
    <div className="app-container" >
        {isAuthenticated ? (
          <div className="is-auth">
            <header className="navbar-is-auth">
              <h1 className="header-title">Hi {userName}, Welcome to your To-Do List!</h1>
              <LogoutButton onLogout={handleLogout} />
            </header>
            <div className="is-auth-content">

            </div>
          </div>
        ) 
        : 
        (
          <div className="not-auth">
            <header className="navbar-not-auth">
              <h1 className="header-title">Welcome to the To-Do List App</h1>
            </header>
            <div className="not-auth-content">
              <h1 className="please-auth-heading">Please log in or create an account to access your personalized to-do list!</h1>
              <AuthPopup
                onSuccess={(token, name) => {
                  localStorage.setItem("authToken", token); // Save token
                  setIsAuthenticated(true);
                  setUserName(name);}}/>
            </div>
          </div>
        )}
    </div>
  );
};

export default App;
