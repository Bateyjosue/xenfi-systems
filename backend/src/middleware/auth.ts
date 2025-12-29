import { Response, NextFunction, RequestHandler } from "express";
import { AuthRequest } from "../types";
import { verifyToken } from "../utils/jwt";

export const authenticate: RequestHandler = (
  req,
  res,
  next
) => {
  try {
    // Try to get token from cookie first, then fallback to Authorization header
    let token = req.cookies?.token;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = verifyToken(token);

    (req as AuthRequest).userId = decoded.userId;
    (req as AuthRequest).user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export const requireAdmin: RequestHandler = (
  req,
  res,
  next
) => {
  if ((req as AuthRequest).user?.role !== "ADMIN") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};
