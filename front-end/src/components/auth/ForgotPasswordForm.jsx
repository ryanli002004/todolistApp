import React, { useState } from "react";

const ForgotPasswordForm = ({ switchPage }) => {
  const [email, setEmail] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Password reset link sent!");
        switchPage("login");
      } else {
        alert(data.message || "Request failed");
      }
    } catch (error) {
      console.error("Error during forgot password:", error);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleForgotPassword}>
      <h2>Forgot Password</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">Reset Password</button>
      <p>
        Back to <span onClick={() => switchPage("login")}>Login</span>
      </p>
    </form>
  );
};

export default ForgotPasswordForm;
