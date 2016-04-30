var IoT = require("./module/IoT.js");
var Camera = require("./module/Camera.js");
var	Light = require("./module/Light.js");
var Servo = require("./module/Servo.js");
var env = require("./env.json");

var iot = new IoT(env.brokerAddr);

var cam = new Camera();
iot.setCamera(cam);

var light = new Light(19, 20, 21);
iot.setLight(light);

var servo = new Servo(18, 20, 1000);
servo.setPulseWidthLimit(1000, 2400);
iot.setServo(servo);

iot.getTopic(env.beaconAddr, env.beaconPort);
