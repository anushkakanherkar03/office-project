const fs = require('fs');
const path = require('path');

async function initDb(pool) {
  try {
    console.log('🔄 Initializing database tables...');
    const usersSqlPath = path.join(__dirname, 'sql', 'users.sql');
    const farmersSqlPath = path.join(__dirname, 'sql', 'farmers.sql');

    const usersSql = fs.readFileSync(usersSqlPath, 'utf8');
    const farmersSql = fs.readFileSync(farmersSqlPath, 'utf8');

    console.log('⏳ Creating users table if not exists...');
    await pool.query(usersSql);

    console.log('⏳ Creating farmers table if not exists...');
    await pool.query(farmersSql);

    console.log('✅ Database initialization complete.');
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
  }
}

module.exports = initDb;
