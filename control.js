
var qtdPeople;
var boats;
var helicopters;
var safeBoat;
var searchSpeed = 10; // km/h
const peopleAngle = 100; // degrees
const peopleChangeTime = minutesToSeconds(2); // seconds

// afundamento navio
var opacity;
var velocidadeAfundamento = 0.001;

var basePoint;
var algorithm;

var vehicleData;

var spaceData = {
    spaceX: 0, spaceY: 0,
    realX: 500.0, realY: 500.0
};

var shipData = {
    image: document.getElementById("imgShip"),
    width: 0,
    height: 0,
    angle: 0,
    opacity: 1
};

var peopleSave;
var survivalTime;
var detouMaxTime;


$.getJSON('vehicleData.json', function(data){
    vehicleData = data;
});

// instancia dados da simulação
function startSimulation() {
    opacity = 1;
    peopleSave = 0;
    alterStatus('Buscando Sobreviventes','green');
    clearSimulation();
    startShip(opacity);

    // obtain parameters
    spaceData.spaceX = kmToMeters(parseFloat(document.getElementById("espacoBuscaX").value));
    spaceData.spaceY = kmToMeters(parseFloat(document.getElementById("espacoBuscaY").value));
    qtdPeople = document.getElementById("people").value;
    survivalTime = document.getElementById("time").value;
    detouMaxTime = document.getElementById("time2").value;
    algorithm = eval( document.getElementById("selectOfAlgorithms").value );

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
    boats = initBoats( qtdPeople, 1, shipData , survivalTime, detouMaxTime);
    helicopters = initVehicle( nHelicopters, "imgHelicopter", vehicleData['helicopter'], basePoint );
    safeBoat    = initVehicle( nBoats, "imgSafeBoat", vehicleData['boat'], basePoint );

    console.log(boats);

    // init vehicles data
    var accPosition = basePoint;
    [].concat(helicopters,safeBoat).forEach(function(vehicle){
        vehicle.state = 'moving to critic area';
        vehicle.timeMoving = 0;
        vehicle.peopleCount = 0;
        vehicle.posX = accPosition.x;
        vehicle.posY = accPosition.y;
        accPosition = moveTo( accPosition.x, accPosition.y, baseAngle, Math.max(vehicle.width,vehicle.height) );
    });

    update(boats, [].concat(helicopters,safeBoat),shipData); // draw
}


function moveVehicle( vehicle, speed, posX, posY ){
    vehicle.angle = angleBetween(
        vehicle.posX, vehicle.posY,
        posX, posY
    );
    var newPos = moveTo(
        vehicle.posX, vehicle.posY,
        vehicle.angle,
        Math.min(
            distanceBetween(
                vehicle.posX, vehicle.posY,
                posX, posY
            ), speed
        )
    );
    vehicle.posX = newPos.x;
    vehicle.posY = newPos.y;
}

function updateBoat( boat ){
    if ( timestampSeconds%peopleChangeTime === 0 ){
        boat.angle = realRandom( 90-peopleAngle, 90+peopleAngle );
    }
    var newPos = moveTo(
        boat.posX, boat.posY,
        boat.angle,
        0.4 // 0.8 // m/s
    );
    boat.posX = newPos.x;
    boat.posY = newPos.y;
}

function updateAll(){
    // helicopters[0].posX += 0.004;

    boats.forEach( (boat) => { updateBoat(boat) } );

    [].concat(helicopters,safeBoat).forEach(function(vehicle){
        var distanceToBase = distanceBetween( vehicle.posX, vehicle.posY,  basePoint.x, basePoint.y );
        var timeUntilBase = distanceToBase / kmHToMetersS( vehicle.speed );

        if ( vehicle.state != 'moving to base' && timeUntilBase >= minutesToSeconds( vehicle.autonomy ) -vehicle.timeMoving ){
            vehicle.state = 'moving to base';
            if ( vehicle.goingFor !== undefined ){
                boats.push( vehicle.goingFor );
                vehicle.goingFor = undefined;
            }
        }

        ++vehicle.timeMoving;

        switch (vehicle.state) {
            case 'moving to critic area':{
                moveVehicle( vehicle, kmHToMetersS( vehicle.speed ), spaceData.spaceX/2.0, spaceData.spaceY/2.0 );
                // if arrived to initial position
                if ( vehicle.posX == spaceData.spaceX/2.0 && vehicle.posY == spaceData.spaceY/2.0 ){
                    vehicle.state = 'searching people';
                }
            } break;

            case 'searching people':{

                // get the closer seen guy
                var person = undefined;
                var closerDistance;
                for (var i = 0; i < boats.length; ++i){
                    var boat = boats[i];
                    var distance = distanceBetween( vehicle.posX, vehicle.posY,  boat.posX, boat.posY );
                    if ( distance <= vehicle.visionRadius ){
                        if ( realRandom(0,1) < vehicle.findProbability ){ // if seen
                            if ( person === undefined || distance < closerDistance ){
                                person = i;
                                closerDistance = distance;
                            }
                        }
                    }
                }
                if ( person === undefined ){
                    algorithm.searchMove(vehicle);
                } else {
                    vehicle.goingFor = boats[person];
                    boats.splice( person, 1 );
                    vehicle.state = 'reaching person';
                }
            } break;

            case 'reaching person':{
                var boat = vehicle.goingFor;
                updateBoat(boat);
                moveVehicle( vehicle, kmHToMetersS( searchSpeed ), boat.posX, boat.posY );
                // if arrived to boat
                if ( vehicle.posX === boat.posX && vehicle.posY === boat.posY ){
                    vehicle.state = 'rescue process';
                    vehicle.stoppedTimer = minutesToSeconds(vehicle.rescueTime);
                }
            } break;

            case 'rescue process':{
                vehicle.stoppedTimer -= 1;
                if ( vehicle.stoppedTimer <= 0 ){
                    vehicle.goingFor = undefined;
                    ++vehicle.peopleCount;
                    if ( vehicle.peopleCount == vehicle.capacity ){
                        vehicle.state = 'moving to base';
                    } else {
                        vehicle.state = 'searching people';
                    }
                }
            } break;

            case 'moving to base':{
                moveVehicle( vehicle, kmHToMetersS( vehicle.speed ), basePoint.x, basePoint.y );
                // if arrived to base
                if ( vehicle.posX === basePoint.x && vehicle.posY === basePoint.y ){
                    vehicle.state = 'stopped';
                }
            } break;

            case 'stopped':{
                // what?
                vehicle.timeMoving = 0;
                vehicle.peopleCount = 0;
            } break;
            default:
        }
    });

    opacity = opacity - velocidadeAfundamento;
    if(opacity >=0){
        startShip(opacity);
    }

    // contagem de pessoas salvas
    var p = countPeopleSave();
    if(p === qtdPeople){
        alterStatus('Resgate Completado', 'green')
    }
    // verificação de mortos
    die(timestampSeconds);

    update( boats, [].concat( helicopters, safeBoat ), shipData ); // draw
}

function personFound(vehicleID,x,y){

}

function startShip(opacity){
    shipData.width = shipData.image.width;
    shipData.height = shipData.image.height;
    shipData.angle = 45;
    shipData.opacity = opacity;
}

function countPeopleSave() {
    var lives =0;
    var die = 0;
    for(var i=0; i< boats.length; i++){
        if(boats[i].status === 'vivo') lives = lives+1;
        if(boats[i].status === 'morto') die = die+1;
        
    }
    peopleSave = qtdPeople - boats.length;
    document.getElementById('peopleSave').innerHTML = peopleSave;
    document.getElementById('peopleDie').innerHTML = die;
    document.getElementById('peopleLive').innerHTML = lives;
    return peopleSave;
}

function die(seconds) {
    for(var i=0; i<boats.length; i++) {
        if (minutesToSeconds(boats[i].surviveTime) < seconds) {
            boats[i].status = 'morto';
        }
    }
}

function alterStatus(status,color){
    document.getElementById('status').innerHTML = status;
    document.getElementById('status').style.color = color;
}




