import React, { useState } from "react";

const ResetPassword = ({ email }) => {
  const [token, setToken] = useState(""); // One-time token
  const [newPassword, setNewPassword] = useState(""); // New password
  const [successMessage, setSuccessMessage] = useState(""); // Message for success
  const [errorMessage, setErrorMessage] = useState(""); // Message for errors

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, token, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      setSuccessMessage("Your password has been reset successfully!");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message);
      setSuccessMessage("");
    }
  };

  return (
    <form onSubmit={handleResetPassword}>
      <h2>Reset Password</h2>
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

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

export default ResetPassword;
