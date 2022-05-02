

// Options for map
let options = {
  lat: 29.951065,
  lng: -90.071533,
  zoom: 15,

  style: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
   //style: 'https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png'
  //style: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'
   //style: 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
}

// Create an instance of Leaflet
let mappa = new Mappa('Leaflet');
let myMap;

let canvas;
let locations;

let imageArray = [];

let locationsArray = [];


function preload(){
  // Load the data
  locations = loadTable('cityLocation.csv', 'csv', 'header');

}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  imageMode(CENTER)
  // Create a tile map and overlay the canvas on top.
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);



  // Only redraw the meteorites when the map change and not every frame.
  myMap.onChange(drawLocations);

  for (let i = 0; i < locations.getRowCount(); i++) {
    imageArray[i] = loadImage('Images/' + locations.getString(i, 'image') + '.JPG');

  }

}

// The draw loop is fully functional but we are not using it for now.
function draw() {
  //only call the drawLocations function in draw if
    //the locationsArray length containes objects (greater than 0)
    //we need to add this in order to clear the hover function text
    if(locationsArray.length > 0){
      drawLocations();
    }

    //load all the locationsArray objects and call the hover function
    //we need to call the hover function in draw b/c it's not static
    for(let i = 0; i < locationsArray.length; i++){
      locationsArray[i].hover();
    }
}

function drawLocations() {
  //clear the array when resized so that the points get repositioned
  //relative to the map size
  locationsArray.splice(0,locationsArray.length);
  //imageArray.splice(0,imageArray.length);
  // Clear the canvas
  clear();

  //parse through the meteorites csv file
  for (let i = 0; i < locations.getRowCount(); i++) {
    // Get the lat/lng of each meteorite
    const latitude = Number(locations.getString(i, 'latitude'));
    const longitude = Number(locations.getString(i, 'longitude'));
    const cityName = String(locations.getString(i,'name'));
    //imageArray[i] = loadImage('Images/' + locations.getString(i, 'image') + '.JPG');

    //Only draw them if the position is inside the current map bounds. We use a
    //Leaflet method to check if the lat and lng are contain inside the current
    //map. This way we draw just what we are going to see and not everything. See
    //getBounds() in http://leafletjs.com/reference-1.1.0.html
    if (myMap.map.getBounds().contains({lat: latitude, lng: longitude})) {

      // Transform lat/lng to pixel position
      const pos = myMap.latLngToPixel(latitude, longitude);
      locationsArray.push(new Locations(pos.x, pos.y, cityName, imageArray[i]))
    }
  }
  //load all the locationsArray objects and call the show function
//we can call the show function here b/c the dots are static
  for(let i = 0; i < locationsArray.length; i++){
    locationsArray[i].show();
  }
}

class Locations {

  constructor(long, lat, city, image){
    this.long = long;
    this.lat = lat;
    this.city = city;
    this.image = image;
  }

  show(){
     ellipse(this.long, this.lat, 10, 10);
      //image(this.image, this.long, this.lat, 10, 20)
      //L.marker([this.long, this.lat]).bindPopup('This is Littleton, CO.')
  }

  hover(){
    if(dist(mouseX, mouseY, this.long, this.lat) < 5){
    fill(0);
    text(this.city, this.long, this.lat+20);
    image(this.image, this.long+150, this.lat, 200, 400)
  }
  }
}
