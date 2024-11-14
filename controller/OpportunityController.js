// controllers/opportunityController.js
const opportunityModel = require('../model/OpportunityModel');

// List opportunities with filters and pagination
const listOpportunities = async (req, res) => {
  const urlParams = new URLSearchParams(req.url.split('?')[1]);
  const filters = {
    category: urlParams.get('category'),
    minPrice: parseInt(urlParams.get('minPrice')),
    maxPrice: parseInt(urlParams.get('maxPrice')),
    condition: urlParams.get('condition')
  };

  const page = parseInt(urlParams.get('page')) || 1;
  const limit = parseInt(urlParams.get('limit')) || 10;

  try {
  const opportunities = await opportunityModel.getOpportunities(filters, page, limit);

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(opportunities));
} catch (error) {
  res.writeHead(500, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Error retrieving opportunities', error: error.message }));
}
};

// Create new opportunity
const createOpportunity = async (req, res) => {
let body = '';

// Gather the raw body data
req.on('data', chunk => {
  body += chunk.toString();
});

req.on('end', async () => {
  try {
    const opportunityData = JSON.parse(body);

    // Validate required fields
    const { title, organization, location, duration, type, price, condition, category } = opportunityData;
    if (!title || !organization || !location || !duration || !type || !price || !condition || !category) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: 'Missing required fields' }));
    }

    // Create new opportunity using the model
    await opportunityModel.addOpportunity(opportunityData);

    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Opportunity created successfully' }));
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Server error', error: error.message }));
  }
});
};

module.exports = {
listOpportunities,
createOpportunity
};


