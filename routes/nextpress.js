import { Router } from "express";
import {
  AddUrl,
  GetUrl,
  GetSpeUrl,
  UpdateSpeUrl,
  DeleteUrl,
} from "../controller/nextpress.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();

router.post("/nextpress/add-url", verifyToken, AddUrl);
router.get("/nextpress/get-url", verifyToken, GetUrl);
router.get("/nextpress/get-specific/:url", verifyToken, GetSpeUrl);
router.put("/nextpress/update-specific/:url", verifyToken, UpdateSpeUrl);
router.delete("/nextpress/delete-url/:id", verifyToken, DeleteUrl);

export default router;
