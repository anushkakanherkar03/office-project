// server.js
const cors = require("cors");
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();


app.use(cors({
    origin: 'http://localhost:5173', // React app
    credentials: true
}));

app.use(express.json());

// Mock user database
const users = []; 

// Sign Up Endpoint
app.post('/api/signup', async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ email, password: hashedPassword });
    res.status(201).json({ message: "User created" });
});

// Login Endpoint
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ email }, 'SECRET_KEY', { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));