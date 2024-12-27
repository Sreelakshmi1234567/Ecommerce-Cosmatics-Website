const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 
const bcrypt = require('bcryptjs');

router.post('/adminlogin', async (req, res) => {
  const { username, password } = req.body;

  try {
    const adminUser = await User.findOne({ username, role: 'admin' }); 
    if (!adminUser) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, adminUser.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: adminUser._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error('Error logging in admin:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
