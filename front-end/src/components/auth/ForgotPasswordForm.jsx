import React, { useState } from "react";

const ForgotPasswordForm = ({ onReset }) => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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
      setSuccessMessage("Reset email sent successfully. Please check your inbox.");
      setErrorMessage("");

      // Notify parent and redirect to ResetPasswordForm
      setTimeout(() => {
        onReset(email); // Pass email to `AuthPopup` to switch views
      }, 2000); // Slight delay for UX
    } catch (error) {
      setErrorMessage(error.message);
      setSuccessMessage("");
    }
  };

  return (
    <form onSubmit={handleForgotPassword}>
      <h2>Forgot Password</h2>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      <button type="submit">Send Reset Email</button>
    </form>
  );
};

export default ForgotPasswordForm;
