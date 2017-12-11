
var parallelTrajectoryAlgorithm = function(){

    const nVehicles = helicopters.length + safeBoat.length;

    const subAreaSize = spaceData.spaceX / nVehicles;

    function calcSubAreaStart(j,vehicle){
        return {
            x: subAreaSize * j + vehicle.visionRadius,
            y: spaceData.spaceY - vehicle.visionRadius
        };
    }

    var j = 0;
    this.generateInitialTarget = function(vehicle){
        vehicle.subArea = j;
        vehicle.movingTo = undefined;
        vehicle.searchState = 'started';

        const start = calcSubAreaStart( j, vehicle );

        j = (j+1) % nVehicles;

        return start;
    };

    this.searchMove = function(vehicle){
        if ( vehicle.searchState === 'started' ){
            vehicle.nextStep = 0;
            vehicle.searchState = 'searching';
        }
        if ( vehicle.movingTo === undefined
            || Math.abs(vehicle.posX - vehicle.movingTo.x) < 1 && Math.abs(vehicle.posY - vehicle.movingTo.y) < 1 ){

            var distance;
            if ( vehicle.nextStep %2 === 0 ){
                distance = spaceData.spaceY - vehicle.visionRadius*2;
            } else {
                distance = vehicle.visionRadius*2;
            }
            switch (vehicle.nextStep){
                case 0: vehicle.angle = 270; break;
                case 1: vehicle.angle = 0;   break;
                case 2: vehicle.angle = 90;  break;
                case 3: vehicle.angle = 0;   break;
            }
            vehicle.nextStep = (vehicle.nextStep+1) % 4;
            vehicle.movingTo = moveTo( vehicle.posX, vehicle.posY, vehicle.angle, distance );

            var crashX = false;
            if ( vehicle.movingTo.x > subAreaSize * (vehicle.subArea+1) ){
                crashX = true;
            }
            if ( crashX ){
                vehicle.state = 'moving to critic area';
                vehicle.initialTarget = this.generateInitialTarget( vehicle );
                console.log('('+vehicle.subArea+'): Changing area -> ('+j+')');
                return;
            }
        }
        moveVehicle( vehicle, searchSpeed, vehicle.movingTo.x, vehicle.movingTo.y );
    };

    return this;
};
