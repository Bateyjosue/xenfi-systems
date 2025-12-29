import { Router } from "express";
import {
  getAdminStats,
  getAllExpenses,
  getAllUsers,
} from "../controllers/admin.controller";
import { authenticate, requireAdmin } from "../middleware/auth";

const router = Router();

router.use(authenticate);
router.use(requireAdmin); // All admin routes require admin role

router.get("/stats", getAdminStats);
router.get("/expenses", getAllExpenses);
router.get("/users", getAllUsers);

export default router;
