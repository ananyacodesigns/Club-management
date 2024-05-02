const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');  // Ensure bcryptjs is installed using npm install bcryptjs

// Define the schema for the User model
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true  // Removes any leading or trailing whitespace
  },
  strength: {
    type: Number,
    required: [true, 'Strength is required'],
    min: [1, 'Strength must be at least 1'],
    max: [100, 'Strength must not exceed 100']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    unique: true,
    index: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  }
}, {
  timestamps: true  // Automatically add createdAt and updatedAt timestamps
});

// Pre-save middleware for hashing passwords
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Error handling middleware to handle MongoDB errors, particularly unique violations
userSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('Email must be unique. Please use another email.'));
  } else {
    next(error);
  }
});

// Create the model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
