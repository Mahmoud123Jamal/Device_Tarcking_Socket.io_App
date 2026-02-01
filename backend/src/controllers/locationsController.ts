import { ParticipantData } from "../types/ParticipantDataType";
import { RouteResponse } from "../types/RouteResponse";

export const calculateDistanceAndEta = async (
  origin: Partial<ParticipantData>,
  dest: Partial<ParticipantData>,
): Promise<RouteResponse> => {
  const apiKey = process.env.ORS_API_KEY as string;

  if (!origin.location || !dest.location) {
    return { distance: "N/A", duration: "N/A" };
  }

  const start = `${origin.location.longitude},${origin.location.latitude}`;
  const end = `${dest.location.longitude},${dest.location.latitude}`;

  try {
    const response = await fetch(
      `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${start}&end=${end}`,
    );

    if (!response.ok) throw new Error("ORS API Error");

    const data = await response.json();
    const summary = data.features[0].properties.summary;

    return {
      distance: (summary.distance / 1000).toFixed(2) + " km",
      duration: Math.ceil(summary.duration / 60) + " mins",
    };
  } catch (error) {
    console.error("Calculation Error:", error);
    return { distance: "N/A", duration: "N/A" };
  }
};

export const getRoute = async (
  origin: Partial<ParticipantData>,
  dest: Partial<ParticipantData>,
): Promise<any> => {
  const apiKey = process.env.ORS_API_KEY as string;

  if (!origin.location || !dest.location) {
    throw new Error("Coordinates are missing");
  }

  const start = `${origin.location.longitude},${origin.location.latitude}`;
  const end = `${dest.location.longitude},${dest.location.latitude}`;

  try {
    const response = await fetch(
      `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${start}&end=${end}`,
    );

    if (!response.ok) throw new Error("ORS API Error");

    const data = await response.json();

    return data.features[0].geometry;
  } catch (error) {
    console.error("GetRoute Error:", error);
    throw error;
  }
};
