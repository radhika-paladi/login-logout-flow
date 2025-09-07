// routes/auth.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

// Register
router.post('/register', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password required.' });

  try {
    // Check duplicate
    db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
      if (err) return res.status(500).json({ error: 'DB error' });
      if (row) return res.status(409).json({ error: 'Email already registered.' });

      const hash = await bcrypt.hash(password, SALT_ROUNDS);
      db.run('INSERT INTO users (email, password_hash) VALUES (?, ?)', [email, hash], function (err) {
        if (err) return res.status(500).json({ error: 'DB insert error' });
        // create session
        req.session.user = { id: this.lastID, email };
        return res.json({ message: 'Registered', user: { id: this.lastID, email } });
      });
    });
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password required.' });

  db.get('SELECT id, email, password_hash FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (!user) return res.status(401).json({ error: 'Invalid credentials.' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials.' });

    // Save minimal info in session
    req.session.user = { id: user.id, email: user.email };
    return res.json({ message: 'Logged in', user: { id: user.id, email: user.email } });
  });
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    // clear cookie on client by setting expired cookie (express-session will handle it)
    res.clearCookie('connect.sid');
    return res.json({ message: 'Logged out' });
  });
});

// Check session
router.get('/me', (req, res) => {
  if (req.session && req.session.user) {
    return res.json({ authenticated: true, user: req.session.user });
  } else {
    return res.json({ authenticated: false });
  }
});

module.exports = router;
