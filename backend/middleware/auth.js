const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  next();
};

const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (req.session.user.role !== role) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    next();
  };
};

module.exports = {
  requireAuth,
  requireRole
};