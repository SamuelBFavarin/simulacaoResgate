function random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function drawBackground(){
    ctx.fillStyle="#61ffee";
    ctx.fillRect(0,0,500,500);
}

function drawPeople(x,y){
    ctx.beginPath();
    ctx.fillStyle="#ffd1d3";
    ctx.arc(x,y,2,0,2*Math.PI);
    ctx.fill();
    ctx.stroke();
}

function drawShip(){
    ctx.fillStyle="#612f23";
    var img = document.getElementById("imgShip");
    ctx.drawImage(img, 235, 40);
    //ctx.fillRect(235,40,30,120);
}

function initPeople(num) {
    var people = new Array();
    for(var i=0; i<num; i++){
        var x = random(215,290);
        var y = random(30,170);
        while(x >= 230 && x<= 280){
            x = random(215,290);
        }
        people[i] = {posX:x, posY:y};
    }
    return people;
}

function update(people) {
    drawBackground();
    for(var i =0; i< people.length; i++) drawPeople(people[i].posX,people[i].posY);
    drawShip();
}

function clearSimulation() {
    ctx.clearRect(0, 0, 500, 500);
}

function startSimulation() {
    clearSimulation();
    var qtdPeople = document.getElementById("people").value;
    var people = initPeople(qtdPeople);
    update(people);
}

/// main
var c = document.getElementById("Canvas");
var ctx = c.getContext("2d");







