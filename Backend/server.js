// server.js
const cors = require("cors");
const express = require('express');
const pool = require('./db');
const initDb = require('./initDb');
const authRoutes = require('./routes/authRoutes');
const farmerRoutes = require('./routes/farmerRoutes');
const { signup, login } = require('./controllers/authController');

const app = express();

// Initialize the database tables on startup
initDb(pool);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || origin.startsWith("http://localhost:")) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/farmer', farmerRoutes);

// Direct/legacy routes (used by index.html tests)
app.post('/api/signup', signup);
app.post('/api/login', login);

app.listen(5000, () => console.log('Server running on http://localhost:5000'));