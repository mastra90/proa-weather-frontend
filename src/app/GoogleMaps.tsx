import { Box, Card, CardContent, Typography, CardHeader } from "@mui/material";
import { useEffect, useRef } from "react";
import { WeatherStations } from "./types";
import { CellTower, LocationOn } from "@mui/icons-material";
const GoogleMaps = ({
  weatherStations,
}: {
  weatherStations: WeatherStations[];
}) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: -28, lng: 133 },
        zoom: 5,
      });
      weatherStations.forEach((station) => {
        const marker = new window.google.maps.Marker({
          map: map,
          title: station.ws_name,
          position: {
            lat: Number(station.latitude),
            lng: Number(station.longitude),
          },
        });
      });
    }
  }, [weatherStations]);
  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      <Box ref={mapRef} sx={{ height: 900, flex: 1 }} />
      <Card
        sx={{
          width: 320,
          height: 450,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardHeader
          title={"Weather Stations"}
          subheader={"Showing X weather stations"}
          avatar={<CellTower />}
        />

        <CardContent sx={{ flexGrow: 1 }}>
          <Box
            sx={{
              display: "flex",
              height: "100%",
              p: 0,
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LocationOn sx={{ fontSize: 96, color: "silver" }} />
            <Typography sx={{ fontSize: 22, color: "silver" }}>
              No station selected
            </Typography>
            <Typography
              sx={{
                color: "silver",
                fontSize: 14,
                textAlign: "center",
                mb: 8,
              }}
            >
              Click a marker on the map for station details
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
export default GoogleMaps;
