const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// API Endpoint: Register a new student
app.post('/api/register', (req, res) => {
    const { name, email, phone, dob, address } = req.body;

    // Basic validation
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and Email are required.' });
    }

    const query = 'INSERT INTO students (name, email, phone, dob, address) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [name, email, phone, dob, address], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            // Handle duplicate email error
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: 'Email already exists.' });
            }
            return res.status(500).json({ error: 'Database error.' });
        }
        res.status(201).json({ message: 'Student registered successfully!', studentId: result.insertId });
    });
});

// Admin Login Endpoint
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    // Simple hardcoded admin credentials for demonstration
    if (username === 'admin' && password === 'admin123') {
        res.json({ token: 'admin-secret-token' });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Middleware for Admin Route Protection
const authenticateAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.split(' ')[1] === 'admin-secret-token') {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

// Admin Endpoint: Get all students
app.get('/api/admin/students', authenticateAdmin, (req, res) => {
    const query = 'SELECT * FROM students ORDER BY created_at DESC';
    db.query(query, [], (err, results) => {
        if (err) {
            console.error('Error fetching students:', err);
            return res.status(500).json({ error: 'Database error.' });
        }
        res.json(results);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
