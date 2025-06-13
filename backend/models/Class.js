const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    length: 6
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
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
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

// Generate unique class code
classSchema.statics.generateClassCode = async function() {
  let code;
  let codeExists = true;
  
  while (codeExists) {
    code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const existingClass = await this.findOne({ code });
    codeExists = !!existingClass;
  }
  
  return code;
};

module.exports = mongoose.model('Class', classSchema);