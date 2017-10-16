var intervalo;

function tempo(speed) {

	if(speed === 1) sp = 1000;
	if(speed === 2) sp = 100;
	if(speed === 3) sp = 10;
	if(speed === 4) sp = 1;
	if(speed === 5) sp = 0.1;

    window.clearInterval(intervalo);
	var s = 1;
	var m = 0;
	var h = 0;
	intervalo = window.setInterval(function() {
		if (s == 60) { m++; s = 0; }
		if (m == 60) { h++; s = 0; m = 0; }
		if (h < 10) document.getElementById("hora").innerHTML = "0" + h + "h"; else document.getElementById("hora").innerHTML = h + "h";
		if (s < 10) document.getElementById("segundo").innerHTML = "0" + s + "s"; else document.getElementById("segundo").innerHTML = s + "s";
		if (m < 10) document.getElementById("minuto").innerHTML = "0" + m + "m"; else document.getElementById("minuto").innerHTML = m + "m";		
		s++;
	},sp);
}




