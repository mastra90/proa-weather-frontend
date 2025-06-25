import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  CardHeader,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { WeatherStations, Measurements } from "./types";
import { getStation } from "@/services/api";
import { CellTower, LocationOn } from "@mui/icons-material";
const GoogleMaps = ({
  weatherStations,
}: {
  weatherStations: WeatherStations[];
}) => {
  const mapRef = useRef(null);
  const [measurements, setMeasurements] = useState<Measurements[]>([]);
  const [loading] = useState(false);
  const [selectedStation, setSelectedStation] =
    useState<WeatherStations | null>(null);

  const StationDetails = selectedStation && [
    { key: "Site: ", value: selectedStation.site },
    { key: "Portfolio: ", value: selectedStation.portfolio },
    { key: "State: ", value: selectedStation.state },
    { key: "Longitude: ", value: selectedStation.longitude },
    { key: "Latitude: ", value: selectedStation.latitude },
  ];
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
        marker.addListener("click", async () => {
          setSelectedStation(station);
          try {
            setMeasurements(await getStation(station.id));
          } catch (error) {
            console.error("Error fetching measurements:", error);
            setMeasurements([]);
          }
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
        {loading ? (
          <CircularProgress />
        ) : (
          <CardContent sx={{ flexGrow: 1 }}>
            {selectedStation ? (
              <>
                {StationDetails?.map((details, index) => (
                  <Typography key={index}>
                    {details.key}
                    {details.value}
                  </Typography>
                ))}
                {measurements.length ? (
                  measurements.map((measurement, index) => (
                    <Box key={index}>
                      <Typography>
                        {measurement.variable_name}
                        {": "}
                        {measurement.value}
                        <br />
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No measurements available
                  </Typography>
                )}
              </>
            ) : (
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
            )}
          </CardContent>
        )}
      </Card>
    </Box>
  );
};
export default GoogleMaps;
