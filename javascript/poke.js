// create the Leaflet map
var map = L.map('map')
  .setView([0, 0], 7);
map.attributionControl.setPrefix('');

// add the MapBox Mars Terrain tiles
L.tileLayer('//{s}.tiles.mapbox.com/v4/matt.72ca085f/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZ2VvcmVhY3RvciIsImEiOiJjaXU2NG14b3UwZmRhMm9wZ3hqMWtiaGpwIn0.b4vjSMyQlwcEK9dFR86tWA', {
  attribution: 'Map tiles &copy; MapBox, data via NASA',
  maxZoom: 14
}).addTo(map);

// 'geolocate' me
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    L.circleMarker([position.coords.latitude, position.coords.longitude], {
      color: '#f00',
      fillColor: '#f00',
      strokeColor: '#f00'
    }).addTo(map);
    map.setView([position.coords.latitude, position.coords.longitude], 8);
  });
} else {
  console.log('no geolocation');
}

fetch('data/combined.geojson')
  .then(function(response) {
    return response.json();
  }).then(function(json) {
    for (var f = 0; f < json.features.length; f++) {
      var feature = json.features[f];
      var lat = feature.geometry.coordinates[1];
      var lng = feature.geometry.coordinates[0];
      L.circleMarker([lat, lng]).addTo(map).bindPopup(feature.properties.clean_name);
    }
  });
