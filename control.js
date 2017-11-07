
var qtdPeople;
var boats;
var helicopters;
var safeBoat;
var searchSpeed = 10; // km/h
const peopleAngle = 100; // degrees
const peopleChangeTime = minutesToSeconds(2); // seconds

var vehicleData;

var spaceData = {
    spaceX: 0, spaceY: 0,
    realX: 500.0, realY: 500.0
};

var shipData = {
    image: document.getElementById("imgShip"),
    width: 0,
    height: 0,
    angle: 0
}


$.getJSON('vehicleData.json', function(data){
    vehicleData = data;
});

// instancia dados da simulação
function startSimulation() {
    clearSimulation();
    startShip();

    spaceData.spaceX = kmToMeters(parseFloat(document.getElementById("espacoBuscaX").value));
    spaceData.spaceY = kmToMeters(parseFloat(document.getElementById("espacoBuscaY").value));
    qtdPeople = document.getElementById("people").value;

    boats = initBoats( qtdPeople, 1 , shipData);
    helicopters = initVehicle( 1,   "imgHelicopter", vehicleData['helicopter']['speed'], vehicleData['helicopter']['width'], vehicleData['helicopter']['length'], 250,250 );
    safeBoat    = initVehicle( 1,   "imgSafeBoat", vehicleData['boat']['speed'], vehicleData['boat']['width'], vehicleData['boat']['length'], 260,250 );
    //console.log(vehicleData['helicopter']['speed']);
    //console.log([].concat(helicopters,safeBoat));
    update(boats, [].concat(helicopters,safeBoat),shipData);
}

function updateAll(){
    // helicopters[0].posX += 0.004;

    boats.forEach(function( boat ){
        if ( timestampSeconds%peopleChangeTime == 0 ){
            boat.angle = realRandom( 90-peopleAngle, 90+peopleAngle );
        }
        let newPos = moveTo(
            boat.posX, boat.posY,
            boat.angle,
            0.8 // m/s
        );
        boat.posX = newPos.x;
        boat.posY = newPos.y;
    });
    update( boats, [].concat( helicopters, safeBoat ) ,shipData); // draw
    //helicopters[0].posY = random(30,170);
}


function personFound(vehicleID,x,y){

}

function startShip(){
    shipData.width = shipData.image.width;
    shipData.height = shipData.image.height;
    shipData.angle = 180;
}
