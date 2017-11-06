
var qtdPeople;
var boats;
var helicopters;
var uuvs;
var searchSpeed = 10; // km/h

var vehicleData;

var spaceData = {
    spaceX: 0,
    spaceY: 0,
    realX: 500.0,
    realY: 500.0
};

$.getJSON('vehicleData.json', function(data){
    vehicleData = data;
});

// instancia dados da simulação
function startSimulation() {
    clearSimulation();
    
    spaceData.spaceX = parseFloat(document.getElementById("espacoBuscaX").value);
    spaceData.spaceY = parseFloat(document.getElementById("espacoBuscaY").value);
    qtdPeople = document.getElementById("people").value;

    boats = initBoats( qtdPeople, 50 );
    helicopters = initVehicle( 1,   "imgHelicopter", 0.02, .08, .08 );
    uuvs        = initVehicle( 1.5, "imgUUVS",       0.04, .005, .025 );
    console.log([].concat(helicopters,uuvs));
    update(boats, [].concat(helicopters,uuvs) );
}


function updateAll(){
    helicopters[0].posX += 0.004;
    update( boats, [].concat( helicopters, uuvs ) );
    //helicopters[0].posY = random(30,170);
}


function personFound(vehicleID,x,y){

}
