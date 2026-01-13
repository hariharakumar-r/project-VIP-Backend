export default (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    console.warn(`Access denied for role: ${req.user.role}`);
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};
