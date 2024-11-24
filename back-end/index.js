const express = require('express');
const { setupDatabase } = require('./setupDatabase'); 
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(express.json());

const startServer = async () => {
  try {
    // Run database setup
    await setupDatabase();
    console.log('Database setup complete.');

    // Add routes
    app.use('/auth', authRoutes);

    app.get('/', (req, res) => {
      res.send('Hello, World!');
    });

    // Start the server
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  } catch (err) {
    console.error('Failed to set up the database:', err);
    process.exit(1); // Exit the process if database setup fails
  }
};

// Start the server
startServer();