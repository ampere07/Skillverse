const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const userRole = req.session.user.role;
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        message: 'Access denied. Insufficient permissions.' 
      });
    }

    next();
  };
};

const isStudent = checkRole(['student']);
const isTeacher = checkRole(['teacher']);
const isStudentOrTeacher = checkRole(['student', 'teacher']);

module.exports = {
  checkRole,
  isStudent,
  isTeacher,
  isStudentOrTeacher
};