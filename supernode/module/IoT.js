var mqtt = require('mqtt');

function IoT(brokerAddr) {
	this.brokerAddr = brokerAddr;
	this.users = new Array();
}

IoT.prototype.init = function() {}

IoT.prototype.connect = function() {}

IoT.prototype.messageHandler = function(topic, message) {

}

IoT.prototype.addUser = function(user) {
	this.users.push(user);
}

IoT.prototype.feed = function(userID, degree, times) {

}

IoT.prototype.light = function(userID, red, green, blue) {

}

IoT.prototype.streamOn = function(userID, feedUrl) {

}

IoT.prototype.streamOff = function(userID) {

}

module.exports = IoT;
