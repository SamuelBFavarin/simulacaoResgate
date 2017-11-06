var intervalo;
var speed;
const clock = 1000.0 / 30.0;

function setTime(h,m,s){
	document.getElementById("hora").innerHTML = twoDigits( h ) + "h";
	document.getElementById("minuto").innerHTML = twoDigits( m ) + "m";
	document.getElementById("segundo").innerHTML = twoDigits( s ) + "s";
}

function start() {

	speed = document.getElementById("velocidade").value;

    window.clearInterval(intervalo);
	var ms = 0;
	var s = 0;
	var m = 0;
	var h = 0;
	setTime( h, m, s );
	intervalo = window.setInterval(function() {
		++s;
		if (s == 60) { m++; s = 0; }
		if (m == 60) { h++; s = 0; m = 0; }
		setTime( h, m, s );
		updateAll();
	}, clock );
}

function stop(){
	window.clearInterval(intervalo);
}
