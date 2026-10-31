/**
 * Authentication and Role Authorization Middleware
 * Protects endpoints, parses JWT tokens, and enforces role boundaries.
 */

const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/env");
const userModel = require("../models/userModel");

async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Authentication required",
      message: "Please log in with a valid authentication token."
    });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, jwtSecret);
    const user = await userModel.findUserById(decoded.id);

    if (!user) {
      return res.status(401).json({
        error: "User not found",
        message: "The account associated with this token no longer exists."
      });
    }

    if (user.status === "suspended") {
      return res.status(403).json({
        error: "Account suspended",
        message: "Your AgriTrace account has been suspended. Please contact support."
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      error: "Invalid or expired token",
      message: "Your session has expired. Please log in again."
    });
  }
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Authentication required before accessing this role-restricted resource."
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Forbidden",
        message: `Access denied. This section requires ${allowedRoles.join(" or ")} privileges. Your account role is '${req.user.role}'.`,
        requiredRoles: allowedRoles,
        userRole: req.user.role
      });
    }

    next();
  };
}

const requireAdmin = requireRole("admin");
const requireFarmer = requireRole("farmer");
const requireSeller = requireRole("seller");

module.exports = {
  authenticate,
  requireRole,
  requireAdmin,
  requireFarmer,
  requireSeller
};

