
let tripsCoordinates;
// Options for map
let options = {
  lat: 29.951065,
  lng: -90.071533,
  zoom: 12,

  // style: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
   // style: 'https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png'
  style: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'
  // style: 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'

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
  locations = loadTable('updatedData.csv', 'csv', 'header');

}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);


  // Create a tile map and overlay the canvas on top.
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);



  // Only redraw the locations when the map change and not every frame.
  myMap.onChange(drawLocations);
  for (let i = 0; i < locations.getRowCount(); i++) {
    imageArray[i] = loadImage('images/' + locations.getString(i, 'image') + '.jpeg');

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
  // Clear the canvas
  clear();

  //parse through the meteorites csv file
  for (let i = 0; i < locations.getRowCount(); i++) {
    // Get the lat/lng of each meteorite
    const latitude = Number(locations.getString(i, 'latitude'));
    const longitude = Number(locations.getString(i, 'longitude'));
    const place = String(locations.getString(i,'location'));
    const hours = String(locations.getString(i, 'active hours'))
    const date = String(locations.getString(i, 'date'))
    const steps = String(locations.getString(i, 'steps'))


    //Only draw them if the position is inside the current map bounds. We use a
    //Leaflet method to check if the lat and lng are contain inside the current
    //map. This way we draw just what we are going to see and not everything. See
    //getBounds() in http://leafletjs.com/reference-1.1.0.html
    if (myMap.map.getBounds().contains({lat: latitude, lng: longitude})) {
      // Transform lat/lng to pixel position
      const pos = myMap.latLngToPixel(latitude, longitude);
      locationsArray.push(new Locations(pos.x, pos.y, place, imageArray[i], date, hours, steps))

    }
  }
  //load all the locationsArray objects and call the show function
//we can call the show function here b/c the dots are static
  for(let i = 0; i < locationsArray.length; i++){
    locationsArray[i].show();
  }
}

class Locations {

  constructor(long, lat, place, image, hours, date, steps){
    this.long = long;
    this.lat = lat;
    this.place = place;
    this.image = image;
    this.hours = hours
    this.date = date
    this.steps = steps


  }

  show(){



      fill(204, 2, 245)
      textSize(50)
      textAlign(CENTER)
      textFont('Georgia')
      text('[MAP LIFE]', 730, 60)
      fill(170, 255, 0)
      ellipse(this.long, this.lat, 10, 10);

      fill(235, 115, 2)
      textSize(30)
      text('*map content*', 200,30)
      fill(7, 89, 232)
      textSize(20)
      text('-photo location', 200, 60)
      text('-active walking hours', 200, 90)
      text('-date', 200, 110)
      text('-how many steps i walked', 200, 140)
      text('-photo of the day', 200, 170)
      textFont('Georgia')
      textAlign(CENTER)




      //image(this.image,this.long+150, this.lat, 200, 400)

  }

  hover(){

      if(dist(mouseX, mouseY, this.long, this.lat) < 5){
        fill(0)
        ellipse(this.long, this.lat+40, 180, 180)

        fill(255)
        textSize(15)
        textFont('Georgia')
        textAlign(CENTER)
        text(this.place, this.long, this.lat+20);
        text(this.date, this.long, this.lat+40)
        text(this.hours, this.long, this.lat+60)
        text(this.steps, this.long, this.lat+80)
        image(this.image, this.long+200, this.lat-100, 200, 350)




    }
  }
}
