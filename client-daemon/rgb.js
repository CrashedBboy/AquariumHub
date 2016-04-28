var m = require('mraa');
var pwmPinR = new m.Pwm(19);
var pwmPinG = new m.Pwm(20);
var pwmPinB = new m.Pwm(21);
pwmPinR.enable(true);
pwmPinG.enable(true);
pwmPinB.enable(true);

function RGBled(ledR, ledG, ledB){
	pwmPinR.write(ledR/255);
	pwmPinG.write(ledG/255);
	pwmPinB.write(ledB/255);
}

