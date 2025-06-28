import { Router } from "express";
import { Login, Logout, Register,resetPassword ,requestPasswordReset} from "../controller/auth.js";

const router = Router();

router.post("/auth/register", Register);
router.post("/auth/login", Login);
router.post("/auth/logout", Logout);
router.post('/auth/requestPasswordReset', requestPasswordReset);
router.post("/auth/resetpassword",resetPassword);
export default router;
