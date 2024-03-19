const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

const db = new sqlite3.Database('database.db');

db.serialize(() => {
  // Create users table with isAdmin column
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT,
    isAdmin BOOLEAN DEFAULT false
  )`, (err) => {
    if (err) {
      console.error('Error creating users table:', err.message);
    } else {
      // Add an admin user
      const adminUsername = 'patrik';
      const adminEmail = 'patrik@example.com';
      const adminPassword = 'admin123'; // Choose a secure password

      bcrypt.hash(adminPassword, 10, (err, hashedPassword) => {
        if (err) {
          console.error('Error hashing admin password:', err);
          return;
        }
        db.run('INSERT OR IGNORE INTO users (username, email, password, isAdmin) VALUES (?, ?, ?, ?)', [adminUsername, adminEmail, hashedPassword, true], (err) => {
          if (err) {
            console.error('Error adding admin user:', err);
          } else {
            console.log('Admin user added successfully');
          }
        });
      });
    }
  });

  // Create other tables
  db.run(`CREATE TABLE IF NOT EXISTS menu_items (
    id INTEGER PRIMARY KEY,
    name TEXT,
    description TEXT,
    price REAL,
    image TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS contact_submissions (
    id INTEGER PRIMARY KEY,
    name TEXT,
    email TEXT,
    message TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS feedback_submissions (
    id INTEGER PRIMARY KEY,
    name TEXT,
    email TEXT,
    feedback TEXT
  )`);
});

// Registration endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run('INSERT INTO users (username, email, password, isAdmin) VALUES (?, ?, ?, false)', [username, email, hashedPassword], function(err) {
      if (err) {
        return res.status(500).json({ message: 'Internal server error' });
      }
      res.status(201).json({ message: 'User registered successfully' });
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username = ?', [username], async function(err, row) {
      if (err) {
        return res.status(500).json({ message: 'Internal server error' });
      }
      if (!row) {
        return res.status(401).json({ message: 'User not found' });
      }
      const isPasswordValid = await bcrypt.compare(password, row.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
      }
      res.status(200).json({ message: 'Login successful', username, isAdmin: row.isAdmin });
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get menu items endpoint
app.get('/api/menu', (req, res) => {
  db.all('SELECT * FROM menu_items', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.status(200).json(rows);
  });
});

// Feedback form submission endpoint
app.post('/api/feedback', (req, res) => {
  const { name, email, feedback } = req.body;
  db.run('INSERT INTO feedback_submissions (name, email, feedback) VALUES (?, ?, ?)', [name, email, feedback], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Error submitting feedback' });
    }
    res.status(200).json({ message: 'Feedback submitted successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
