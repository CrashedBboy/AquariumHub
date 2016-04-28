var m = require('mraa');
var pwmPin = new m.Pwm(18);	//PWM gpio pin
pwmPin.period_ms(20);	//PWM period
pwmPin.pulsewidth_us(1000);	//duty cycle(1~2ms)
pwmPin.enable(true);

var angle = 0;
var angleMax = 2400;	//us(2400)
var angleMin = 1000;	//us(400)
var sTime = (2400-angleMin)/2;

function servoDownActivity(){
	console.log("down 1000");
	pwmPin.pulsewidth_us(angleMin);
	setTimeout(servoUpActivity, sTime*2);
}

function servoUpActivity(){
	console.log("up 2400");
	pwmPin.pulsewidth_us(angleMax);
	setTimeout(servoDownActivity, sTime*2);
}

servoUpActivity();
