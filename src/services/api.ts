import { Measurements, WeatherStations } from "@/app/types";
import axios from "axios";

// Configure the base URL for your NestJS API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Get all weather stations
export const getAllStations = async (
  states?: string[]
): Promise<WeatherStations[]> => {
  try {
    const params = states?.length ? `?states=${states.join(",")}` : "";
    const response = await api.get(`/weather-stations${params}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching weather stations:", error);
    throw new Error("Failed to fetch weather stations");
  }
};

// Get single weather station latest measurements
export const getStation = async (
  stationId: number
): Promise<Measurements[]> => {
  try {
    const response = await api.get(`/weather-stations/${stationId}/latest`);
    return response.data;
  } catch (error) {
    console.error("Error fetching latest measurements:", error);
    throw new Error("Failed to fetch latest measurements");
  }
};

// Get all variables with long names and units
export const getAllVariables = async () => {
  try {
    const response = await api.get("/weather-stations/variables");
    return response.data;
  } catch (error) {
    console.error("Error fetching variables:", error);
    throw new Error("Failed to fetch variables");
  }
};

export default api;
