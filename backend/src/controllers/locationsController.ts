import { ParticipantData } from "../types/ParticipantDataType";
import { RouteResponse } from "../types/RouteResponse";

const routeCache = new Map<string, { data: any; expiry: number }>();
const CACHE_DURATION = 30000;

const extractCoords = (obj: any) => {
  const lat = obj?.location?.latitude ?? obj?.lat ?? obj?.latitude;
  const lng = obj?.location?.longitude ?? obj?.lng ?? obj?.longitude;
  return {
    lat: lat !== undefined && lat !== null ? Number(lat) : null,
    lng: lng !== undefined && lng !== null ? Number(lng) : null,
  };
};

export const calculateDistanceAndEta = async (
  origin: Partial<ParticipantData>,
  dest: Partial<ParticipantData>,
): Promise<RouteResponse> => {
  const apiKey = process.env.ORS_API_KEY || "";
  const { lat: lat1, lng: lng1 } = extractCoords(origin);
  const { lat: lat2, lng: lng2 } = extractCoords(dest);

  if (
    lat1 === null ||
    lng1 === null ||
    lat2 === null ||
    lng2 === null ||
    !apiKey
  ) {
    console.warn(
      "calculateDistanceAndEta: Invalid coordinates or missing API key",
    );
    return { distance: "N/A", duration: "N/A" };
  }

  const cacheKey = `matrix-${lng1},${lat1}-${lng2},${lat2}`;
  const cached = routeCache.get(cacheKey);
  if (cached && Date.now() < cached.expiry) return cached.data;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(
      "https://api.openrouteservice.org/v2/matrix/driving-car",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: apiKey,
        },
        body: JSON.stringify({
          locations: [
            [lng1, lat1],
            [lng2, lat2],
          ],
          metrics: ["distance", "duration"],
          units: "km",
        }),
        signal: controller.signal,
      },
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      return { distance: "Error", duration: "--" };
    }

    const data = await response.json();
    const distance = data.distances?.[0]?.[1];
    const duration = data.durations?.[0]?.[1];

    if (distance === undefined || duration === undefined || distance === null) {
      return { distance: "No Route", duration: "--" };
    }

    const result =
      distance < 0.01
        ? { distance: "Arrived", duration: "0 mins" }
        : {
            distance: `${distance.toFixed(2)} km`,
            duration: `${Math.ceil(duration / 60)} mins`,
          };

    routeCache.set(cacheKey, {
      data: result,
      expiry: Date.now() + CACHE_DURATION,
    });
    return result;
  } catch (err: any) {
    clearTimeout(timeoutId);
    return { distance: "Offline", duration: "--" };
  }
};

export const getRoute = async (
  origin: Partial<ParticipantData>,
  dest: Partial<ParticipantData>,
): Promise<any> => {
  const apiKey = process.env.ORS_API_KEY || "";
  const { lat: lat1, lng: lng1 } = extractCoords(origin);
  const { lat: lat2, lng: lng2 } = extractCoords(dest);

  if (
    lat1 === null ||
    lng1 === null ||
    lat2 === null ||
    lng2 === null ||
    !apiKey
  )
    return null;

  const cacheKey = `geometry-${lng1},${lat1}-${lng2},${lat2}`;
  const cached = routeCache.get(cacheKey);
  if (cached && Date.now() < cached.expiry) return cached.data;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(
      "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: apiKey,
        },
        body: JSON.stringify({
          coordinates: [
            [lng1, lat1],
            [lng2, lat2],
          ],
        }),
        signal: controller.signal,
      },
    );

    clearTimeout(timeoutId);

    if (!response.ok) return null;

    const data = await response.json();
    const geometry = data.features?.[0]?.geometry ?? null;

    if (geometry) {
      routeCache.set(cacheKey, {
        data: geometry,
        expiry: Date.now() + CACHE_DURATION,
      });
    }

    return geometry;
  } catch (err: any) {
    clearTimeout(timeoutId);
    return null;
  }
};
