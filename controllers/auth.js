//Functies die hier moeten komen: signup, login, logout, changePassword, deleteAccount, updateAccount
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const users = []; // This should be replaced with a database in a real application

const signup = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { username, password: hashedPassword };
    users.push(newUser);

    res.status(201).json({ 
        message: 'User created successfully',
        data: {
            username: newUser.username
        }
     });
}

module.exports = {
    signup,
    // login: authController.login, // Uncomment and implement login function
    // logout: authController.logout, // Uncomment and implement logout function
    // changePassword: authController.changePassword, // Uncomment and implement changePassword function
    // deleteAccount: authController.deleteAccount, // Uncomment and implement deleteAccount function
    // updateAccount: authController.updateAccount // Uncomment and implement updateAccount function
};
