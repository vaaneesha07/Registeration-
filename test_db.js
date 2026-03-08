const db = require('./db');
setTimeout(() => {
    const query = 'INSERT INTO students (name, email, phone, dob, address) VALUES (?, ?, ?, ?, ?)';
    db.query(query, ['Test', 'test2@test.com', '123', '2000-01-01', 'addr'], (err, result) => {
        if (err) {
            console.error('FAILED:', err);
        } else {
            console.log('SUCCESS:', result);
        }
    });
}, 1000); // Wait for table creation
