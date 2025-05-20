
const express = require('express');
const router  = express.Router();
const User    = require('../models/user');
const jwt     = require('jsonwebtoken');
// const bcrypt  = require('bcrypt');        
require('dotenv').config();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        isAdmin: user.isAdmin
      },
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err });
  }
});


router.get('/profile', /* authenticateUser, */ async (req, res) => { /* ... */ });
router.put('/profile', /* authenticateUser, */ async (req, res) => { /* ... */ });

module.exports = router;
