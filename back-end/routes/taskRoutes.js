const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware'); // Authentication middleware
const { db } = require('../setupdatabase/setupDatabase'); // Adjust to your actual database connection

// Apply middleware to all routes in this file
router.use(authenticate);

// Add a new task
router.post('/', async (req, res) => {
  const { task, starred } = req.body;
  const userId = req.user.id; // Retrieved from middleware

  try {
    const [result] = await db.query(
      'INSERT INTO tasks (user_id, task, completed, starred, position) VALUES (?, ?, ?, ?, ?)',
      [userId, task, false, starred || false, 0]
    );

    res.status(201).json({
      id: result.insertId,
      task,
      completed: false,
      starred: starred || false,
      position: 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add task' });
  }
});

// Get all tasks
router.get('/', async (req, res) => {
  const userId = req.user.id;

  try {
    const [tasks] = await db.query(
      'SELECT * FROM tasks WHERE user_id = ? ORDER BY position ASC',
      [userId]
    );

    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
});

// Update a task
router.put('/:id', async (req, res) => {
  const { id } = req.params; // Task ID
  const { task, completed, starred } = req.body;
  const userId = req.user.id;

  try {
    const [result] = await db.query(
      'UPDATE tasks SET task = ?, completed = ?, starred = ? WHERE id = ? AND user_id = ?',
      [task, completed, starred, id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update task' });
  }
});

// Reorder tasks
router.put('/reorder', async (req, res) => {
  const { order } = req.body; // Expected: [{ id: taskId, position: newPosition }, ...]
  const userId = req.user.id;

  try {
    for (const item of order) {
      await db.query(
        'UPDATE tasks SET position = ? WHERE id = ? AND user_id = ?',
        [item.position, item.id, userId]
      );
    }

    res.json({ message: 'Tasks reordered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to reorder tasks' });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  const { id } = req.params; // Task ID
  const userId = req.user.id;

  try {
    const [result] = await db.query(
      'DELETE FROM tasks WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete task' });
  }
});

module.exports = router;
