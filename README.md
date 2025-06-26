# Weather Stations Map

### Interactive map displaying Australian weather stations with most recent measurement data.

## Tech Stack

**Frontend**: Next.js 15, React 19, Material-UI, TypeScript, Axios Google Maps API <br>
**API**: NestJS, TypeORM <br>
**DB**: PostgreSQL 

## Project Overview

1. **Data Storage**: Weather stations, variables, and measurements stored in PostgreSQL.
2. **API Layer**: NestJS exposes REST endpoints for stations and measurements.
3. **Map Display**: Google Maps renders station markers from long/lat data stored in db.
4. **Interactions**: Click markers to fetch and display latest measurements in the card on the left of the map.

## Key Features

1. Interactive Google Maps with weather station markers.
2. State-based filtering: (VIC, NSW, QLD, SA) States that did not have weather stations were not included.
3. Station details card dynamically renders a weather station's data and its most recent measurements.
4. Measurements are displayed along with the time and date of the latest measurement.
5. MUI used for styling. When no marker is selected a component renders which instructs the user to click a marker.
6. A loading wheel displays when data is loading.
7. Implemented error handling for when data cannot be fetched or if other errors occur.


## API Endpoints

1. `GET /weather-stations` - Get all weather stations with optional state filter.
2. `GET /weather-stations/:id/latest` - Get latest measurements for weather station data.
3. `GET /weather-stations/variables` - Get measurement types for each weather station id.