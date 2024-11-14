const mongoose = require('mongoose');

// Define the schema for an opportunity
const opportunitySchema = new mongoose.Schema({
  title: {
    type: String
  },
  organization: {
    type: String
  },
  location: {
    type: String
  },
  duration: {
    type: String
  },
  type: {
    type: String,
    enum: ['onsite', 'remote'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  condition: {
    type: String,
    enum: ['new', 'ongoing'],
    required: true
  },
  category: {
    type: String,
    required: true
  }
}, { timestamps: true });

// Create and export the model
const Opportunity = mongoose.model('Opportunity', opportunitySchema);

// Add a new opportunity
const addOpportunity = async (opportunity) => {
  try {
    // Validate price
    if (isNaN(opportunity.price)) {
      throw new Error('Price must be a valid number');
    }

    // Check for duplicates (same title, organization, location, duration, and category)
    const existingOpportunity = await Opportunity.findOne({
      title: opportunity.title,
      organization: opportunity.organization,
      location: opportunity.location,
      duration: opportunity.duration,
      category: opportunity.category
    });

    if (existingOpportunity) {
      throw new Error('Opportunity with the same title, organization, location, duration, and category already exists');
    }

    // Proceed to create and save the new opportunity
    const newOpportunity = new Opportunity(opportunity);
    await newOpportunity.save();
    console.log('Opportunity added:', newOpportunity);
  } catch (error) {
    console.error('Error adding opportunity:', error);
    throw error; // Propagate error for further handling if needed
  }
};

// Get opportunities with filters and pagination
const getOpportunities = async (filters = {}, page = 1, limit = 10) => {
  try {
    let query = {};

    // Filter by category
    if (filters.category) {
      query.category = filters.category;
    }

    // Filter by price range
    if (!isNaN(filters.minPrice) && !isNaN(filters.maxPrice)) {
      query.price = { $gte: Number(filters.minPrice), $lte: Number(filters.maxPrice) };
    }
    // Filter by condition
    if (filters.condition) {
      query.condition = filters.condition;
    }

    // Pagination setup
    const skip = (page - 1) * limit;
    const opportunities = await Opportunity.find(query)
      .skip(skip)
      .limit(limit);

    return opportunities;
  } catch (error) {
    console.error('Error retrieving opportunities:', error);
    throw error; // Propagate error for further handling if needed
  }
};

module.exports = {
  addOpportunity,
  getOpportunities
};
