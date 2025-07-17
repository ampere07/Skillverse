const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  theme: {
    type: String,
    default: 'blue'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate unique class code
classSchema.pre('save', async function(next) {
  if (!this.isNew) return next();
  
  let code;
  let codeExists = true;
  
  while (codeExists) {
    code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const existingClass = await this.constructor.findOne({ code });
    codeExists = !!existingClass;
  }
  
  this.code = code;
  next();
});

module.exports = mongoose.model('Class', classSchema);