const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import your User model here

const authMiddleware = async (req, res, next) => {
  try {
    // Get the JWT token from cookies or headers (adjust as needed)
    const token = req.cookies.token || req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Verify the JWT token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRETKEY);

    // Check if the user exists in the database
    const user = await User.findById(decodedToken.userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach the authenticated user object to the request for future use
    req.user = user;

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.log("JWT Error: ", error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;