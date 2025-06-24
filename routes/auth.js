import { Router } from "express";
import { Login, Register } from "../controller/auth.js";

const router = Router();

router.post("/auth/register", Register);
router.post("/auth/login", Login);

export default router;
