var mraa = require('mraa');

/ ** Constructor ex.Light(19, 20, 21) */
function Light(pinR, pinG, pinB) {
	this.pwmR = new mraa.Pwm(pinR);
	this.pwmG = new mraa.Pwm(pinG);
	this.pwmB = new mraa.Pwm(pinB);
	this.pwmR.enable(true);
	this.pwmG.enable(true);
	this.pwmB.enable(true);
}

Light.prototype.setColor = function(r, g, b) {
	this.pwmR.write(this.rangeChack(r));
	this.pwmG.write(this.rangeChack(g));
	this.pwmB.write(this.rangeChack(b));
}

Light.prototype.rangeCheck = function(value) {
	var mul = value / 255;
	if (mul > 1) {
		mul = 1;
	} else if (mul < 0) {
		mul = 0;
	}
	return mul;
}

module.exports = Light;
