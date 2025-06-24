import { Box } from "@mui/material";
import { useEffect, useRef } from "react";
import { WeatherStations } from "./types";

const GoogleMaps = ({
  weatherStations,
}: {
  weatherStations: WeatherStations[];
}) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: -25.2744, lng: 133.7751 },
        zoom: 5,
      });

      // Add markers to the map
      weatherStations.forEach((station) => {
        new window.google.maps.Marker({
          position: {
            lat: Number(station.latitude),
            lng: Number(station.longitude),
          },
          map: map,
          title: station.ws_name,
        });
      });
    }
  }, [weatherStations]);

  return (
    <Box ref={mapRef} sx={{ height: 800 }}>
      {"Loading map..."}
    </Box>
  );
};

export default GoogleMaps;
