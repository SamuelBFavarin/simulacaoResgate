
var expandingSquaresAlgorithm = function(){

    const nVeiculos = helicopters.length + safeBoat.length;

    const divisionSize = Math.ceil(Math.sqrt(nVeiculos));

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
            vehicle.S = 10;//vehicle.visionRadius;
            vehicle.searchState = 'searching';
        }
        if ( vehicle.movingTo === undefined
            || Math.abs(vehicle.posX - vehicle.movingTo.x) < 1 && Math.abs(vehicle.posY - vehicle.movingTo.y) < 1 ){
            if ( vehicle.movingTo !== undefined ){
                vehicle.angle = (vehicle.angle+90)%360;
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
                if ( i < divisionSize ){
                    console.log('('+vehicle.subAreaI+';'+vehicle.subAreaJ+'): Changing area -> ('+i+';'+j+')');
                    vehicle.subAreaI = i;
                    vehicle.subAreaJ = j;
                    vehicle.searchState = 'started';
                    vehicle.state = 'moving to critic area';
                    vehicle.movingTo = undefined;
                    vehicle.initialTarget = calcSubAreaCenter(i,j);
                    ++j;
                    if ( j === divisionSize ){
                        ++i;
                        j = 0;
                    }
                } else {
                    // vehicle.state = 'moving to base';
                    // vehicle.searchState = 'started';
                    // vehicle.movingTo = basePoint;
                    vehicle.initialTarget = this.generateInitialTarget( vehicle );
                    vehicle.state = 'moving to critic area';
                }
                return;
            }
        }
        moveVehicle( vehicle, searchSpeed, vehicle.movingTo.x, vehicle.movingTo.y );
    };

    return this;
};
