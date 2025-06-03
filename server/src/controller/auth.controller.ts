import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { User } from "../entity/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const userRepository = AppDataSource.getRepository(User);

    // Check if user already exists
    const existingUser = await userRepository.findOne({
      where: [{ username }, { email }],
    });

    if (existingUser) {
      res.status(400).json({ message: "Username or email already exists" });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = userRepository.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    await userRepository.save(user);

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1d" });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      res.status(401).json({ message: "User does not exist!" });
      return;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async () => {};
