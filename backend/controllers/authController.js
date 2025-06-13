const User = require('../models/User');

const register = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    // Validate required fields
    if (!email || !password || !name || !role) {
      return res.status(400).json({ 
        message: 'All fields are required' 
      });
    }

    // Validate role
    if (!['student', 'teacher'].includes(role)) {
      return res.status(400).json({ 
        message: 'Invalid role. Must be student or teacher' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email already exists' 
      });
    }

    // Create new user
    const user = new User({
      email,
      password,
      name,
      role
    });

    await user.save();

    // Create session
    req.session.user = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    res.status(201).json({
      message: 'User registered successfully',
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Registration failed', 
      error: error.message 
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required' 
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Create session
    req.session.user = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    res.json({
      message: 'Login successful',
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Login failed', 
      error: error.message 
    });
  }
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ 
        message: 'Logout failed' 
      });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logout successful' });
  });
};

const checkAuth = (req, res) => {
  if (req.session.user) {
    res.json({ 
      authenticated: true, 
      user: req.session.user 
    });
  } else {
    res.json({ 
      authenticated: false 
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  checkAuth
};