const fs = require('fs');
const https = require('https');
const path = require('path');

const BBOX = '12.8340,77.4601,13.1436,77.7840';
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

const queries = {
  metro_stations: `[out:json];node["railway"="station"]["station"="subway"](${BBOX});out;`,
  hospitals: `[out:json];node["amenity"="hospital"](${BBOX});out;`,
  substations: `[out:json];node["power"="substation"](${BBOX});out;`,
  lakes: `[out:json];way["water"="lake"](${BBOX});out center;` // using center for ways to get a single point
};

const outputDir = path.join(__dirname, '../apps/web/public/data');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

function fetchOverpass(name, query) {
  return new Promise((resolve, reject) => {
    console.log(`Fetching ${name}...`);
    const req = https.request(OVERPASS_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'BhavoraApp/1.0 (karan@bhavora.com)'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200) {
           return reject(new Error(`Overpass API error: ${res.statusCode} ${data}`));
        }
        try {
          const json = JSON.parse(data);
          const geojson = {
            type: "FeatureCollection",
            features: json.elements.map(el => {
              const lat = el.lat || el.center.lat;
              const lon = el.lon || el.center.lon;
              return {
                type: "Feature",
                geometry: { type: "Point", coordinates: [lon, lat] },
                properties: el.tags || {}
              };
            })
          };
          fs.writeFileSync(path.join(outputDir, `${name}.geojson`), JSON.stringify(geojson, null, 2));
          console.log(`Saved ${name}.geojson (${geojson.features.length} features)`);
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(`data=${encodeURIComponent(query)}`);
    req.end();
  });
}

async function run() {
  try {
    for (const [name, query] of Object.entries(queries)) {
      await fetchOverpass(name, query);
      // Wait 2 seconds to avoid Overpass rate limits
      await new Promise(r => setTimeout(r, 2000));
    }
    console.log('All GIS data fetched successfully!');
  } catch(e) {
    console.error('Error fetching data:', e);
  }
}

run();
