import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  goalName: {
    type: String,
    required: true,
    description: 'What the user wants to save for (e.g., "Watch", "Bike", "Laptop")'
  },
  category: {
    type: String,
    enum: ['gadget', 'vehicle', 'travel', 'education', 'luxury', 'other'],
    required: true,
  },
  targetAmount: {
    type: Number,
    required: true,
    description: 'How much to save (e.g., 6000)'
  },
  currentSavings: {
    type: Number,
    default: 0,
    description: 'Amount saved so far'
  },
  deadline: {
    type: Date,
    required: true,
    description: 'When the user wants to buy this item'
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium',
    description: 'Priority level for recommendations'
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused', 'abandoned'],
    default: 'active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Budget', budgetSchema);
