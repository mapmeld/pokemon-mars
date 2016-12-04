const fs = require('fs');
const geojson = require('esri-to-geojson');

var ej = JSON.parse(fs.readFileSync('./page1.json', { encoding: 'utf-8' }));
var ej2 = JSON.parse(fs.readFileSync('./page2.json', { encoding: 'utf-8' }));
ej.features = ej.features.concat(ej2.features);

var gj = geojson.fromEsri(ej);

fs.writeFile('./combined.geojson', JSON.stringify(gj), () => {});
