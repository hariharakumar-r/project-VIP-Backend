import User from "../models/User.js";

// Middleware to check if user is blocked
export default async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    if (user.isBlocked) {
      return res.status(403).json({ 
        message: "Your account has been blocked by the administrator. You cannot perform this action.",
        blocked: true 
      });
    }
    
    next();
  } catch (err) {
    console.error("Check blocked middleware error:", err);
    return res.status(500).json({ message: "Failed to verify account status" });
  }
};
