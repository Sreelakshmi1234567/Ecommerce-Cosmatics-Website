const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.userId = decoded.userId; 
    next(); 
  } catch (err) {
    console.error('Error verifying token:', err);
    res.status(400).json({ message: 'Invalid token' });
  }
};

module.exports = authenticateUser;
