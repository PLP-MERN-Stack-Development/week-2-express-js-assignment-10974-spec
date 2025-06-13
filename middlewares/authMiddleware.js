const authenticate = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Valid API key required in x-api-key header'
    });
  }
  
  next();
};

module.exports = authenticate;