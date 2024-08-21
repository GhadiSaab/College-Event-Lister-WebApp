const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sequelize, User, Event } = require('./models');
const events = require('./routes/events');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Sync models with database
sequelize.sync({ force: false }).then(() => {
  console.log('Database synced');
});

// Authentication middleware
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Add this route to verify the token and return user info
app.get('/api/auth', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Register user
app.post('/api/users/signup', async (req, res) => {
  const { username, password, role } = req.body;

  try {
    console.log('Signup request received', req.body); // Add this line

    let user = await User.findOne({ where: { username } });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await User.create({
      username,
      password: hashedPassword,
      role // Ensure role is handled properly
    });

    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(payload, 'your_jwt_secret', { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.status(201).json({ token, user: payload.user });
    });
  } catch (err) {
    console.error('Error in /api/users/signup route:', err); // Add this line
    res.status(500).send('Server error');
  }
});

// Login user
app.post('/api/users/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    let user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(payload, 'your_jwt_secret', { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: payload.user });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Use the events router
app.use('/api/events', events);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
