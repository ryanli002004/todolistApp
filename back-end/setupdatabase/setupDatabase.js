const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a connection
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function setupDatabase() {
  try {
    //Create the database if it doesn't exist
    await db.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);

    //Use the database
    await db.query(`USE ${process.env.DB_NAME}`);

    //Create the `users` table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
      )
    `);
    
    //Create the `passwordresettoken` table
    await db.query(`
      CREATE TABLE IF NOT EXISTS password_resets (
        email VARCHAR(255) NOT NULL PRIMARY KEY,
        token VARCHAR(255) NOT NULL,
        expires_at DATETIME NOT NULL,
        FOREIGN KEY (email) REFERENCES users(email)
      )
    `);

    //Create the `tasks` table
    await db.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        task VARCHAR(255) NOT NULL,
        completed BOOLEAN NOT NULL DEFAULT false,
        starred BOOLEAN NOT NULL DEFAULT false,
        position INT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
    
  } catch (err) {
    console.error('Error setting up database:', err);
    process.exit(1); // Exit the process on failure
  }
}

module.exports = { db, setupDatabase };