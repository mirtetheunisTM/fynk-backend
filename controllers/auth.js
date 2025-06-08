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

module.exports = {
    signup,
    login,
    logout
};
