//Functies die hier moeten komen: signup, login, logout, changePassword, deleteAccount, updateAccount
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const users = []; // This should be replaced with a database in a real application

// /auth/signup
const signup = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !password || !email) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { name, email, password: hashedPassword };
    users.push(newUser);

    res.status(201).json({ 
        message: 'User created successfully',
        data: {
            email: newUser.email,
            name: newUser.name
        }
     });
}

// auth/login
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = users.find(user => user.email === email);
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });
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
    const user = users.find(user => user.id === req.user.userId); // Assuming req.user is set by auth middleware
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
    res.status(200).json({ message: 'Password changed successfully' });
}


module.exports = {
    signup,
    login,
    logout,
    changePassword
};
