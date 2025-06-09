// const { v4: uuidv4 } = require('uuid');
// Tijdelijke in-memory opslag
const users = [];

// Database connectie
const db = require('../config/db');

// signup
const createUser = async (user) => {
    // Check if user already exists
    const existingUser = await findUserByEmail(user.email);
    if (existingUser) {
        throw new Error('User already exists');
    }

    // Insert user into the database
    const query = `
        INSERT INTO "User" (name, email, password, created_at)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
    const values = [
        user.name,
        user.email,
        user.password,
        new Date() // created_at
    ];
    const result = await db.query(query, values);
    if (result.rows.length === 0) {
        throw new Error('User creation failed');
    }
    return result.rows[0]; // Return the created user (including user_id)
};

// login
const findUserByEmail = async (email) => {
  // Check if user exists by email
  const query = 'SELECT * FROM "User" WHERE email = $1';
  const values = [email];
  const result = await db.query(query, values);
  return result.rows.length > 0 ? result.rows[0] : null;
};

const findUserById = async (id) => {
  // Check if user exists by ID
  const query = 'SELECT * FROM "User" WHERE user_id = $1';
  const values = [id];
  const result = await db.query(query, values);
  return result.rows.length > 0 ? result.rows[0] : null;
};

// updateUser
const updateUserById = async (id, updates) => {
  // Find user by ID
  if (!user) return null;

  Object.assign(user, updates);
  return user;
};

// deleteUser
const deleteUserById = async (id) => {
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return null;

  const deletedUser = users.splice(index, 1);
  return deletedUser[0];
};

// GET request to fetch all users
const getAllUsers = async () => {
  return users;
};
// GET request to fetch a user by ID
const getUserById = async (id) => {
  return users.find(u => u.id === id);
};
// GET request to fetch a user by email
const getUserByEmail = async (email) => {
  return users.find(u => u.email === email);
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserById,
  deleteUserById,
  getAllUsers,
  getUserById,
  getUserByEmail
};
