const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const { db } = require('../setupdatabase/setupDatabase');
const nodemailer = require('nodemailer');
const validator = require('validator');
const crypto = require('crypto');


require('dotenv').config();

const SECRET = process.env.JWT_SECRET;

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Invalid email address.' });
  }

  if (password.length < 5) {
    return res.status(400).json({ message: "Password must be at least 5 characters long." });
  }

  try {
    // Check if the user already exists
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
      return res.status(400).send({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [
      name,
      email,
      hashedPassword,
    ]);

    res.send({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user in the database
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(404).send({ message: 'User not found' });
    }

    const user = rows[0];

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({ message: 'Invalid credentials' });
    }

    // Generate a token
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, SECRET, {
      expiresIn: '1h',
    });

    res.send({ token, name: user.name });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Server error' });
  }
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the email is registered
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(404).send({ message: 'Email not registered' });
    }

    const [existingTokens] = await db.query('SELECT expires_at FROM password_resets WHERE email = ?', [email]);
    if (existingTokens.length > 0) {
      const { expires_at } = existingTokens[0];
      const now = new Date();

      // Check if the token was created within the last 30 minutes
      if (new Date(expires_at) > now) {
        const remainingMinutes = Math.ceil((new Date(expires_at) - now) / (60 * 1000));
        return res.status(429).send({
          message: `You must wait ${remainingMinutes} minutes before requesting another token.`,
        });
      }
    }

    // Generate a secure random token
    const token = crypto.randomBytes(20).toString('hex');
    const expires_at = new Date(Date.now() + 30 * 60 * 1000); // Token expires in 30min

    // Insert or update the token in the `password_resets` table
    await db.query(
      'INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE token = ?, expires_at = ?',
      [email, token, expires_at, token, expires_at]
    );

    // Send the token to the user's email (via nodemailer)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 465,
      secure: true, 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Password Reset',
      text: `Here is your password reset code: ${token}\nThis code will expire in 30min.`,
    };
 
    try {
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully!");
      return res.status(204).end();
    } catch (emailErr) {
      console.error("Error sending email:", emailErr);
      return res.status(500).send({ message: "Failed to send reset email" });
    }
  } catch (err) {
    console.error("Error in forgot-password route:", err);
    return res.status(500).send({ message: "Server error" });
  }
});


// Reset Password Route
router.post('/reset-password', async (req, res) => {
  const { email, token, newPassword } = req.body;

  try {
    // Check if the token exists and hasn't expired
    const [resetRows] = await db.query(
      'SELECT * FROM password_resets WHERE email = ? AND token = ? AND expires_at > NOW()',
      [email, token]
    );
    if (resetRows.length === 0) {
      return res.status(400).send({ message: 'Invalid or expired token' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    await db.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);

    // Delete the token from the `password_resets` table
    await db.query('DELETE FROM password_resets WHERE email = ?', [email]);

    res.send({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Server error' });
  }
});

router.post("/verify-token", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; 
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    res.json({ id: decoded.id, email: decoded.email, name: decoded.name }); 
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
});

module.exports = router;