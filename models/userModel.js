// const { v4: uuidv4 } = require('uuid');
// Tijdelijke in-memory opslag
const users = [];

// Database connectie
const db = require('../config/db');
const { get } = require('../routes/sessions');

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
  // Prepare the update query
  const fields = [];
  const values = [];
  let index = 1;

  if (updates.name) {
    fields.push(`name = $${index++}`);
    values.push(updates.name);
  }
  if (updates.email) {
    fields.push(`email = $${index++}`);
    values.push(updates.email);
  }
  if (updates.password) {
    fields.push(`password = $${index++}`);
    values.push(updates.password);
  }

  if (fields.length === 0) {
    throw new Error('No updates provided');
  }

  // Add the user ID to the values
  values.push(id);

  // Execute the update query
  const query = `UPDATE "User" SET ${fields.join(', ')} WHERE user_id = $${index} RETURNING *;`;
  const result = await db.query(query, values);

  return result.rows[0]; // Return the updated user
};

// deleteUser
const deleteUserById = async (id) => {
  // Delete the user from the database
  const query = 'DELETE FROM "User" WHERE user_id = $1 RETURNING *;';
  const values = [id];
  const result = await db.query(query, values);
  if (result.rows.length === 0) {
    throw new Error('User not found or deletion failed');
  }
  return result.rows[0]; // Return the deleted user
};

// GET request to fetch all users
const getAllUsers = async () => {
  const result = await db.query('SELECT * FROM "User";');
  return result.rows;
};

// get all active users
const getActiveUsers = async () => {
    const result = await db.query('SELECT * FROM "User" WHERE is_active = true;');
    return result.rows;
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserById,
  deleteUserById,
  getAllUsers,
  getActiveUsers
};
