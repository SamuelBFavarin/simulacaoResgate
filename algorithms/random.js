
var randomAlgorithm = {

    test: function(){
        console.log('uhul');
    },

    searchMove: function(vehicle){
        // new position
        if ( vehicle.angle == undefined || timestampSeconds%60 === 0 ){ // one minute for direction
            vehicle.angle = realRandom( 0, 360 );
        }
        // out of the search space
        var x = vehicle.posX;
        var y = vehicle.posY;
        if ( ( x < 0 || y < 0 ) || ( x > spaceData.spaceX || y > spaceData.spaceY ) ){
            vehicle.angle = vehicle.angle - 180;
        }
        var newPos = moveTo(
            vehicle.posX, vehicle.posY,
            vehicle.angle,
            searchSpeed // m/s
        );
        vehicle.posX = newPos.x;
        vehicle.posY = newPos.y;
    },

};
