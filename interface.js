function random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// Desenhos

function drawBackground(){
    ctx.fillStyle="rgb(213, 255, 250)";
    ctx.fillRect(0,0,500,500);
}

function drawBoat(boat,index){
    ctx.beginPath();
    ctx.fillStyle="rgb(206, 159, 53)";
    ctx.arc( boat.posX, boat.posY, 1.5, 0, 2*Math.PI );
    ctx.fill();
    ctx.fillStyle="rgb(0, 0, 0)";
    ctx.fillText( boat.people, boat.posX-2.5, boat.posY-3 );
}

function drawShip(width, height){
    ctx.fillStyle="#612f23";
    var img = document.getElementById("imgShip");
    ctx.drawImage(img, (c.width*0.5)-(img.width/2), 20, width*c.width, height*c.height);
}

function drawVehicle(vehicle, index){
    ctx.fillStyle="#612f23";
    var img = document.getElementById(vehicle.idImg);
    ctx.drawImage(img, vehicle.posX * c.width, vehicle.posY * c.height, vehicle.width*c.width, vehicle.height*c.height);
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
        boats[i] = {}
        boats[i].people = boatLimit;
        boats[i].posX = x;
        boats[i].posY = y;
    }
    return boats;
}

function initVehicle(num, idImg, speed, width, height){
    var vehicles = new Array();
    for(var i=0; i<num; i++){
        vehicles[i] = {};
        vehicles[i].posX = 0.5;
        vehicles[i].posY = 0.9;
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
    drawShip( .08, .24 );
    boats.forEach(drawBoat);
    vehicles.forEach(drawVehicle);
}

function clearSimulation() {
    ctx.clearRect(0, 0, 500, 500);
}

function startSimulation() {
    clearSimulation();
    var qtdPeople = document.getElementById("people").value;
    var boats = initBoats( qtdPeople, 50 );
    var helicopters = initVehicle( 1,   "imgHelicopter", 0.02, .08, .08 );
    var uuvs        = initVehicle( 1.5, "imgUUVS",       0.04, .005, .025 );
    console.log([].concat(helicopters,uuvs));
    update(boats, [].concat(helicopters,uuvs) );
}

/// main
var c = document.getElementById("Canvas");
var ctx = c.getContext("2d");







