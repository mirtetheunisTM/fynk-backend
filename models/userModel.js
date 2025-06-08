const { v4: uuidv4 } = require('uuid');

// Tijdelijke in-memory opslag
const users = [];

// signup
const createUser = async (user) => {

    user.id = uuidv4(); // Use UUID for unique user IDs

    users.push(user);
    return user;
};

// login
const findUserByEmail = async (email) => {
  return users.find(u => u.email === email);
};

const findUserById = async (id) => {
  return users.find(u => u.id === id);
};

// updateUser
const updateUserById = async (id, updates) => {
  const user = users.find(u => u.id === id);
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
