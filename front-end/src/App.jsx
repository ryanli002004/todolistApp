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
          <div>
            <header className="header-container">
              <h1 className="header-title">Hi {userName}, Welcome to your To-Do List!</h1>
              <LogoutButton onLogout={handleLogout} />
            </header>
            
          </div>
        ) 
        : 
        (
          <div>
            <header className="header-container">
              <h1 className="header-title">Welcome to the To-Do List App</h1>
            </header>
            <AuthPopup
              onSuccess={(token, name) => {
                localStorage.setItem("authToken", token); // Save token
                setIsAuthenticated(true);
                setUserName(name);
              }}
            />
          </div>
        )}
    </div>
  );
};

export default App;
