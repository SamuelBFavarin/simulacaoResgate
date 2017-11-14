
var spaceData = {
    spaceX: 0,
    spaceY: 0,
    realX: 0,
    realY: 0
};

// Desenhos

function drawBackground(){
    ctx.fillStyle="rgb(213, 255, 250)";
    ctx.fillRect(0,0,c.width,c.height);
}

function drawBoat( boat, fillStyle ){
    var pos = toPosition(boat.posX, boat.posY, spaceData);
    ctx.beginPath();
    if ( typeof fillStyle !== 'string' ){
        ctx.fillStyle = "rgb(206, 159, 53)";
    } else {
        ctx.fillStyle = fillStyle;
    }

    if(boat.status === 'morto') ctx.fillStyle = "#FF0000";
    ctx.arc( pos.x, pos.y, 1.5, 0, 2*Math.PI );
    ctx.fill();
    ctx.fillStyle="rgb(0, 0, 0)";
}

function drawShip(ship){
    var pos = toPosition(ship.width,ship.height,spaceData);
    var w = pos.x;
    var h = pos.y;
    ctx.save();
    ctx.translate((c.width*0.5), 20.0 + h/2.0);
    ctx.rotate(ship.angle* Math.PI / 180.0);
    ctx.globalAlpha = ship.opacity;
    ctx.drawImage(ship.image, -(w/2.0), -h/2.0, w, h);
    ctx.restore();
}

function drawVehicle(vehicle, index){
    var pos = toPosition(vehicle.posX,vehicle.posY,spaceData);
    var tam = toPosition(vehicle.width, vehicle.height, spaceData);
    ctx.fillStyle="#612f23";
    var img = document.getElementById(vehicle.idImg);
    ctx.save();
    ctx.translate( pos.x + tam.x/2.0, pos.y + tam.y/2.0 );
    ctx.rotate( (vehicle.angle+90) * Math.PI / 180.0);
    ctx.drawImage(img, -tam.x/2.0, -tam.y/2.0, tam.x, tam.y);
    ctx.restore();
}


// Inicialização
function initBoats(num, boatLimit, ship, surviveTime, maxDetourTime) {
    var boats = new Array();
    //var pos = toPosition(ship.width,ship.height,spaceData);
    var w = ship.width; // pos.x;
    var h = ship.height;// pos.y;
    for(var i=0; i < num/boatLimit; i++){
        var x = random( (spaceData.spaceX/2.0 -w )-2, spaceData.spaceX/2.0 +w +2 );
        var y = random( 20, 20+h+10 );
        while (estaNoNavio(x,w)){
            // console.log('aqui');
            x = random( (spaceData.spaceX/2.0 -w )-2, (spaceData.spaceX/2.0 +w) +2 );
            // console.log(x);
        }
        boats[i] = {};
        boats[i].people = boatLimit;
        boats[i].posX = x;
        boats[i].posY = y;
        boats[i].surviveTime = calcMaxTime(surviveTime,maxDetourTime);
        boats[i].status = 'vivo';
    }
    return boats;
}

function estaNoNavio(x,w) {

    // console.log(spaceData.spaceX/2.0 - w, ' - ', spaceData.spaceX/2.0 + w );
    if(x >= (spaceData.spaceX/2.0 - w) && x <= (spaceData.spaceX/2.0 + w)) return true;
    else return false;
}


function initVehicle(num, idImg, vehicle, pos){
    var vehicles = new Array();
    for(var i=0; i<num; i++){
        vehicles[i] = {};
        vehicles[i].posX    = pos.x;
        vehicles[i].posY    = pos.y;
        vehicles[i].idImg   = idImg;
        vehicles[i].speed   = vehicle['speed'];
        vehicles[i].width   = vehicle['width'];
        vehicles[i].height  = vehicle['length'];
        vehicles[i].autonomy  = vehicle['autonomy'];
        vehicles[i].capacity  = vehicle['capacity'];
        vehicles[i].rescueTime  = vehicle['rescueTime'];
        vehicles[i].findProbability  = vehicle['findProbability'];
        vehicles[i].visionRadius  = vehicle['visionRadius'];
        vehicles[i].angle   = 0;
    }
    return vehicles;
}

// updates
function update(boats,vehicles,shipData) {
    drawBackground();
    drawShip(shipData);
    boats.forEach(drawBoat);
    vehicles.forEach(drawVehicle);
    vehicles.forEach((vehicle) => {
        if ( vehicle.goingFor !== undefined ){
            drawBoat( vehicle.goingFor, 'rgb(0,170,0)' );
        }
    });
}

function clearSimulation() {
    ctx.clearRect(0, 0, 500, 500);
}

/// main
var c = document.getElementById("Canvas");
spaceData.realX = c.width;
spaceData.realY = c.height;
var ctx = c.getContext("2d");
