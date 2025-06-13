const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const {
  NotFoundError,
  ValidationError
} = require('../errors/customErrors');
const authenticate = require('../middlewares/authMiddleware');
const validateProduct = require('../middlewares/validationMiddleware');
const logger = require('../middlewares/loggerMiddleware');

let products = []; 

// GET all products 
router.get('/', logger, (req, res) => {
  let filteredProducts = [...products];
  
  // Filtering
  if (req.query.category) {
    filteredProducts = filteredProducts.filter(
      p => p.category.toLowerCase() === req.query.category.toLowerCase()
    );
  }
  
  if (req.query.inStock) {
    filteredProducts = filteredProducts.filter(
      p => p.inStock === (req.query.inStock === 'true')
    );
  }
  
  // Search
  if (req.query.search) {
    filteredProducts = filteredProducts.filter(
      p => p.name.toLowerCase().includes(req.query.search.toLowerCase())
    );
  }
  
  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  const result = {
    total: filteredProducts.length,
    page,
    limit,
    products: filteredProducts.slice(startIndex, endIndex)
  };
  
  res.json(result);
});

// GET product statistics
router.get('/stats', logger, (req, res) => {
  const stats = {
    totalProducts: products.length,
    inStock: products.filter(p => p.inStock).length,
    categories: {}
  };
  
  products.forEach(product => {
    stats.categories[product.category] = (stats.categories[product.category] || 0) + 1;
  });
  
  res.json(stats);
});

// GET single product
router.get('/:id', logger, (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    throw new NotFoundError('Product not found');
  }
  res.json(product);
});

// POST create product
router.post('/', logger, authenticate, validateProduct, (req, res) => {
  const newProduct = {
    id: uuidv4(),
    name: req.body.name,
    description: req.body.description || '',
    price: parseFloat(req.body.price),
    category: req.body.category,
    inStock: req.body.inStock || false
  };
  
  products.push(newProduct);
  res.status(201).json(newProduct);
});


router.put('/:id', logger, authenticate, validateProduct, (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    throw new NotFoundError('Product not found');
  }
  
  const updatedProduct = {
    ...products[index],
    ...req.body,
    id: req.params.id, 
    price: parseFloat(req.body.price)
  };
  
  products[index] = updatedProduct;
  res.json(updatedProduct);
});


router.delete('/:id', logger, authenticate, (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    throw new NotFoundError('Product not found');
  }
  
  const deletedProduct = products.splice(index, 1);
  res.json(deletedProduct[0]);
});

module.exports = (productsData) => {
  products = productsData;
  return router;
};