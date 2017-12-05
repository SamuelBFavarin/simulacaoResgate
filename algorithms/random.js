
var randomAlgorithm = {

    searchMove: function(vehicle){
        // new position
        if ( vehicle.timeSearching%60 === 0 || vehicle.searchState === 'started' ){ // one minute for searching time
            vehicle.angle = realRandom( 0, 360 );
            vehicle.searchState = 'randomly searching';
        }
        ++vehicle.timeSearching;
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
