import { Router } from "express";
import { Login, Logout, Register } from "../controller/auth.js";

const router = Router();

router.post("/auth/register", Register);
router.post("/auth/login", Login);
router.post("/auth/logout", Logout);
export default router;
