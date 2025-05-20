const mongoose = require('mongoose');
const User = require('./models/user'); // Adjust path as needed
const bcrypt = require('bcryptjs');

const DB_URL = 'mongodb+srv://nikesm98:nike98188@swasthayogi.ffq8try.mongodb.net/';

mongoose.connect(DB_URL)
  .then(async () => {
    const username = 'admin';
    const password = 'admin123';

    const existing = await User.findOne({ username });
    if (existing) {
      console.log('Admin user already exists');
      return process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const adminUser = new User({
      username,
      password: hashedPassword,
      isAdmin: true
    });

    await adminUser.save();
    console.log('✅ Admin user created:\nUsername: admin\nPassword: admin123');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error connecting to DB', err);
    process.exit(1);
  });
