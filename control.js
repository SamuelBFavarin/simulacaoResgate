
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

var preparationTeamTime;

var resgatPeopleLife = 0;
var resgatPeopleDie = 0;
var disappearedPeople = 0;


$.getJSON('vehicleData.json', function(data){
    vehicleData = data;
});

// instancia dados da simulação
function startSimulation() {
    opacity = 0.5;
    peopleSave = 0;
    alterStatus('Em preparação','green');
    clearSimulation();
    startShip(opacity);

    // obtain parameters
    spaceData.spaceX = kmToMeters(parseFloat(document.getElementById("espacoBuscaX").value));
    spaceData.spaceY = kmToMeters(parseFloat(document.getElementById("espacoBuscaY").value));
    qtdPeople = document.getElementById("people").value;
    survivalTime = document.getElementById("time").value;
    detouMaxTime = document.getElementById("time2").value;
    preparationTeamTime = parseFloat(document.getElementById("preparationTime").value);
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


    // init vehicles data
    var accPosition = basePoint;
    [].concat(helicopters,safeBoat).forEach(function(vehicle){
        vehicle.state = 'stopped';
        vehicle.posX = accPosition.x;
        vehicle.posY = accPosition.y;
        vehicle.preparationTime = minutesToSeconds(preparationTeamTime);
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

    // teste já terminou o tempo de preparação da equipe
    // se terminou, começam a fazer a busca
    [].concat(helicopters, safeBoat).forEach(function (vehicle) {

        var distanceToBase = distanceBetween(vehicle.posX, vehicle.posY, basePoint.x, basePoint.y);
        var timeUntilBase = distanceToBase / kmHToMetersS(vehicle.speed);

        if (vehicle.state != 'moving to base' && timeUntilBase >= minutesToSeconds(vehicle.autonomy) - vehicle.timeMoving) {
            vehicle.state = 'moving to base';
            if (vehicle.goingFor !== undefined) {
                boats.push(vehicle.goingFor);
                vehicle.goingFor = undefined;
            }
        }

        if (vehicle.state != 'stopped'){
            ++vehicle.timeMoving;
        }

        switch (vehicle.state) {
            case 'moving to critic area': {
                moveVehicle(vehicle, kmHToMetersS(vehicle.speed), spaceData.spaceX / 2.0, spaceData.spaceY / 2.0);
                // if arrived to initial position
                if (vehicle.posX == spaceData.spaceX / 2.0 && vehicle.posY == spaceData.spaceY / 2.0) {
                    vehicle.state = 'searching people';
                    if (document.getElementById('status').innerHTML === 'Em deslocamento para área crítica'){
                        alterStatus('Buscando pessoas', 'green');
                    }
                }
            } break;

            case 'searching people': {

                // get the closer seen guy
                var person = undefined;
                var closerDistance;
                for (var i = 0; i < boats.length; ++i) {
                    var boat = boats[i];
                    var distance = distanceBetween(vehicle.posX, vehicle.posY, boat.posX, boat.posY);
                    if (distance <= vehicle.visionRadius) {
                        if (realRandom(0, 1) < vehicle.findProbability) { // if seen
                            if (person === undefined || distance < closerDistance) {
                                person = i;
                                closerDistance = distance;
                            }
                        }
                    }
                }
                if (person === undefined) {
                    algorithm.searchMove(vehicle);
                } else {
                    vehicle.goingFor = boats[person];
                    boats.splice(person, 1);
                    vehicle.state = 'reaching person';
                }
            } break;

            case 'reaching person': {
                var boat = vehicle.goingFor;
                updateBoat(boat);
                moveVehicle(vehicle, kmHToMetersS(searchSpeed), boat.posX, boat.posY);
                // if arrived to boat
                if (vehicle.posX === boat.posX && vehicle.posY === boat.posY) {
                    vehicle.state = 'rescue process';
                    vehicle.stoppedTimer = minutesToSeconds(vehicle.rescueTime);
                }
            } break;

            case 'rescue process': {
                vehicle.stoppedTimer -= 1;
                //console.log(vehicle.goingFor);
                if (vehicle.stoppedTimer <= 0) {
                    countPeopleResgat(vehicle.goingFor.status);
                    vehicle.goingFor = undefined;
                    ++vehicle.peopleCount;
                    if (vehicle.peopleCount == vehicle.capacity) {
                        vehicle.state = 'moving to base';
                    } else {
                        vehicle.state = 'searching people';
                    }
                }
            } break;

            case 'moving to base': {
                moveVehicle(vehicle, kmHToMetersS(vehicle.speed), basePoint.x, basePoint.y);
                // if arrived to base
                if (vehicle.posX === basePoint.x && vehicle.posY === basePoint.y) {
                    vehicle.state = 'stopped';
                    vehicle.preparationTime = minutesToSeconds(preparationTeamTime);
                }
            } break;

            case 'stopped': {
                // what?
                --vehicle.preparationTime;
                if ( vehicle.preparationTime < 0 ){
                    vehicle.timeMoving = 0;
                    vehicle.peopleCount = 0;
                    vehicle.state = 'moving to critic area';
                    if (document.getElementById('status').innerHTML === 'Em preparação'){
                        alterStatus('Em deslocamento para área crítica','orange');
                    }
                }
            } break;
            default:
        }
    });

    opacity = opacity - velocidadeAfundamento;
    if(opacity >=0){
        startShip(opacity);
    }

    // contagem de pessoas salvas
    var p = countPeopleResgat();
    if(p === 0){
        alterStatus('Resgate Completado', 'green');
        stop();
    }

    if(!boatsInMap(boats) && boats.length > 0){
        alterStatus('Todas as pessoas fora do espaço de busca', 'red');
        stop();
    }
    // verificação de mortos
    die(timestampSeconds);

    update( boats, [].concat( helicopters, safeBoat ), shipData ); // draw
}

function startShip(opacity){
    shipData.width = shipData.image.width;
    shipData.height = shipData.image.height;
    shipData.angle = 45;
    shipData.opacity = opacity;
}

function countPeopleResgat(status) {

    if(status === 'morto'){resgatPeopleDie++;}
    if(status === 'vivo'){resgatPeopleLife++;}

    //peopleDisappeared = qtdPeople - boats.length;
    peopleDisappeared = qtdPeople - resgatPeopleDie - resgatPeopleLife;
    document.getElementById('peopleSave').innerHTML = resgatPeopleLife;
    document.getElementById('peopleDie').innerHTML = resgatPeopleDie;
    document.getElementById('peopleDisappeared').innerHTML = peopleDisappeared;
    return peopleDisappeared;
}

function die(seconds) {
    for(var i=0; i<boats.length; i++) {
        //console.log(boats[i].surviveTime);
        if (minutesToSeconds(boats[i].surviveTime) < seconds) {
            boats[i].status = 'morto';
        }
    }
}

function alterStatus(status,color){
    document.getElementById('status').innerHTML = status;
    document.getElementById('status').style.color = color;
}

function boatsInMap(boats){
    var peopleOutside = 0;
    for(var i = 0; i < boats.length; i++){
        if(boats[i].posX > spaceData.spaceX) peopleOutside++;
        else if(boats[i].posX < 0) peopleOutside++;
        else if(boats[i].posY > spaceData.spaceY) peopleOutside++;
        else if(boats[i].posY < 0) peopleOutside++;
    }

    if(peopleOutside >= boats.length) {
        return false;
    }else{
        return true;
    }
}
