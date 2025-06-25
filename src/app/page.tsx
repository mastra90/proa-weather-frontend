"use client";
import { useState, useEffect } from "react";
import { Typography, Box, Alert, CircularProgress } from "@mui/material";
import { getAllStations } from "@/services/api";
import GoogleMaps from "./GoogleMaps";
import { WeatherStations } from "./types";

const Home = () => {
  const [weatherStations, setWeatherStations] = useState<WeatherStations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWeatherStations = async () => {
      try {
        setLoading(true);
        const stations = await getAllStations();
        setWeatherStations(stations);
      } catch (err) {
        setError("Failed to load weather stations");
        console.error("Error loading weather stations:", err);
      } finally {
        setLoading(false);
      }
    };
    loadWeatherStations();
  }, []);

  if (!weatherStations)
    return (
      <Box
        sx={{
          m: "auto",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          maxWidth: 1600,
        }}
      >
        <CircularProgress sx={{ m: "auto" }} />
      </Box>
    );

  if (error) {
    return (
      <Alert sx={{ m: 2, width: "fit-content" }} severity="error">
        An error has occured: {error ? error : "Error message not found."}
      </Alert>
    );
  }

  return (
    <Box sx={{ m: "auto", maxWidth: 1600 }}>
      <Typography variant="h3">Weather Stations Map</Typography>
      <GoogleMaps weatherStations={weatherStations} />
    </Box>
  );
};

export default Home;
