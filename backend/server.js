// server.js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';

app.use(express.json());
app.use(cookieParser());

// CORS: allow credentials
app.use(cors({
  origin: CLIENT_ORIGIN,
  credentials: true
}));

app.use(session({
  store: new SQLiteStore({ db: 'sessions.sqlite', dir: './', concurrentDB: true }),
  secret: process.env.SESSION_SECRET || 'dev_secret_replace_in_prod',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    // secure: true, // enable when using HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

app.use('/api/auth', authRoutes);

// Protected example dashboard route
app.get('/api/dashboard', (req, res) => {
  if (req.session && req.session.user) {
    // Dummy data
    return res.json({ message: `Welcome ${req.session.user.email}`, secretData: '42' });
  }
  return res.status(401).json({ error: 'Unauthorized' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
