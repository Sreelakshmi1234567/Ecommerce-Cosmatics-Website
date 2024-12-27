const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    
  },
  password: {
    type: String,
    required: true,
  },
  addresses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProfileAddress', 
    },
  ],
});


const User = mongoose.model('User', userSchema);
module.exports = User;

