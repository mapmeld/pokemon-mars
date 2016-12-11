// create the Leaflet map
var map = L.map('map')
  .setView([0, 0], 7);

// add the MapBox Mars Terrain tiles
L.tileLayer('//{s}.tiles.mapbox.com/v4/matt.72ca085f/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZ2VvcmVhY3RvciIsImEiOiJjaXU2NG14b3UwZmRhMm9wZ3hqMWtiaGpwIn0.b4vjSMyQlwcEK9dFR86tWA', {
  attribution: 'Map tiles &copy; MapBox, data via NASA',
  maxZoom: 14
}).addTo(map);

map.attributionControl.setPrefix('');
