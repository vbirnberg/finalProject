

// Options for map
let options = {
  lat: 41.8781,
  lng: -87.6298,
  zoom: 12,
  //style: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
   // style: 'https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png'
  // style: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'

   style: 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
}

// Create an instance of Leaflet
let mappa = new Mappa('Leaflet');
let myMap;

let canvas;

let cityLocations;


function preload(){
  // Load the data
cityLocations = loadTable('mydataCollection.csv', 'csv', 'header');
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);

  // Create a tile map and overlay the canvas on top.
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);


  // Only redraw the locations when the map change and not every frame.
  myMap.onChange(drawCities);

  fill(70, 203,31);
  stroke(100);
}

// The draw loop is fully functional but we are not using it for now.
function draw() {

  const pos = myMap.latLngToPixel(29.951065, -90.071533);

  //draw an ellipse on New Orleans
  ellipse(pos.x, pos.y, 10, 10);
}

function drawCities() {
  // Clear the canvas
  clear();

  //parse through the mydataCollection csv file
  for (let i = 0; i < cityLocations.getRowCount(); i++) {
    // Get the lat/lng of each location
    const latitude = Number(cityLocations.getString(i, 'latitude'));
    const longitude = Number(cityLocations.getString(i, 'longitude'));
    print(latitude)

    //Only draw them if the position is inside the current map bounds. We use a
    //Leaflet method to check if the lat and lng are contain inside the current
    //map. This way we draw just what we are going to see and not everything. See
    //getBounds() in http://leafletjs.com/reference-1.1.0.html
    if (myMap.map.getBounds().contains({lat: latitude, lng: longitude})) {
      // Transform lat/lng to pixel position
      const pos = myMap.latLngToPixel(latitude, longitude);
  
      ellipse(pos.x, pos.y, size, size);
    }
  }
}
