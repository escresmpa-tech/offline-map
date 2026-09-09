// 1. Initialize Map
const map = L.map('map').setView([0, 0], 2); 

// 2. Load OpenStreetMap Basemap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

// 3. List all your exported files exactly as named
const spatialFiles = [
    'AMSL_115.json', 
    'AMSL_125.json', 
    'C_TINN_BNDY.json', 
    'Camp_sites.json',
    'Contour.json', 
    'DAM.json', 
    'Diversion_canal.json', 
    'Excavation area.json',
    'Existing_Buildings.json', 
    'Irrigation_outlet.json', 
    'New_access.json',
    'Power_house.json', 
    'PS.json', 
    'Road.geojson', 
    'Saddle_dam.json', 
    'Wee_Oya.json'
];

// A palette of distinct colors for the 16 different layers
const layerColors = [
    '#e6194b', '#3cb44b', '#ffe119', '#4363d8', 
    '#f58231', '#911eb4', '#46f0f0', '#f032e6', 
    '#bcf60c', '#fabebe', '#008080', '#e6beff', 
    '#9a6324', '#fffac8', '#800000', '#aaffc3'
];

// Load all files simultaneously
Promise.all(spatialFiles.map(file => fetch(file).then(res => res.json())))
    .then(datasets => {
        const allLayersGroup = L.featureGroup(); // Group them to calculate the final bounding box
        
        datasets.forEach((data, index) => {
            L.geoJSON(data, {
                style: { color: layerColors[index], weight: 2, fillOpacity: 0.4 }
            }).addTo(allLayersGroup);
        });
        
        allLayersGroup.addTo(map);
        map.fitBounds(allLayersGroup.getBounds()); // Auto-zoom to fit the entire project
    })
    .catch(error => console.error("Error loading spatial files:", error));

// 4. GPS Tracking
const userMarker = L.circleMarker([0, 0], { color: 'red', radius: 8, fillOpacity: 1 }).addTo(map);

if ('geolocation' in navigator) {
    navigator.geolocation.watchPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            userMarker.setLatLng([lat, lng]);
        },
        (error) => console.error("GPS Error:", error),
        { enableHighAccuracy: true }
    );
}

// 5. Register Service Worker for Offline Mode
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker Registered'))
            .catch(err => console.error('Service Worker Error:', err));
    });
}
