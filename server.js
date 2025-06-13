require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { errorHandler, notFoundHandler } = require('./middlewares/errorMiddleware');
const productsRouter = require('./routes/productsRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Sample products data
const products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  // ... other sample products
];

// Middleware
app.use(bodyParser.json());
app.use(morgan('dev'));

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

app.use('/api/products', productsRouter(products));

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;