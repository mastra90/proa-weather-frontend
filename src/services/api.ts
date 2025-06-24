import { Measurements, WeatherStations } from "@/app/types";
import axios from "axios";

// Configure the base URL for your NestJS API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Fetch all weather stations
export const fetchWeatherStations = async (): Promise<WeatherStations[]> => {
  try {
    const response = await api.get("/weather-stations");
    return response.data;
  } catch (error) {
    console.error("Error fetching weather stations:", error);
    throw new Error("Failed to fetch weather stations");
  }
};

// Fetch latest measurements for a specific weather station
export const fetchLatestMeasurements = async (
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

export default api;
