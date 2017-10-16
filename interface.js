function random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function drawPeople(x,y){
    ctx.beginPath();
    ctx.arc(x,y,2,0,2*Math.PI);
    ctx.stroke();
}

function drawShip(){
    ctx.fillRect(235,40,30,120);
}

function update() {
    for(var i=0; i<8; i++){
        x = random(215,290);
        y = random(30,170);
        while(x >= 230 && x<= 280){
            x = random(215,290);
        }
        drawPeople(x,y);
    }
    drawShip();
}

///// main
var c = document.getElementById("Canvas");
var ctx = c.getContext("2d");
update();
