
var qtdPeople;
var boats;
var helicopters;
var safeBoat;
var searchSpeed = 10; // km/h
const peopleAngle = 100; // degrees
const peopleChangeTime = minutesToSeconds(2); // seconds

var basePoint;

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

    // obtain parameters
    spaceData.spaceX = kmToMeters(parseFloat(document.getElementById("espacoBuscaX").value));
    spaceData.spaceY = kmToMeters(parseFloat(document.getElementById("espacoBuscaY").value));
    qtdPeople = document.getElementById("people").value;

    var baseDistance = kmToMeters(parseFloat(document.getElementById("baseDistance").value));
    var baseAngle = random( 0, 360 );

    basePoint = moveTo(
        spaceData.spaceX, spaceData.spaceY,
        baseAngle,
        baseDistance
    );

    // init vehicles
    boats = initBoats( qtdPeople, 1 , shipData);
    helicopters = initVehicle( 2, "imgHelicopter", vehicleData['helicopter']['speed'], vehicleData['helicopter']['width'], vehicleData['helicopter']['length'], basePoint.x, basePoint.y );
    safeBoat    = initVehicle( 1, "imgSafeBoat", vehicleData['boat']['speed'], vehicleData['boat']['width'], vehicleData['boat']['length'], basePoint.x, basePoint.y );

    // init vehicles data
    var accPosition = basePoint;
    [].concat(helicopters,safeBoat).forEach(function(vehicle){
        vehicle.state = 'moving to critic area';
        vehicle.posX = accPosition.x;
        vehicle.posY = accPosition.y;
        accPosition = moveTo( accPosition.x, accPosition.y, baseAngle, Math.max(vehicle.width,vehicle.height) );
    });

    update(boats, [].concat(helicopters,safeBoat),shipData); // draw
}

function updateAll(){
    // helicopters[0].posX += 0.004;

    boats.forEach(function( boat ){
        if ( timestampSeconds%peopleChangeTime == 0 ){
            boat.angle = realRandom( 90-peopleAngle, 90+peopleAngle );
        }
        var newPos = moveTo(
            boat.posX, boat.posY,
            boat.angle,
            0.8 // m/s
        );
        boat.posX = newPos.x;
        boat.posY = newPos.y;
    });

    [].concat(helicopters,safeBoat).forEach(function(vehicle){
        switch (vehicle.state) {

            case 'moving to critic area':{
                vehicle.angle = angleBetween(
                    vehicle.posX, vehicle.posY,
                    spaceData.spaceX/2.0, spaceData.spaceY/2.0
                );
                var newPos = moveTo(
                    vehicle.posX, vehicle.posY,
                    vehicle.angle,
                    Math.min(
                        distanceBetween(
                            vehicle.posX, vehicle.posY,
                            spaceData.spaceX/2.0, spaceData.spaceY/2.0
                        ), kmHToMetersS( vehicle.speed )
                    )
                );
                vehicle.posX = newPos.x;
                vehicle.posY = newPos.y;
                // if arrived to initial position
                if ( vehicle.posX == spaceData.spaceX/2.0 && vehicle.posY == spaceData.spaceY/2.0 ){
                    vehicle.state = 'searching people';
                }
            } break;

            case 'searching people':{
                vehicle.state = 'moving to base';
            } break;

            case 'rescue process':{
            } break;

            case 'moving to base':{
                vehicle.angle = angleBetween(
                    vehicle.posX, vehicle.posY,
                    basePoint.x, basePoint.y
                );
                var newPos = moveTo(
                    vehicle.posX, vehicle.posY,
                    vehicle.angle,
                    Math.min(
                        distanceBetween(
                            vehicle.posX, vehicle.posY,
                            basePoint.x, basePoint.y
                        ), kmHToMetersS( vehicle.speed )
                    )
                );
                vehicle.posX = newPos.x;
                vehicle.posY = newPos.y;
                // if arrived to base
                if ( vehicle.posX == basePoint.x && vehicle.posY == basePoint.y ){
                    vehicle.state = 'stopped';
                }
            } break;
            default:
        }
    });


    update( boats, [].concat( helicopters, safeBoat ), shipData ); // draw
    //helicopters[0].posY = random(30,170);
}


function personFound(vehicleID,x,y){

}

function startShip(){
    shipData.width = shipData.image.width;
    shipData.height = shipData.image.height;
    shipData.angle = 45;
}
