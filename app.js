// 1. Initialize Map
const map = L.map('map').setView([7.058, 80.34], 14); 

// 2. Load OpenStreetMap Basemap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

// 3. Load your single GeoJSON file
fetch('map_data.geojson')
    .then(response => response.json())
    .then(data => {
        const myLayers = L.geoJSON(data).addTo(map);
        map.fitBounds(myLayers.getBounds());
    })
    .catch(error => console.error("Error loading GeoJSON:", error));

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