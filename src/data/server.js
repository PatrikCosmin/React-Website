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
  // Create users table with isAdmin column as an integer
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT,
    isAdmin INTEGER DEFAULT 0
  )`, (err) => {
    if (err) {
      console.error('Error creating users table:', err.message);
    } else {
      const adminUsername = 'patrik';
      const adminEmail = 'patrik@example.com';
      const adminPassword = 'admin123';

      bcrypt.hash(adminPassword, 10, (err, hashedPassword) => {
        if (err) {
          console.error('Error hashing admin password:', err);
          return;
        }
        // Inserting admin user with isAdmin set to 1
        db.run('INSERT OR IGNORE INTO users (username, email, password, isAdmin) VALUES (?, ?, ?, 1)', 
               [adminUsername, adminEmail, hashedPassword], 
               (err) => {
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

  // Registration endpoint
  app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run('INSERT INTO users (username, email, password, isAdmin) VALUES (?, ?, ?, 0)', 
           [username, email, hashedPassword], 
           (err) => {
      if (err) {
        return res.status(500).json({ message: 'Internal server error' });
      }
      res.status(201).json({ message: 'User registered successfully' });
    });
  });

  // Login endpoint
  app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, row) => {
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
    db.run('INSERT INTO feedback_submissions (name, email, feedback) VALUES (?, ?, ?)', 
           [name, email, feedback], 
           (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error submitting feedback' });
      }
      res.status(200).json({ message: 'Feedback submitted successfully' });
    });
  });
});

// Add a menu item
app.post('/api/menu/add', async (req, res) => {
  try {
    const { name, description, price, image } = req.body;
    db.run('INSERT INTO menu_items (name, description, price, image) VALUES (?, ?, ?, ?)', [name, description, price, image], function(err) {
      if (err) {
        return res.status(500).json({ message: 'Error adding menu item', error: err });
      }
      res.status(201).json({ message: 'Menu item added successfully', id: this.lastID });
    });
  } catch (error) {
    console.error('Error during menu item addition:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Edit a menu item
app.put('/api/menu/edit/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image } = req.body;
    db.run('UPDATE menu_items SET name = ?, description = ?, price = ?, image = ? WHERE id = ?', [name, description, price, image, id], function(err) {
      if (err) {
        return res.status(500).json({ message: 'Error updating menu item', error: err });
      }
      res.status(200).json({ message: 'Menu item updated successfully' });
    });
  } catch (error) {
    console.error('Error during menu item update:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a menu item
app.delete('/api/menu/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    db.run('DELETE FROM menu_items WHERE id = ?', [id], function(err) {
      if (err) {
        return res.status(500).json({ message: 'Error deleting menu item', error: err });
      }
      res.status(200).json({ message: 'Menu item deleted successfully' });
    });
  } catch (error) {
    console.error('Error during menu item deletion:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
