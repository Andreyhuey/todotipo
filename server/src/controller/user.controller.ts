import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { User } from "../entity/User";
import bcrypt from "bcrypt";

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find({
      select: ["id", "username", "email", "role", "createdAt", "updatedAt"],
    });

    res.status(200).json({ users });
    return;
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUserRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !["admin", "user"].includes(role)) {
      res.status(400).json({ message: "Valid role is required" });
      return;
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: Number(id) } });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.role = role;
    await userRepository.save(user);

    res.status(200).json({
      message: "User role updated successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Update user role error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
