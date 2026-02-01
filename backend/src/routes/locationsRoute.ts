import { Router, Request, Response } from "express";
import {
  calculateDistanceAndEta,
  getRoute,
} from "../controllers/locationsController";

const router = Router();

router.post("/locations", async (req: Request, res: Response) => {
  try {
    const { origin, dest } = req.body;

    if (!origin?.location || !dest?.location) {
      return res.status(400).json({ error: "Missing coordinates in body" });
    }

    const result = await calculateDistanceAndEta(origin, dest);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to calculate distance" });
  }
});

router.post("/route-geometry", async (req: Request, res: Response) => {
  try {
    const { origin, dest } = req.body;

    if (!origin?.location || !dest?.location) {
      return res.status(400).json({ error: "Missing coordinates in body" });
    }

    const geometry = await getRoute(origin, dest);
    res.json(geometry);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch route geometry" });
  }
});

export default router;
