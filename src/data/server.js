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
    image TEXT,
    category TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS feedback_submissions (
    id INTEGER PRIMARY KEY,
    name TEXT,
    email TEXT,
    feedback TEXT
  )`);

  // Create reservations table
db.run(`CREATE TABLE IF NOT EXISTS reservations (
  id INTEGER PRIMARY KEY,
  date TEXT,
  time TEXT,
  guests INTEGER
)`);

// Endpoint to fetch available times based on the date
app.get('/api/reservations/times', (req, res) => {
  const date = req.query.date;
  db.all('SELECT time FROM reservations WHERE date = ?', [date], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Internal server error' });
    }
    const bookedTimes = rows.map(row => row.time);
    const allTimes = ['12:00', '14:00', '16:00', '18:00', '20:00', '22:00']; // Example times
    const availableTimes = allTimes.filter(time => !bookedTimes.includes(time));
    res.status(200).json({ times: availableTimes });
  });
});

// Endpoint to create a reservation
app.post('/api/reservations', (req, res) => {
  const { date, time, guests } = req.body;
  db.run('INSERT INTO reservations (date, time, guests) VALUES (?, ?, ?)', [date, time, guests], (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error creating reservation', error: err });
    }
    res.status(200).json({ message: 'Reservation created successfully' });
  });
});

// Endpoint to fetch all reservations
app.get('/api/reservations', (req, res) => {
  db.all('SELECT * FROM reservations', (err, rows) => {
    if (err) {
      res.status(500).json({ message: 'Internal server error', error: err });
      return;
    }
    res.status(200).json(rows);
  });
});

// Edit a reservation
app.put('/api/reservations/:id', (req, res) => {
  const { id } = req.params;
  const { date, time, guests } = req.body;
  db.run('UPDATE reservations SET date = ?, time = ?, guests = ? WHERE id = ?', [date, time, guests, id], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Error updating reservation', error: err });
    }
    res.status(200).json({ message: 'Reservation updated successfully' });
  });
});

// Delete a reservation
app.delete('/api/reservations/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM reservations WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Error deleting reservation', error: err });
    }
    res.status(200).json({ message: 'Reservation deleted successfully' });
  });
});


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
    const { name, description, price, image, category } = req.body;
    db.run('INSERT INTO menu_items (name, description, price, image, category) VALUES (?, ?, ?, ?, ?)', [name, description, price, image, category], function(err) {
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
    const { name, description, price, image, category } = req.body;
    db.run('UPDATE menu_items SET name = ?, description = ?, price = ?, image = ?, category = ? WHERE id = ?', [name, description, price, image, category, id], function(err) {
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



// Endpoint to delete all menu items in a specific category
app.delete('/api/menu/category/:category', async (req, res) => {
  const { category } = req.params;
  db.run('DELETE FROM menu_items WHERE category = ?', [category], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Error deleting menu items in category', error: err });
    }
    res.status(200).json({ message: 'All menu items in the category deleted successfully' });
  });
});


// Fetch all feedbacks
app.get('/api/feedbacks', (req, res) => {
  db.all('SELECT * FROM feedback_submissions', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.status(200).json(rows);
  });
});

// Delete a feedback by ID
app.delete('/api/feedback/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    db.run('DELETE FROM feedback_submissions WHERE id = ?', [id], function(err) {
      if (err) {
        return res.status(500).json({ message: 'Error deleting feedback', error: err });
      }
      res.status(200).json({ message: 'Feedback deleted successfully' });
    });
  } catch (error) {
    console.error('Error during feedback deletion:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete all feedbacks
app.delete('/api/feedback/all', async (req, res) => {
  try {
    db.run('DELETE FROM feedback_submissions', function(err) {
      if (err) {
        return res.status(500).json({ message: 'Error deleting all feedbacks', error: err });
      }
      res.status(200).json({ message: 'All feedbacks deleted successfully' });
    });
  } catch (error) {
    console.error('Error deleting all feedbacks:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add a user
app.post('/api/user/add', async (req, res) => {
  try {
    const { username, email, password, isAdmin } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run('INSERT INTO users (username, email, password, isAdmin) VALUES (?, ?, ?, ?)', 
           [username, email, hashedPassword, isAdmin], 
           (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error adding user', error: err });
      }
      res.status(201).json({ message: 'User added successfully' });
    });
  } catch (error) {
    console.error('Error during user addition:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a user
app.delete('/api/user/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
      if (err) {
        return res.status(500).json({ message: 'Error deleting user', error: err });
      }
      res.status(200).json({ message: 'User deleted successfully' });
    });
  } catch (error) {
    console.error('Error during user deletion:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Fetch all users
app.get('/api/users', (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.status(200).json(rows);
  });
});



app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});


