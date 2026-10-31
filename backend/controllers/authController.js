/**
 * Authentication Controller for AgriTrace
 * Implements strict role exclusivity:
 * - One Gmail / email -> exactly one account and one role.
 * - Cross-role registration rejection.
 * - Portal mismatch detection and redirection.
 */

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { jwtSecret } = require("../config/env");
const { normalizeEmail } = require("../utils/emailNormalizer");
const userModel = require("../models/userModel");
const { verifyGoogleIdToken, getGoogleClientId } = require("../services/googleAuthService");

async function register(req, res) {
  try {
    const { email, password, name, role, phone, location } = req.body;

    if (!email || !password || !name || !role) {
      return res.status(400).json({
        error: "Missing fields",
        message: "Email, password, name, and role are required."
      });
    }

    const allowedRoles = ["farmer", "seller"];
    if (!allowedRoles.includes(role.toLowerCase())) {
      return res.status(400).json({
        error: "Invalid role",
        message: "Registration role must be either 'farmer' or 'seller'."
      });
    }

    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail || !normalizedEmail.includes("@")) {
      return res.status(400).json({
        error: "Invalid email",
        message: "A valid email address is required."
      });
    }

    if (typeof password !== "string" || password.length < 6) {
      return res.status(400).json({
        error: "Weak password",
        message: "Password must be at least 6 characters long."
      });
    }

    // FEATURE 2: Check if email already belongs to any account
    const existingUser = await userModel.findUserByEmail(normalizedEmail);
    if (existingUser) {
      if (existingUser.role.toLowerCase() === role.toLowerCase()) {
        return res.status(409).json({
          error: "Account already exists",
          message: `An account with this email is already registered as a ${existingUser.role}. Please log in.`,
          existingRole: existingUser.role
        });
      } else {
        return res.status(409).json({
          error: "Role conflict",
          message: `This email is already registered as a ${existingUser.role}. In AgriTrace, each email can hold only one role. You cannot register as a ${role}.`,
          existingRole: existingUser.role
        });
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(24).toString("hex");

    const newUser = await userModel.createUser({
      email: normalizedEmail,
      passwordHash,
      name: name.trim(),
      role: role.toLowerCase(),
      phone: phone ? phone.trim() : null,
      location: location ? location.trim() : null,
      isVerified: true, // Mark verified for clean onboarding experience
      verificationToken
    });

    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        is_verified: newUser.is_verified
      },
      jwtSecret,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      message: `Successfully registered as a ${newUser.role}`,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        status: newUser.status,
        is_verified: newUser.is_verified,
        points_balance: Number(newUser.points_balance),
        total_points_earned: Number(newUser.total_points_earned),
        phone: newUser.phone,
        location: newUser.location,
        created_at: newUser.created_at
      },
      token
    });
  } catch (err) {
    if (err.code === "23505" || /duplicate key/i.test(err.message)) {
      return res.status(409).json({
        error: "Email in use",
        message: "An account with this email address was just registered. Please log in."
      });
    }
    console.error("[register error]", err);
    return res.status(500).json({ error: "Registration failed", message: err.message });
  }
}

async function login(req, res) {
  try {
    const { email, password, portalRole } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Missing credentials",
        message: "Email and password are required."
      });
    }

    const normalizedEmail = normalizeEmail(email);
    const user = await userModel.findUserByEmail(normalizedEmail);

    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials",
        message: "No AgriTrace account found with this email."
      });
    }

    // Portal role guard
    if (portalRole && user.role !== "admin") {
      const requestedPortal = portalRole.toLowerCase();
      if (user.role.toLowerCase() !== requestedPortal) {
        return res.status(403).json({
          error: "Portal mismatch",
          message: `This account is registered as a ${user.role.toUpperCase()}. Please log in via the ${user.role.toUpperCase()} portal.`,
          registeredRole: user.role,
          correctPortal: user.role
        });
      }
    }

    if (!user.password_hash) {
      return res.status(401).json({
        error: "Google account",
        message: "This account is registered using Google Sign-In. Please click 'Continue with Google' to sign in."
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        error: "Invalid credentials",
        message: "Incorrect password entered."
      });
    }

    if (user.status === "suspended") {
      return res.status(403).json({
        error: "Account suspended",
        message: "Your AgriTrace account has been suspended."
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        is_verified: user.is_verified
      },
      jwtSecret,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
        is_verified: user.is_verified,
        points_balance: Number(user.points_balance),
        total_points_earned: Number(user.total_points_earned),
        phone: user.phone,
        location: user.location,
        created_at: user.created_at
      },
      token
    });
  } catch (err) {
    console.error("[login error]", err);
    return res.status(500).json({ error: "Login failed", message: err.message });
  }
}

async function getProfile(req, res) {
  try {
    const user = await userModel.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
        is_verified: user.is_verified,
        points_balance: Number(user.points_balance),
        total_points_earned: Number(user.total_points_earned),
        phone: user.phone,
        location: user.location,
        created_at: user.created_at
      }
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch profile", message: err.message });
  }
}

async function verifyEmail(req, res) {
  try {
    const { token, userId } = req.body;
    const targetId = userId || (req.user ? req.user.id : null);
    if (!targetId) {
      return res.status(400).json({ error: "Missing user identification" });
    }
    const updated = await userModel.setUserVerified(targetId, true);
    return res.json({ message: "Account email verified successfully", is_verified: true, updated });
  } catch (err) {
    return res.status(500).json({ error: "Failed to verify email", message: err.message });
  }
}

async function googleAuth(req, res) {
  try {
    const { credential, portalRole, location } = req.body;

    if (!credential) {
      return res.status(400).json({
        error: "Missing credential",
        message: "Google ID token credential is required."
      });
    }

    if (!portalRole) {
      return res.status(400).json({
        error: "Missing role",
        message: "Portal role ('farmer' or 'seller') is required."
      });
    }

    const requestedRole = portalRole.toLowerCase();
    const allowedRoles = ["farmer", "seller"];
    if (!allowedRoles.includes(requestedRole)) {
      return res.status(400).json({
        error: "Invalid role",
        message: "Portal role must be either 'farmer' or 'seller'."
      });
    }

    // Verify token with Google's official library
    let payload;
    try {
      payload = await verifyGoogleIdToken(credential);
    } catch (tokenErr) {
      return res.status(tokenErr.status || 401).json({
        error: "Invalid Google token",
        message: tokenErr.message || "Google authentication verification failed."
      });
    }

    // Validate email verification status from Google
    if (!payload.email_verified) {
      return res.status(401).json({
        error: "Unverified email",
        message: "Your Google email address must be verified by Google to use AgriTrace."
      });
    }

    const normalizedEmail = normalizeEmail(payload.email);
    if (!normalizedEmail || !normalizedEmail.includes("@")) {
      return res.status(400).json({
        error: "Invalid email",
        message: "A valid email address was not received from Google."
      });
    }

    // Check if user already exists with this email
    const existingUser = await userModel.findUserByEmail(normalizedEmail);

    if (existingUser) {
      // FEATURE 2 & 3: Check strict role exclusivity
      if (existingUser.role.toLowerCase() !== requestedRole) {
        return res.status(403).json({
          error: "Portal mismatch",
          message: `This Google account (${normalizedEmail}) is registered as a ${existingUser.role.toUpperCase()}. In AgriTrace, each account can hold only one role. You cannot access or register in the ${requestedRole.toUpperCase()} portal with this account.`,
          registeredRole: existingUser.role,
          correctPortal: existingUser.role,
          userEmail: existingUser.email
        });
      }

      if (existingUser.status === "suspended") {
        return res.status(403).json({
          error: "Account suspended",
          message: "Your AgriTrace account has been suspended."
        });
      }

      // Secure account linking for existing user with matching role
      let updatedUser = existingUser;
      if (!existingUser.google_sub || existingUser.auth_provider === "local") {
        updatedUser = await userModel.linkGoogleAccount(existingUser.id, {
          googleSub: payload.sub,
          pictureUrl: payload.picture || null
        });
      }

      const token = jwt.sign(
        {
          id: updatedUser.id,
          email: updatedUser.email,
          role: updatedUser.role,
          is_verified: true
        },
        jwtSecret,
        { expiresIn: "7d" }
      );

      return res.json({
        message: `Successfully signed in as ${updatedUser.name} (${updatedUser.role})`,
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          role: updatedUser.role,
          status: updatedUser.status,
          is_verified: true,
          points_balance: Number(updatedUser.points_balance),
          total_points_earned: Number(updatedUser.total_points_earned),
          phone: updatedUser.phone,
          location: updatedUser.location,
          google_sub: updatedUser.google_sub,
          auth_provider: updatedUser.auth_provider,
          picture_url: updatedUser.picture_url,
          created_at: updatedUser.created_at
        },
        token,
        isNewUser: false
      });
    }

    // New User Registration via Google OAuth
    const newUser = await userModel.createGoogleUser({
      email: normalizedEmail,
      name: (payload.name || normalizedEmail.split("@")[0]).trim(),
      role: requestedRole,
      googleSub: payload.sub,
      pictureUrl: payload.picture || null,
      location: location ? location.trim() : null
    });

    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        is_verified: true
      },
      jwtSecret,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      message: `Successfully registered as a ${newUser.role} with Google`,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        status: newUser.status,
        is_verified: true,
        points_balance: Number(newUser.points_balance),
        total_points_earned: Number(newUser.total_points_earned),
        phone: newUser.phone,
        location: newUser.location,
        google_sub: newUser.google_sub,
        auth_provider: newUser.auth_provider,
        picture_url: newUser.picture_url,
        created_at: newUser.created_at
      },
      token,
      isNewUser: true
    });
  } catch (err) {
    if (err.code === "23505" || /duplicate key/i.test(err.message)) {
      return res.status(409).json({
        error: "Account conflict",
        message: "An account with this email address or Google ID was just registered. Please sign in."
      });
    }
    console.error("[googleAuth error]", err);
    return res.status(500).json({ error: "Google authentication failed", message: err.message });
  }
}

async function getGoogleConfig(req, res) {
  const clientId = getGoogleClientId();
  return res.json({
    clientId,
    configured: Boolean(clientId && clientId !== "your-google-client-id.apps.googleusercontent.com")
  });
}

async function logout(req, res) {
  return res.json({ message: "Logged out successfully" });
}

module.exports = {
  register,
  login,
  googleAuth,
  getGoogleConfig,
  logout,
  getProfile,
  verifyEmail
};

