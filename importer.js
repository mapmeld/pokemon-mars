const fs = require('fs');
const geojson = require('esri-to-geojson');

var ej = JSON.parse(fs.readFileSync('./page1.json', { encoding: 'utf-8' }));
var gj = geojson.fromEsri(ej);

fs.writeFile('./page1.geojson', JSON.stringify(gj), () => {});
