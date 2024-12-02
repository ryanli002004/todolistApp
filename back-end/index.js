const express = require('express');
const path = require('path'); // For serving static files
const { setupDatabase } = require('./setupdatabase/setupDatabase');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
app.use(express.json()); // Parse incoming JSON requests

const startServer = async () => {
  try {
    // Run database setup
    await setupDatabase();
    console.log('Database setup complete.');

    // Add routes for APIs
    app.use('/auth', authRoutes);
    app.use('/tasks', taskRoutes);

    // Serve the React front-end from the "dist" folder
    app.use(express.static(path.join(__dirname, 'dist')));

    // Fallback for React routing (handles SPA routing)
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });

    // Start the server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to set up the database:', err);
    process.exit(1); // Exit the process if database setup fails
  }
};

// Start the server
startServer();
