import React, { useState } from "react";
import "./ResetPasswordForm.css";

const ResetPasswordForm = ({ email, onSuccess }) => {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(
    "Password reset token sent successfully to your email!"
  );
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, token, newPassword }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to reset password.");
      }

      alert("Password reset successfully!");
      onSuccess()
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="reset-password-form">
      <h2 className="form-heading">Reset Password</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {error && <p className="error-message">{error}</p>}

      <label className="form-label">
        Email:
        <input type="email" value={email} readOnly className="form-input" />
      </label>
      <label className="form-label">
        Token:
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
          className="form-input"
        />
      </label>
      <label className="form-label">
        New Password:
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="form-input"
        />
      </label>

      <button type="submit" className="submit-button">Reset Password</button>
    </form>
  );
};

export default ResetPasswordForm;
