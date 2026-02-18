export const authorize = (...roles) => {
  return (req, res, next) => {

    // If user not authenticated
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized. Please login."
      });
    }

    // Role check
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    next();
  };
};
