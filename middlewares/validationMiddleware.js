const validateProduct = (req, res, next) => {
  const { name, price, category } = req.body;
  
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing product name' });
  }
  
  if (!price || isNaN(price)) {
    return res.status(400).json({ error: 'Invalid or missing price' });
  }
  
  if (!category || typeof category !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing category' });
  }
  
  next();
};

module.exports = validateProduct;