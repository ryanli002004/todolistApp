import React, { useState } from "react";
import "./ForgotPasswordForm.css";

const ForgotPasswordForm = ({ onReset }) => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Something went wrong.");
      }

      // Show success message
      setErrorMessage("");
 
      // Notify parent and redirect to ResetPasswordForm
      onReset(email); // Pass email to `AuthPopup` to switch views
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <form onSubmit={handleForgotPassword} className="forgot-password-form">
      <h2 className="form-heading">Forgot Password</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <label className="form-label">
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="form-input"
        />
      </label>

      <button type="submit" className="submit-button">Send Reset Email</button>
    </form>
  );
};

export default ForgotPasswordForm;
