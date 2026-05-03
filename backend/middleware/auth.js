const jwt = require("jsonwebtoken");

/**
 * JWT Authentication Middleware — placeholder.
 *
 * When authentication is implemented:
 * 1. Set JWT_SECRET in backend/.env
 * 2. Use this middleware on protected routes:
 *    router.get("/protected", authenticate, handler)
 */

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Unauthorised: No token provided",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "changeme");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorised: Invalid or expired token",
    });
  }
};

module.exports = { authenticate };
