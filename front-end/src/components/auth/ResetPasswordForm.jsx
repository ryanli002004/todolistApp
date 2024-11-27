import React, { useState } from "react";

const ResetPasswordForm = ({ email }) => {
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
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Reset Password</h2>
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <label>
        Email:
        <input type="email" value={email} readOnly />
      </label>
      <label>
        Token:
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
        />
      </label>
      <label>
        New Password:
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </label>

      <button type="submit">Reset Password</button>
    </form>
  );
};

export default ResetPasswordForm;
