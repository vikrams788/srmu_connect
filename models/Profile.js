const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  fullName: {
    type: String,
    required: true
  },
  bio: {
    type: String
  },
  email: {
    type: String
  },
  course: {
    type: String,
    required: true
  },
  rollNo: {
    type: String,
    required: true
  },
  semester: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String
  }
  // Add other profile fields as needed
});

module.exports = mongoose.model('Profile', profileSchema);
