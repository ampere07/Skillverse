const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  joinCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    length: 6,
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Generate random join code
classSchema.methods.generateJoinCode = function() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Pre-save middleware to generate join code
classSchema.pre('save', async function(next) {
  if (!this.joinCode) {
    let code;
    let exists = true;
    
    while (exists) {
      code = this.generateJoinCode();
      const existingClass = await this.constructor.findOne({ joinCode: code });
      if (!existingClass) {
        exists = false;
      }
    }
    
    this.joinCode = code;
  }
  next();
});

module.exports = mongoose.model('Class', classSchema);