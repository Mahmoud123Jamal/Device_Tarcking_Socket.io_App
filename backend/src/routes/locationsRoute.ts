import { Router, Request, Response } from "express";
import {
  calculateDistanceAndEta,
  getRoute,
} from "../controllers/locationsController";

const router = Router();

const isValidCoords = (loc: any): boolean =>
  typeof loc?.latitude === "number" && typeof loc?.longitude === "number";

router.post("/calculate-distance", async (req: Request, res: Response) => {
  try {
    const { origin, dest } = req.body;

    if (!isValidCoords(origin?.location) || !isValidCoords(dest?.location)) {
      return res.status(400).json({ error: "Invalid coordinates format" });
    }

    const result = await calculateDistanceAndEta(origin, dest);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/route", async (req: Request, res: Response) => {
  try {
    const { start, end } = req.body;

    if (!start?.lat || !start?.lng || !end?.lat || !end?.lng) {
      return res.status(400).json({ error: "Missing start or end points" });
    }

    const origin = {
      location: { latitude: Number(start.lat), longitude: Number(start.lng) },
    };
    const dest = {
      location: { latitude: Number(end.lat), longitude: Number(end.lng) },
    };

    const geometry = await getRoute(origin, dest);

    if (!geometry) {
      return res.status(404).json({ error: "No route found" });
    }

    return res.json(geometry);
  } catch (error) {
    return res.status(500).json({ error: "Internal Routing Error" });
  }
});

export default router;
