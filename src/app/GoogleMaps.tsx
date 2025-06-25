import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  CardHeader,
  Button,
  CardActions,
  Divider,
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
  const [loading, setLoading] = useState(false);
  const [selectedStation, setSelectedStation] =
    useState<WeatherStations | null>(null);

  const StationDetails = selectedStation && [
    { key: <strong>Portfolio: </strong>, value: selectedStation.portfolio },
    { key: <strong>Longitude: </strong>, value: selectedStation.longitude },
    { key: <strong>Latitude: </strong>, value: selectedStation.latitude },
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

  const subtitle = !weatherStations.length
    ? "Loading..."
    : `Showing ${weatherStations.length} weather stations`;

  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      <Box ref={mapRef} sx={{ height: 900, flex: 1, borderRadius: 1 }} />
      <Card
        sx={{
          width: 320,
          height: 500,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardHeader
          title={"Weather station details"}
          subheader={subtitle}
          avatar={<CellTower />}
          sx={{ mb: -2 }}
        />
        {loading ? (
          <CardContent sx={{ display: "flex", flexGrow: 1, height: 100 }}>
            <CircularProgress sx={{ m: "auto" }} />
          </CardContent>
        ) : (
          <CardContent sx={{ flexGrow: 1 }}>
            {selectedStation ? (
              <>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="h6">{selectedStation.site}</Typography>
                  <Typography
                    sx={{ bgcolor: "gainsboro", px: 1, ml: 1, borderRadius: 1 }}
                    variant="body2"
                  >
                    {selectedStation.state}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />
                {StationDetails?.map((details, index) => (
                  <Typography key={index} variant="body2">
                    {details.key}
                    {details.value}
                  </Typography>
                ))}
                <Divider sx={{ my: 2 }} />
                {measurements.length ? (
                  measurements.map((measurement, index) => (
                    <Box key={index}>
                      <Typography
                        sx={{ display: "flex", flexDirection: "column" }}
                        variant="body2"
                      >
                        <strong>{measurement.long_name}</strong>
                        <br />
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: 300,
                          bgcolor: "#C2FFEA",
                          px: 1,
                          my: 1,
                          borderRadius: 1,
                          width: "fit-content",
                        }}
                      >
                        {Number(measurement.value).toFixed(2)}{" "}
                        {measurement.unit}
                      </Typography>
                      <Typography
                        gutterBottom
                        color="gray"
                        sx={{ fontSize: 12 }}
                      >
                        {"Last updated: "}
                        {new Date(measurement.timestamp).toLocaleString()}
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
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button
            disabled={selectedStation && !loading ? false : true}
            onClick={() => setSelectedStation(null)}
          >
            Clear selection
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};
export default GoogleMaps;
