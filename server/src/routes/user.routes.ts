import { Router } from "express";
import { getAllUsers, updateUserRole } from "../controller/user.controller";
import { authenticate, authorizeAdmin } from "../middleware/auth";

const router = Router();

router.get("/", authenticate, authorizeAdmin, getAllUsers);
router.put("/:id/role", authenticate, authorizeAdmin, updateUserRole);

export default router;
