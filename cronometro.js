var intervalo;
var speed;
var timestampSeconds;

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
	timestampSeconds = 0;
	intervalo = window.setInterval(function() {
		updateAll();
		++s;
		++timestampSeconds;
		if (s == 60) { m++; s = 0; }
		if (m == 60) { h++; s = 0; m = 0; }
		setTime( h, m, s );
	}, speed );
}

function stop(){
	window.clearInterval(intervalo);
}
