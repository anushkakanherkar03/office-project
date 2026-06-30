const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_change_me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

function normalizeText(value) {
  if (value === undefined || value === null) return null;
  const text = String(value).trim();
  return text.length > 0 ? text : null;
}

function normalizeEmail(value) {
  const text = normalizeText(value);
  return text ? text.toLowerCase() : null;
}

function sanitizeUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    full_name: row.full_name,
    email: row.email,
    created_at: row.created_at,
  };
}

function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

async function signup(req, res) {
  try {
    let fullName = normalizeText(req.body.full_name || req.body.fullName);
    const email = normalizeEmail(req.body.email);
    const password = normalizeText(req.body.password);

    console.log('[auth:signup] received email:', email);

    if (!fullName && email) {
      fullName = email.split('@')[0];
    }

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Full name, email, and password are required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    const existing = await pool.query(
      `SELECT id FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1`,
      [email]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Account already exists with this email',
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await pool.query(
      `
        INSERT INTO users (full_name, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, full_name, email, created_at;
      `,
      [fullName, email, passwordHash]
    );

    return res.status(201).json({
      success: true,
      message: 'Signup successful',
    });
  } catch (error) {
    console.error('Signup Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
}

async function login(req, res) {
  try {
    const email = normalizeEmail(req.body.email);
    const password = normalizeText(req.body.password);

    console.log('[auth:login] received email:', email);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    let result;
    try {
      result = await pool.query(
        `
          SELECT id, full_name, email, password_hash, created_at
          FROM users
          WHERE LOWER(email) = LOWER($1)
             OR LOWER(full_name) = LOWER($1)
             OR (phone IS NOT NULL AND phone = $1)
          LIMIT 1;
        `,
        [email]
      );
    } catch (err) {
      // Fallback in case phone column is not in users table
      result = await pool.query(
        `
          SELECT id, full_name, email, password_hash, created_at
          FROM users
          WHERE LOWER(email) = LOWER($1)
             OR LOWER(full_name) = LOWER($1)
          LIMIT 1;
        `,
        [email]
      );
    }

    console.log('[auth:login] user found in DB:', result.rows.length > 0);

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'No account found for this email, name, or phone number',
      });
    }

    const userRow = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, userRow.password_hash);

    console.log('[auth:login] password comparison result:', isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password',
      });
    }

    const user = sanitizeUser(userRow);
    const token = signToken(user);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user,
    });
  } catch (error) {
    console.error('Login Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
}

async function profile(req, res) {
  try {
    const result = await pool.query(
      `
        SELECT id, full_name, email, created_at
        FROM users
        WHERE id = $1
        LIMIT 1;
      `,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      user: sanitizeUser(result.rows[0]),
    });
  } catch (error) {
    console.error('Profile Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
}

module.exports = {
  signup,
  login,
  profile,
};