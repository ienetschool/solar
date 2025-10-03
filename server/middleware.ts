import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  // In a real app, check session or JWT token
  // For now, this is a placeholder that assumes auth is handled by frontend
  // You would implement actual session checking here
  next();
}

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    // In a real app, check user role from session
    // For now, this is a placeholder
    // You would check: if (!req.user || !roles.includes(req.user.role)) return res.status(403)...
    next();
  };
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  // In a real app, verify user is admin
  // For now, this is a placeholder
  next();
}
