const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const razorpayRoutes = require('./routes/razorpayRoutes');

require('dotenv').config();

const User = require('./models/User');

const nykaProductRoute = require('./routes/nykaProductRoute');
const maybellineProductRoute = require('./routes/maybellineProductRoute');
const macProductRoute = require('./routes/macProductRoute');
const lorealProductRoute = require('./routes/lorealProductRoute');
const lakmeProductRoute = require('./routes/lakmeProductRoute');
const kayProductRoute = require('./routes/kayProductRoute');
const hudaProductRoute = require('./routes/hudaProductRoute');
const colorProductRoute = require('./routes/colorProductRoute');
const cartRoute = require('./routes/cartRoute');
const profileRoute = require('./routes/profileRoute');
const wishlistRoutes = require('./routes/wishlistRoute');
const orderRoutes = require('./routes/orderRoutes');
const usersRoutes = require ('./routes/usersRoute');
const allCart = require('./routes/allCart');
const catcartRoute = require('./routes/catcartRoute');










const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 


//routes
app.use('/api/nyka', nykaProductRoute);
app.use('/api/maybelline', maybellineProductRoute);
app.use('/api/mac', macProductRoute);
app.use('/api/loreal', lorealProductRoute);
app.use('/api/lakme', lakmeProductRoute);
app.use('/api/kay', kayProductRoute);
app.use('/api/huda', hudaProductRoute);
app.use('/api/color', colorProductRoute);
app.use('/api/cart', cartRoute);
app.use('/api/address', profileRoute);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/payment', razorpayRoutes);
app.use('/api/order',orderRoutes);
app.use('/api/user',usersRoutes);
app.use('/api/allcart',allCart);
app.use('/api/catcart',catcartRoute);




app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});


// Admin credentials
const ADMIN_CREDENTIALS = { username: 'sree', password: 'sree@2003' };

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/MainProject', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));



// Middleware for authentication
const authenticate = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const verified = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// Register Route
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ error: 'Username already exists' });

    const existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(400).json({ error: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error registering user' });
  }
});

// Login Route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt:', { username, password });

  try {
    // Admin login
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      console.log('Admin login successful');
      const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
      return res.json({ token, role: 'admin' });
    }

    // User login
    const user = await User.findOne({ username });
    if (!user) {
      console.log('User not found');
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch');
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ role: 'user', userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    console.log('User login successful');
    res.json({ token, role: 'user' });

  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Error logging in' });
  }
});

// Admin Login Route
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Admin login attempt:', { username, password });

  try {
    // Verify admin credentials
    if (username === 'sree' && password === 'sree@2003') {
      console.log('Admin login successful');
      const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
      return res.json({ token, role: 'admin' });
    }

    console.log('Invalid admin credentials');
    return res.status(401).json({ error: 'Invalid username or password' });

  } catch (err) {
    console.error('Error during admin login:', err);
    res.status(500).json({ error: 'Error logging in' });
  }
});



//profile Route
app.get('/api/profile', authenticate, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      return res.json({ username: ADMIN_CREDENTIALS.username, role: 'admin' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ username: user.username, email: user.email });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching user profile' });
  }
});







const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
