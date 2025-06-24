//global type for google maps
declare global {
  interface Window {
    google: {
      maps: {
        Map: new (element: HTMLElement, options: {
          center: { lat: number; lng: number };
          zoom: number;
        }) => any;
        Marker: new (options: {
          position: { lat: number; lng: number };
          map: any;
          title: string;
        }) => any;
      };
    };
  }
}

export type WeatherStations = {
  id: number;
  ws_name: string;
  site: string;
  portfolio: string;
  state: string;
  latitude: number;
  longitude: number;
};

export type Measurements = {
  measurement_id: number;
  station_id: number;
  variable_name: string;
  value: number;
  timestamp: Date;
};

export type Variables = {
  var_id: number;
  id: number;
  name: string;
  unit: string;
  long_name: string;
};
