const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to SQLite database
const dbPath = path.resolve(__dirname, 'student_db.sqlite');
const connection = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to SQLite database:', err.message);
        return;
    }
    console.log('Connected to SQLite database.');

    // Create students table
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            phone TEXT,
            dob TEXT,
            address TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;
    connection.run(createTableQuery, (err) => {
        if (err) {
            console.error('Error creating students table:', err.message);
            return;
        }
        console.log('Table "students" checked/created.');
    });
});

// Polyfill query method for mysql2 compatibility in server.js
connection.query = function (sql, params, callback) {
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
        this.all(sql, params, callback);
    } else {
        this.run(sql, params, function (err) {
            if (err) {
                // map unique constraint error
                if (err.message && err.message.includes('UNIQUE constraint failed')) {
                    err.code = 'ER_DUP_ENTRY';
                }
                return callback(err);
            }
            callback(null, { insertId: this.lastID });
        });
    }
};

module.exports = connection;
