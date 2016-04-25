var mqtt = require('mqtt');
var moduleName = "[IoT]";

function IoT(brokerAddr) {
	this.brokerAddr = brokerAddr;
	this.users = new Array();
	this.connection = null;
}

IoT.prototype.connect = function() {
	this.connection = mqtt.connect(this.brokerAddr);
	this.connection.on('connect', this.connectInit);
	this.connection.on('message', this.messageHandler);
}

IoT.prototype.connectInit = function() {
	console.log(moduleName + "MQTT broker("+ this.brokerAddr +") connected");

	/* suscribe all active user's topics */
	for (i = 0; i < this.users.length; i++) {
		this.connection.subscribe(users[i].topic);
		console.log(moduleName + "Subscribe user " + users[i].id + " topic: " + users[i].topic);
	}
}

IoT.prototype.messageHandler = function(topic, message) {
	console.log(moduleName + "Receive: " + message.toString());
	/* coming soon */
}

IoT.prototype.addUser = function(user) {
	this.users.push(user);
}

IoT.prototype.feed = function(userID, degree, times) {
	var topic = this.getUserTopic(userID);
	this.connection.publish(topic, "FEED " + degree + " " + times);
}

IoT.prototype.light = function(userID, red, green, blue) {
	var topic = this.getUserTopic(userID);
	this.connection.publish(topic, "LIGHT " + red + " " + green + " " + blue);
}

IoT.prototype.streamOn = function(userID, feedUrl) {
	var topic = this.getUserTopic(userID);
	this.connection.publish(topic, "STREAMON " + feedUrl);
}

IoT.prototype.streamOff = function(userID) {
	var topic = this.getUserTopic(userID);
	this.connection.publish(topic, "STREAMOFF");
}

IoT.prototype.getUserTopic = function(userID) {
	var result = this.users.filter(findViaUserID.bind(null, userID));
	if (result.length > 0) {
		return result[0].topic;
	} else {
		return false;
	}
}

function findViaUserID(ID, user, index, array) {
	return user.id === ID;
}

module.exports = IoT;
