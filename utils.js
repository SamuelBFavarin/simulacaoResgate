
function twoDigits(num){
    if (num > 10){
        return ""+num;
    }
    return "0"+num;
}

function random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function realRandom(min,max) {
    return (Math.random() * (max - min + 1)) + min;
}

function distanceBetween( x1,y1, x2,y2 ){
    return Math.sqrt( Math.pow( x2-x1, 2 ) + Math.pow( y2-y1, 2 ) );
}

function angleBetween( x1,y1, x2,y2 ){
    var hyp = distanceBetween( x1,y1, x2,y2 );
    var catOp = x2 - x1;
    var angle = (Math.asin( catOp / hyp )*180.0)/Math.PI - 90.0;
    angle *= -1;
    if ( y2 < y1 ){
        angle = 360-angle;
    }
    return angle;
}

function moveTo( x,y, angle, distance ){
    angle *= ( Math.PI / 180.0 );
    return {
        x: x + Math.cos( angle ) * distance,
        y: y + Math.sin( angle ) * distance
    };
}

function minutesToSeconds(minutes){ return ( minutes * 60.0 ); }
function kmToMeters(km){ return ( km * 1000.0 ); }

function speedToMeters( speedMetersPerSecond, spentTimeMilliseconds ){
    var speed_MS = speedMetersPerSecond / 1000.0;
    return speed_MS * spentTimeMilliseconds;
}
/**
    spaceData = {
        spaceX, spaceY,
        realX, realY
    }
*/
function toPosition( x,y, spaceData ){
    return {
        x: ( x / spaceData.spaceX ) * spaceData.realX,
        y: ( y / spaceData.spaceY ) * spaceData.realY
    };
}
