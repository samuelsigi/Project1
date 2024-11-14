const http = require('http');
const authController = require('./controller/AuthController');
const opportunityController = require('./controller/OpportunityController');
const { isAuthenticated } = require('./middleware/AuthMiddleware');
const connectDB = require('./config/db'); // Import the db.js

// Connect to the database
connectDB(); // Establish MongoDB connection

// Create server
http.createServer((req, res) => {
  // Set response header for JSON response
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method === 'POST' && req.url === '/register') {
    // Register route
    authController.registerUser(req, res);
  } else if (req.method === 'POST' && req.url === '/login') {
    // Login route
    authController.loginUser(req, res);
  } else if (req.method === 'POST' && req.url === '/opportunities') {
    // Protected opportunity creation route
    isAuthenticated(req, res, () => {
      opportunityController.createOpportunity(req, res);
    });
  } else if (req.method === 'GET' && req.url.startsWith('/opportunities')) {
    // Protected opportunity list route
    isAuthenticated(req, res, () => {
      opportunityController.listOpportunities(req, res);
    });
  } else {
    // Handle 404 Not Found
    res.writeHead(404);
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
}).listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});
