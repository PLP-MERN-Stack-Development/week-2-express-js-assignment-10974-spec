const { 
  NotFoundError, 
  ValidationError,
  AuthError 
} = require('../errors/customErrors');

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  if (err instanceof NotFoundError) {
    return res.status(404).json({ error: err.message });
  }
  
  if (err instanceof ValidationError) {
    return res.status(400).json({ error: err.message });
  }
  
  if (err instanceof AuthError) {
    return res.status(401).json({ error: err.message });
  }
  
  res.status(500).json({ error: 'Internal Server Error' });
};

const notFoundHandler = (req, res, next) => {
  throw new NotFoundError('Route not found');
};

module.exports = {
  errorHandler,
  notFoundHandler
};