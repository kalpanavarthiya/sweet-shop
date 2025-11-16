const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = {
  authenticate: async (req, res, next) => {
    const header = req.header('Authorization');
    if (!header) return res.status(401).json({ message: 'No token' });
    const token = header.replace('Bearer ', '');
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'change_this_secret');
      const user = await User.findById(payload.id).select('-passwordHash');
      if (!user) return res.status(401).json({ message: 'Invalid token' });
      req.user = user;
      next();
    } catch(err){
      return res.status(401).json({ message: 'Invalid token' });
    }
  },
  requireAdmin: (req,res,next) => {
    if (!req.user) return res.status(401).json({ message: 'Missing user' });
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
    next();
  }
};
