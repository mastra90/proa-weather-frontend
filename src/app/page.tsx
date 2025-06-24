"use client";

import { useState, useEffect } from "react";
import {
  Typography,
  Box,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { fetchWeatherStations, WeatherStations } from "@/services/api";

const Home = () => {
  const [weatherStations, setWeatherStations] = useState<WeatherStations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWeatherStations = async () => {
      try {
        setLoading(true);
        const stations = await fetchWeatherStations();
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

  if (loading) {
    return (
      <Box>
        <CircularProgress size={60} />
        <Typography>Loading weather stations...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert sx={{ m: 2, width: "fit-content" }} severity="error">
        An error has occured: {error ? error : "Error message not found."}
      </Alert>
    );
  }

  return (
    <Box maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3">Weather Stations Map</Typography>

      <Typography>Showing {weatherStations.length} weather stations</Typography>

      <Box>
        <Grid sx={{ maxWidth: 300 }}>
          {weatherStations.map((station) => (
            <Box key={station.id} sx={{ my: 2 }}>
              <Card>
                <CardContent>
                  Site: {station.site}
                  <br />
                  Portfolio: {station.portfolio}
                  <br />
                  State: {station.state}
                  <br />
                  Latitude: {station.latitude}
                  <br />
                  Longitude: {station.longitude}
                </CardContent>
              </Card>
            </Box>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Home;
