const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Neon DB क्लाउड के लिए यह ज़रूरी है
  },
});

pool.on('connect', () => {
  console.log('✨ Neon PostgreSQL Connected Successfully!');
});

module.exports = pool;