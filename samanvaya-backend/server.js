const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const db = require('./db');
const verifyToken = require('./middleware/auth');
const isAdmin = require('./middleware/admin');

const app = express();
app.use(cors());
app.use(express.json());

// Set trust proxy if behind a load balancer (useful for grabbing IPs)
app.set('trust proxy', true);

// Utility to get IP address safely
const getClientIp = (req) => {
    return req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.ip;
};

// 1. POST /register
app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, error: 'Name, email, and password are required' });
        }

        // Check if user exists
        const [existingUsers] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(409).json({ success: false, error: 'User with this email already exists' });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert user
        const [result] = await db.execute(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        res.status(201).json({ success: true, message: 'User registered successfully', userId: result.insertId });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// 2. POST /login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email and password are required' });
        }

        // Find user
        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const user = users[0];

        // Verify password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        // Generate JWT containing user id and role (1 hour expiry)
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Log login activity
        const ipAddress = getClientIp(req);
        const userAgent = req.headers['user-agent'] || 'Unknown';

        await db.execute(
            'INSERT INTO login_logs (user_id, ip_address, user_agent) VALUES (?, ?, ?)',
            [user.id, ipAddress, userAgent]
        );

        res.status(200).json({ 
            success: true, 
            message: 'Login successful', 
            token, 
            role: user.role,
            user: { id: user.id, name: user.name, email: user.email } 
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// 3. GET /admin/users
app.get('/admin/users', verifyToken, isAdmin, async (req, res) => {
    try {
        const [users] = await db.execute('SELECT id, name, email, role, created_at FROM users');
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// 4. GET /admin/logins
app.get('/admin/logins', verifyToken, isAdmin, async (req, res) => {
    try {
        const query = `
            SELECT l.id, l.user_id, u.email, l.ip_address, l.user_agent, l.login_time 
            FROM login_logs l
            JOIN users u ON l.user_id = u.id
            ORDER BY l.login_time DESC
        `;
        const [logs] = await db.execute(query);
        res.status(200).json({ success: true, data: logs });
    } catch (error) {
        console.error('Get logins error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// 5. GET /profile
app.get('/profile', verifyToken, async (req, res) => {
    try {
        const [users] = await db.execute('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [req.user.id]);
        if (users.length === 0) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        res.status(200).json({ success: true, data: users[0] });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`SAMANVAYA Server is running on port ${PORT}`);
});
