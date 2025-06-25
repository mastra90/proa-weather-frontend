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
  FormControlLabel,
  Checkbox,
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { WeatherStations, Measurements } from "./types";
import { getStation } from "@/services/api";
import { CellTower, LocationOn, MoreVert } from "@mui/icons-material";

const GoogleMaps = ({
  weatherStations,
  allStations,
  availableStates,
  selectedStates,
  onStateChange,
}: {
  weatherStations: WeatherStations[];
  allStations: WeatherStations[];
  availableStates: string[];
  selectedStates: string[];
  onStateChange: (state: string) => void;
}) => {
  const mapRef = useRef(null);
  const [measurements, setMeasurements] = useState<Measurements[]>([]);
  const [loading] = useState(false);
  const [selectedStation, setSelectedStation] =
    useState<WeatherStations | null>(null);
  const [filterMenu, setFilterMenu] = useState<null | HTMLElement>(null);

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

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        height: "100%",
        maxHeight: 900,
        maxWidth: 1600,
        m: "auto",
      }}
    >
      {/* Weather station details card */}
      <Card
        sx={{
          flex: 1,
          minWidth: 300,
          maxWidth: 350,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Card Header (with filter button) */}
        <CardHeader
          title={"Weather station details"}
          subheader={`Showing ${weatherStations.length} weather stations`}
          avatar={<CellTower />}
          action={
            // Filter button
            <Tooltip title={"Filter by state"}>
              <IconButton onClick={(e) => setFilterMenu(e.currentTarget)}>
                <MoreVert />
              </IconButton>
            </Tooltip>
          }
          sx={{ mb: -2 }}
        />
        {/* Filter Menu */}
        <Menu
          anchorEl={filterMenu}
          open={Boolean(filterMenu)}
          onClose={() => setFilterMenu(null)}
        >
          <Typography sx={{ mx: 2, my: 1, fontWeight: 500 }}>
            Filter by state:
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {availableStates.map((state) => {
              const stateCount = allStations.filter(
                (station) => station.state === state
              ).length;
              return (
                <MenuItem key={state}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedStates.includes(state)}
                        onChange={() => onStateChange(state)}
                        size="small"
                      />
                    }
                    label={`${state} (${stateCount})`}
                  />
                </MenuItem>
              );
            })}
          </Box>
        </Menu>
        {/* Card content */}
        {loading ? (
          <CardContent sx={{ display: "flex", flexGrow: 1, height: 100 }}>
            <CircularProgress sx={{ m: "auto" }} />
          </CardContent>
        ) : (
          <CardContent sx={{ flexGrow: 1 }}>
            {selectedStation ? (
              <>
                {/* Weather station name */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="h6">{selectedStation.site}</Typography>
                  <Tooltip title="State">
                    <Typography
                      sx={{
                        bgcolor: "gainsboro",
                        px: 1,
                        ml: 1,
                        borderRadius: 1,
                      }}
                      variant="body2"
                    >
                      {selectedStation.state}
                    </Typography>
                  </Tooltip>
                </Box>

                <Divider sx={{ my: 2 }} />
                {/* Weather station details */}
                {StationDetails?.map((details, index) => (
                  <Typography key={index} variant="body2">
                    {details.key}
                    {details.value}
                  </Typography>
                ))}
                <Divider sx={{ my: 2 }} />
                {/* Weather station measurements */}
                {!measurements.length || loading ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Typography gutterBottom color="gray">
                      Loading...
                    </Typography>
                    <CircularProgress />
                  </Box>
                ) : (
                  measurements.map((measurement, index) => (
                    <Box key={index}>
                      <Typography
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          fontWeight: 600,
                        }}
                        variant="body2"
                      >
                        {measurement.long_name}
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
                        sx={{ fontSize: 12, mb: 2 }}
                      >
                        {"Last updated: "}
                        {new Date(measurement.timestamp).toLocaleString()}
                      </Typography>
                    </Box>
                  ))
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
      {/*Google Maps component */}
      <Box ref={mapRef} sx={{ flex: 3, borderRadius: 1 }} />
    </Box>
  );
};
export default GoogleMaps;
