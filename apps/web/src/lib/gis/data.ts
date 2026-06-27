/* eslint-disable @typescript-eslint/no-explicit-any */
export const BENGALURU_METRO_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { line: 'Purple' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [77.4988, 12.9279], // Kengeri
          [77.5367, 12.9555], // Nayandahalli
          [77.5753, 12.9756], // Majestic
          [77.6389, 12.9782], // Indiranagar
          [77.7281, 12.9839], // Whitefield
        ]
      }
    },
    {
      type: 'Feature',
      properties: { line: 'Green' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [77.5029, 13.0456], // Nagasandra
          [77.5510, 13.0084], // Yeshwanthpur
          [77.5753, 12.9756], // Majestic
          [77.5815, 12.9288], // Jayanagar
          [77.5750, 12.9069], // Yelachenahalli
        ]
      }
    }
  ]
} as any;
