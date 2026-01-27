import { Router } from "express";
import { getLocations } from "../controllers/locationsController";

const router = Router();

router.get("/locations", getLocations);

export default router;
