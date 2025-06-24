import { Box } from "@mui/material";
import { useEffect, useRef } from "react";

const GoogleMaps = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) {
      new window.google.maps.Map(mapRef.current, {
        center: { lat: -25.2744, lng: 133.7751 },
        zoom: 5,
      });
    }
  }, []);

  return (
    <Box ref={mapRef} sx={{ height: 800 }}>
      {"Loading map..."}
    </Box>
  );
};

export default GoogleMaps;
