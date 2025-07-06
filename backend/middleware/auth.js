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
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    
    next();
  };
};

const requireTeacher = requireRole('teacher');
const requireStudent = requireRole('student');

module.exports = {
  requireAuth,
  requireRole,
  requireTeacher,
  requireStudent,
};