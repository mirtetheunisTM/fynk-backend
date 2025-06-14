//Functies die hier moeten komen: signup, login, logout, changePassword, deleteAccount, updateAccount
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

// userModel
const userModel = require('../models/userModel');

// /auth/signup
const signup = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !password || !email) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { name, email, password: hashedPassword };

    const savedUser = await userModel.createUser(newUser);

    // Generate a JWT token
    const token = jwt.sign({ id: savedUser.user_id, email: savedUser.email }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ 
        message: 'User created successfully',
        data: {
            email: savedUser.email,
            name: savedUser.name,
            token: token
        }
    });
}

// auth/login
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await userModel.findUserByEmail(email);
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.user_id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ 
        message: 'Login successful',
        token
     });
}

// /auth/logout
const logout = (req, res) => {
    // In a real application, you would invalidate the token here
    res.status(200).json({ message: 'Logout successful' });
}

// These functions require authentication middleware to be implemented
// auth/changePassword
const changePassword = async (req, res) => {
    // Our flow in frontend:
    // 1. User clicks "Change Password"
    // 2. User enters current password, new password, and confirms new password
    // 3. User submits the form
    // 4. Backend verifies current password, hashes new password, and updates it in the database
    const { currentPassword, newPassword } = req.body;
    
    const user = await userModel.findUserByEmail(req.user.email);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
        return res.status(401).json({ message: 'Current password is incorrect' });
    }
    if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;

    // Update the user's password in the database
    const updatedUser = await userModel.updateUserById(user.user_id, { password: hashedNewPassword });
    if (!updatedUser) {
        return res.status(500).json({ message: 'Error updating password' });
    }
    res.status(200).json({ message: 'Password changed successfully' });
}

// auth/deleteAccount
const deleteAccount = async (req, res) => {
    try {
        // Remove user from the database using userModel
        const deleted = await userModel.deleteUserById(req.user.id);
        if (!deleted) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting account' });
    }
}

// auth/updateAccount
const updateAccount = async (req, res) => {
    const { name, email } = req.body;
    try {
        // Check if user exists
        const user = await userModel.findUserById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // If email is being changed, check for conflicts
        if (email && email !== user.email) {
            const existingUser = await userModel.findUserByEmail(email);
            if (existingUser) {
                return res.status(400).json({ message: 'Email already in use' });
            }
        }
        // Update user in the database
        const updatedUser = await userModel.updateUserById(req.user.id, { name, email });
        res.status(200).json({
            message: 'Account updated successfully',
            data: {
                email: updatedUser.email,
                name: updatedUser.name
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Error updating account' });
    }
};

// Get a user by ID
const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await userModel.getUserById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User retrieved successfully', data: user });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user', error: error.message });
    }
};

// Get a user by email
const getUserByEmail = async (req, res) => {
    try {
        const email = req.params.email;
        const user = await userModel.getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User retrieved successfully', data: user });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user', error: error.message });
    }
};

// get active users
const getActiveUsers = async (req, res) => {
    try {
        const activeUsers = await userModel.getActiveUsers();
        res.status(200).json({ message: 'Active users retrieved successfully', data: activeUsers });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving active users', error: error.message });
    }
};


module.exports = {
    signup,
    login,
    logout,
    changePassword,
    deleteAccount,
    updateAccount,
    getUserById,
    getUserByEmail,
    getActiveUsers
};
