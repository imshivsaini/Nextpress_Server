import { Router } from "express";
import { AddUrl,GetUrl,GetSpeUrl,UpdateSpeUrl } from "../controller/nextpress.js";


const router = Router();

router.post("/nextpress/add-url",AddUrl);
router.get("/nextpress/get-url",GetUrl);
router.get("/nextpress/get-specific/:url",GetSpeUrl);
router.put("/nextpress/update-specific/:url",UpdateSpeUrl);

export default router;