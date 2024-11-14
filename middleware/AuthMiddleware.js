const jwt = require('jsonwebtoken');
const { User } = require('../model/UserModel'); // Ensure the correct import

const isAuthenticated = async (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'Unauthorized: No token provided' }));
  }

  try {
    // Verify the JWT token
    console.log(token+"token");
    console.log(process.env.JWT_SECRET+"jwt_secret");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Use async/await with findById
    const user = await User.findById(decoded.id);

    if (!user) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: 'Unauthorized: Invalid token' }));
    }

    // Attach the user to the request object
    req.user = user;

    // Call the next function (which would be the route handler)
    next();
  } catch (error) {
    console.error('Error in authentication middleware:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'Server error' }));
  }
};

module.exports = { isAuthenticated };
