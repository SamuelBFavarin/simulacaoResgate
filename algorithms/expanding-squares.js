
var expandingSquaresAlgorithm = function(){

    const nVehicles = helicopters.length + safeBoat.length;

    const divisionSize = Math.ceil(Math.sqrt(nVehicles));

    const subAreaSizeX = spaceData.spaceX / divisionSize;
    const subAreaSizeY = spaceData.spaceY / divisionSize;

    function calcSubAreaCenter(i,j){
        return {
            x: subAreaSizeX * j + subAreaSizeX/2,
            y: subAreaSizeY * i + subAreaSizeY/2
        };
    }

    var i = 0, j = 0;
    this.generateInitialTarget = function(vehicle){


        if ( i === divisionSize ){
            i = 0;
            j = 0;
        }

        vehicle.subAreaI = i;
        vehicle.subAreaJ = j;
        vehicle.movingTo = undefined;
        vehicle.searchState = 'started';

        const center = calcSubAreaCenter( i, j );
        ++j;
        if ( j === divisionSize ){
            j = 0;
            ++i;
        }

        return center;
    };

    this.searchMove = function(vehicle){
        if ( vehicle.searchState === 'started' ){
            vehicle.step = 1;
            vehicle.angle = 0;
            vehicle.counter = 0;
            vehicle.algorithmAngle = 0;
            vehicle.S = 10;//vehicle.visionRadius;
            vehicle.searchState = 'searching';
        }
        if ( vehicle.movingTo === undefined
            || Math.abs(vehicle.posX - vehicle.movingTo.x) < 1 && Math.abs(vehicle.posY - vehicle.movingTo.y) < 1 ){
            if ( vehicle.movingTo !== undefined ){
                vehicle.algorithmAngle = (vehicle.algorithmAngle + 90)%360;
                vehicle.angle = vehicle.algorithmAngle;
                if ( vehicle.counter%2 === 0 ){
                    ++vehicle.step;
                }
            }
            ++vehicle.counter;
            vehicle.movingTo = moveTo( vehicle.posX, vehicle.posY, vehicle.angle, vehicle.step * vehicle.S );

            var crashY = false, crashX = false;
            if ( vehicle.movingTo.y <= subAreaSizeY*vehicle.subAreaI + vehicle.visionRadius ){
                vehicle.movingTo.y = subAreaSizeY*vehicle.subAreaI + vehicle.visionRadius;
                crashY = true;
            }
            if ( vehicle.movingTo.y >= subAreaSizeY*(vehicle.subAreaI+1) - vehicle.visionRadius ){
                vehicle.movingTo.y = subAreaSizeY*(vehicle.subAreaI+1) - vehicle.visionRadius;
                crashY = true;
            }
            if ( vehicle.movingTo.x <= subAreaSizeX*vehicle.subAreaJ + vehicle.visionRadius ){
                vehicle.movingTo.x = subAreaSizeX*vehicle.subAreaJ + vehicle.visionRadius;
                crashX = true;
            }
            if ( vehicle.movingTo.x >= subAreaSizeX*(vehicle.subAreaJ+1) - vehicle.visionRadius ){
                vehicle.movingTo.x = subAreaSizeX*(vehicle.subAreaJ+1) - vehicle.visionRadius;
                crashX = true;
            }
            if ( crashX && crashY ){
                vehicle.state = 'moving to critic area';
                vehicle.initialTarget = this.generateInitialTarget( vehicle );
                console.log('('+vehicle.subAreaI+';'+vehicle.subAreaJ+'): Changing area -> ('+i+';'+j+')');
                return;
            }
        }
        moveVehicle( vehicle, searchSpeed, vehicle.movingTo.x, vehicle.movingTo.y );
    };

    return this;
};
