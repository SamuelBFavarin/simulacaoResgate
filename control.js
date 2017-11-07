
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

    var nHelicopters = parseInt(document.getElementById("helicopters").value);
    var nBoats       = parseInt(document.getElementById("safeBoats").value);

    // init vehicles
    boats = initBoats( qtdPeople, 1, shipData);
    helicopters = initVehicle( nHelicopters, "imgHelicopter", vehicleData['helicopter'], basePoint );
    safeBoat    = initVehicle( nBoats, "imgSafeBoat", vehicleData['boat'], basePoint );

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
                var rescueTime = 0;
                var v = toPosition( vehicle.posX, vehicle.posY, spaceData );
                boats = boats.filter(function(boat,index){
                    var b = toPosition( boat.posX, boat.posY, spaceData );
                    var distance = distanceBetween( v.x, v.y,  b.x, b.y );
                    if ( distance <= vehicle.visionRadius ){ // on vision
                        if ( realRandom(0,1) < vehicle.findProbability ){ // if seen
                            rescueTime += vehicle.rescueTime;
                            return false; // got that guy
                        }
                    }
                    return true; // keep
                });
                if ( rescueTime > 0 ){
                    vehicle.state = 'rescue process';
                    vehicle.stoppedTimer = minutesToSeconds(rescueTime);
                } else {
                    // new position
                    if ( timestampSeconds%60 == 0 ){
                        vehicle.angle = realRandom( 0, 360 );
                    }
                    var newPos = moveTo(
                        vehicle.posX, vehicle.posY,
                        vehicle.angle,
                        searchSpeed // m/s
                    );
                    vehicle.posX = newPos.x;
                    vehicle.posY = newPos.y;
                }
            } break;

            case 'rescue process':{
                vehicle.stoppedTimer -= minutesToSeconds(vehicle.rescueTime);
                if ( vehicle.stoppedTimer <= 0 ){
                    vehicle.state = 'searching people';
                }
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
