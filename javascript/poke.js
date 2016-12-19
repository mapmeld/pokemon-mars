if (typeof console === 'undefined') {
  console = {
    log: function() { },
    warn: function() { },
    error: function() { }
  };
}

var pois = [];
var finishedFeatures = false;
var geolocated = null;
var planet;

// create the Leaflet map
var map = L.map('map')
  .setView([0, 0], 7);
map.attributionControl.setPrefix('');

// add the MapBox Mars Terrain tiles
L.tileLayer('//{s}.tiles.mapbox.com/v4/matt.72ca085f/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZ2VvcmVhY3RvciIsImEiOiJjaXU2NG14b3UwZmRhMm9wZ3hqMWtiaGpwIn0.b4vjSMyQlwcEK9dFR86tWA', {
  attribution: 'Map tiles &copy; MapBox, data via NASA',
  maxZoom: 14
}).addTo(map);

// LGPL via http://www.geodatasource.com/developers/javascript
// returns Earth KM
function earthDistance(lat1, lon1, lat2, lon2) {
  var radlat1 = Math.PI * lat1/180
  var radlat2 = Math.PI * lat2/180
  var theta = lon1-lon2
  var radtheta = Math.PI * theta/180
  var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist)
  dist = dist * 180/Math.PI
  dist = dist * 60 * 1.1515
  return dist * 1.609344;
}

// returns Mars KM
function marsDistance(lat1, lon1, lat2, lon2) {
  return earthDistance(lat1, lon1, lat2, lon2) / 1.8774787;
}

// figure out closest POI, once both geolocation and points are loaded
function mapNearest() {
  var nearest = 50000;
  var found = null;
  for (var p = 0; p < pois.length; p++) {
    var poi = pois[p];
    var dist = marsDistance(poi.lat, poi.lng, geolocated[0], geolocated[1]);
    if (dist < nearest) {
      nearest = dist;
      found = poi;
    }
  }
  if (found) {
    nearest = Math.round(10 * nearest) / 10;
    if (planet === 'mars') {
      alert('Nearest point is ' + nearest + ' km away - ' + poi.name);
    } else if (planet === 'earth') {
      var ekm = earthDistance(found.lat, found.lng, geolocated[0], geolocated[1]);
      ekm = Math.round(10 * ekm) / 10;
      alert('Nearest point is ' + nearest + ' km away (' + ekm + ' for Earth testers) - ' + poi.name);    
    }
  }
}

// 'geolocate' me on the Mars map
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    // put a marker at my current location
    geolocated = [position.coords.latitude, position.coords.longitude];
    L.circleMarker(geolocated, {
      color: '#f00',
      fillColor: '#f00',
      strokeColor: '#f00'
    }).addTo(map);
    map.setView([position.coords.latitude, position.coords.longitude], 8);
    
    // use HTML# geolocation API
    planet = (position.planet || 'earth');
    if (planet !== 'mars' && planet !== 'earth') {
      console.error('You are not on Earth or Mars, so we can\'t estimate distances.');
    }
    if (planet === 'earth') {
      // fallback planet
      console.warn('You are on Earth, not Mars.');
    }
    
    // if I already added all of the points, check them now
    if (finishedFeatures) {
      mapNearest();
    }
  });
} else {
  console.log('no geolocation');
}

// AJAX call to bring in the GeoJSON points -  uses Fetch API or GitHub's polyfill
// This exists as TopoJSON, but then I need to bring in the TopoJSON library, too
fetch('data/combined.geojson')
  .then(function(response) {
    
    return response.json();
  }).then(function(json) {
    for (var f = 0; f < json.features.length; f++) {
      var feature = json.features[f];
      var lat = feature.geometry.coordinates[1];
      var lng = feature.geometry.coordinates[0];
      var poi = {
        lat: lat,
        lng: lng,
        name: feature.properties.clean_name
      };
      L.circleMarker([lat, lng]).addTo(map).bindPopup(poi.name);
      pois.push(poi);
    }
    finishedFeatures = true;
    
    // if I already 'geolocated' the user, make the distance calculation now
    if (geolocated) {
      mapNearest();
    }
  });
