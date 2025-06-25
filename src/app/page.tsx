"use client";
import { useState, useEffect, useMemo } from "react";
import { Typography, Box, Alert, CircularProgress } from "@mui/material";
import GoogleMaps from "./GoogleMaps";
import { WeatherStations } from "./types";
import { getAllStations } from "@/services/api";

const Home = () => {
  const availableStates = ["VIC", "NSW", "QLD", "SA"];
  const [allStations, setAllStations] = useState<WeatherStations[]>([]);
  const [selectedStates, setSelectedStates] =
    useState<string[]>(availableStates);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get all stations once on initial page load
  useEffect(() => {
    const loadAllStations = async () => {
      try {
        setLoading(true);
        const stations = await getAllStations(); // Get all stations
        setAllStations(stations);
      } catch (err) {
        setError("Failed to load weather stations");
        console.error("Error loading weather stations:", err);
      } finally {
        setLoading(false);
      }
    };
    loadAllStations();
  }, []);

  // Filter stations in memory 
  const filteredStations = useMemo(() => {
    return selectedStates.length === 0
      ? []
      : allStations.filter((station) => selectedStates.includes(station.state));
  }, [allStations, selectedStates]);

  const handleStateChange = (state: string) => {
    setSelectedStates((prev) =>
      prev.includes(state) ? prev.filter((s) => s !== state) : [...prev, state]
    );
  };

  if (error) {
    return (
      <Alert sx={{ m: 2, width: "fit-content" }} severity="error">
        An error has occurred: {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ m: "auto", maxWidth: 1600 }}>
      <Typography variant="h3" sx={{ my: 4 }}>
        Weather Stations Map
      </Typography>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            p: 4,
            height: 800,
          }}
        >
          <CircularProgress sx={{ mb: 4 }} />
          Loading...
        </Box>
      ) : (
        <GoogleMaps
          weatherStations={filteredStations}
          allStations={allStations}
          availableStates={availableStates}
          selectedStates={selectedStates}
          onStateChange={handleStateChange}
        />
      )}
    </Box>
  );
};

export default Home;
