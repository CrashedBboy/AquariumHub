var net = require('net');
var mqtt = require('mqtt');
var moduleName = "[IoT]";

function IoT(brokerAddr) {
	this.brokerAddr = "mqtt://" + brokerAddr;
	this.topic = "";
	this.iotConn = "";
	this.camera = "";
	this.light = "";
	this.servo = "";
}

IoT.prototype.getTopic = function(beaconAddr, beaconPort) {
	var tcpClient = new net.Socket();
	tcpClient.connect(beaconPort, beaconAddr, function(){
		console.log(moduleName + "Connected to beacon");
		tcpClient.write("ASKTOPIC 1");
	});
	tcpClient.on('data', (function(data) {
		var msg = data.toString();
		if (msg.split(" ")[0] == "TOPIC") {
			this.topic = msg.split(" ")[1].replace("\n", "");
			console.log(moduleName + "Got new topic: " + this.topic);
		}
		tcpClient.destroy();
		this.connectIoT();
	}).bind(this));
}

IoT.prototype.connectIoT = function() {
	this.iotConn = mqtt.connect(this.brokerAddr);
	this.iotConn.subscribe(this.topic);
	this.iotConn.on('connect', (function() {
		console.log(moduleName + "Connected to mqtt broker(" + this.brokerAddr + ")");
	}).bind(this));
	this.iotConn.on('message', this.messageHandler.bind(this));
}

IoT.prototype.messageHandler = function(topic, message) {
	var msg = message.toString();
	console.log(moduleName + "Receive from " + topic + ": " + msg);
	var slice = msg.split(" ");
	switch (slice[0]) {
		case "FEED":
			if (slice.length == 3)
				this.servo.turn(parseInt(slice[1]), parseInt(slice[2]));
			break;
		case "LIGHT":
			if (slice.length == 4)
				this.light.setColor(parseInt(slice[1], slice[2], slice[3]));
			break;
		case "STREAMON":
			if (slice.length == 2)
				this.camera.start(slice[2]);
			break;
		case "STREAMOFF":
			this.camera.close();
			break;
	}
}

IoT.prototype.setCamera = function(cam) {
	this.camera = cam;
}

IoT.prototype.setLight = function(light) {
	this.light = light;
}

IoT.prototype.setServo = function(servo) {
	this.servo = servo;
}

module.exports = IoT;
