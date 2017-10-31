
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
