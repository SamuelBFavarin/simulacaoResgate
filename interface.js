
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

function drawBoat(boat,index){
    var pos = toPosition(boat.posX, boat.posY, spaceData);
    ctx.beginPath();
    ctx.fillStyle="rgb(206, 159, 53)";
    ctx.arc( pos.x, pos.y, 1.5, 0, 2*Math.PI );
    ctx.fill();
    ctx.fillStyle="rgb(0, 0, 0)";
    //ctx.fillText( boat.people, pos.x-2.5, pos.y-3);
}

function drawShip(width, height){
    var pos = toPosition(width,height, spaceData);
    var img = document.getElementById("imgShip");
    var w = pos.x;
    var h = pos.y;
    ctx.save();
    ctx.translate((c.width*0.5), 20.0 + h/2.0);
    ctx.rotate(45.0* Math.PI / 180.0);
    ctx.fillStyle="#612f23";
    ctx.drawImage(img, -(w/2.0), -h/2.0, w, h);
    ctx.restore();
}

function drawVehicle(vehicle, index){
    var pos = toPosition(vehicle.posX,vehicle.posY,spaceData);
    var tam = toPosition(vehicle.width, vehicle.height, spaceData);
    ctx.fillStyle="#612f23";
    var img = document.getElementById(vehicle.idImg);
    ctx.drawImage(img, pos.x, pos.y, tam.x, tam.y);
}


// Inicialização

function initBoats(num, boatLimit) {
    var boats = new Array();
    for(var i=0; i < num/boatLimit; i++){
        var x = random(215,300);
        var y = random(30,170);
        while(x >= 230 && x<= 290){
            x = random(215,290);
        }
        boats[i] = {};
        boats[i].people = boatLimit;
        boats[i].posX = x;
        boats[i].posY = y;
    }
    return boats;
}

function initVehicle(num, idImg, speed, width, height, posX, posY){
    var vehicles = new Array();
    for(var i=0; i<num; i++){
        vehicles[i] = {};
        vehicles[i].posX = posX;
        vehicles[i].posY = posY;
        vehicles[i].width  = width;
        vehicles[i].height = height;
        vehicles[i].idImg = idImg;
        vehicles[i].speed = speed;
    }
    return vehicles;
}

// updates

function update(boats,vehicles) {
    drawBackground();
    var imgShip = document.getElementById("imgShip");
    drawShip(imgShip.width , imgShip.height );
    boats.forEach(drawBoat);
    vehicles.forEach(drawVehicle);
}

function clearSimulation() {
    ctx.clearRect(0, 0, 500, 500);
}

/// main
var c = document.getElementById("Canvas");
spaceData.realX = c.width;
spaceData.realY = c.height; 
var ctx = c.getContext("2d");
