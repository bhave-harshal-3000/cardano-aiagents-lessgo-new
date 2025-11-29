import express from 'express';
import Savings from '../models/Savings.js';
import mongoose from 'mongoose';

const router = express.Router();

// Get aggregated savings stats for a user (must come before /:userId route)
router.get('/stats/:userId', async (req, res) => {
  try {
    const result = await Savings.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.params.userId) } },
      {
        $group: {
          _id: null,
          totalSaved: { $sum: '$currentAmount' },
          totalTarget: { $sum: '$targetAmount' },
          goalCount: { $sum: 1 }
        }
      }
    ]);

    if (result.length > 0) {
      const stats = result[0];
      res.json({
        totalSaved: stats.totalSaved,
        totalTarget: stats.totalTarget,
        overallProgress: stats.totalTarget > 0 ? (stats.totalSaved / stats.totalTarget) * 100 : 0,
        goalCount: stats.goalCount
      });
    } else {
      res.json({
        totalSaved: 0,
        totalTarget: 0,
        overallProgress: 0,
        goalCount: 0
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all savings goals for a user
router.get('/:userId', async (req, res) => {
  try {
    const savings = await Savings.find({ userId: req.params.userId });
    res.json(savings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new savings goal
router.post('/', async (req, res) => {
  try {
    const savings = new Savings(req.body);
    await savings.save();
    res.status(201).json(savings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update savings goal
router.put('/:id', async (req, res) => {
  try {
    const savings = await Savings.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(savings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete savings goal
router.delete('/:id', async (req, res) => {
  try {
    await Savings.findByIdAndDelete(req.params.id);
    res.json({ message: 'Savings goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
