// File: src/middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/database";
import { User } from "../entity/User";

// Extend the Express Request type to include a user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: decoded.id } });

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
    return;
  }
};

export const authorizeAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin access required" });
    return;
  }
};
