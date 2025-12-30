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

    console.log('Auth Middleware: Checking token', { 
      hasCookie: !!req.cookies?.token,
      cookieCount: Object.keys(req.cookies || {}).length,
      authHeader: !!req.headers.authorization 
    });

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      console.log('Auth Middleware: No token found');
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = verifyToken(token);
    console.log('Auth Middleware: Token verified for user', decoded.userId);

    (req as AuthRequest).userId = decoded.userId;
    (req as AuthRequest).user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error('Auth Middleware: Token verification failed', error);
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
