var mraa = require('mraa');
const moduleName = "[servo]";

/** Constructor, ex.Servo(18, 20, 1000) */
function Servo(pin, pwmPeriod, pulseWidth) {
	this.pwm = new mraa.Pwm(pin);
	this.pwm.period_ms(pwmPeriod);
	this.pwm.pulsewidth_us(pulseWidth);
	this.pwm.enable(true);
}

/** ex.setPulseWidthLimit(1000, 2400) */
Servo.prototype.setPulseWidthLimit = function(min, max) {
	this.pulseWidthMin = min;
	this.pulseWidthMax = max;
}

/** ex.turn(60, 2) */
Servo.prototype.turn = function(angle, times) {
	console.log(moduleName + "turn angle-" + angle + " times-" + times);
	if (times == 0)
		return;
	var width = this.pulseWidthMin + angle * 10;
	if (width > this.pulseWidthMax)
		width = this.pulseWidthMax;
	if (width < this.pulseWidthMin)
		width = this.pulseWidthMin;
	var waveTime = (width - this.pulseWidthMin);
	this.pwm.pulsewidth_us(width);
	setTimeout((function(){
		this.pwm.pulsewidth_us(this.pulseWidthMin);
		setTimeout(this.turn.bind(this, angle, times - 1), waveTime);
	}).bind(this), waveTime);
}

module.exports = Servo;
