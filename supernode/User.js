var ENV = require("./env.js");

function User(id, topic, stream = null) {
	this.id = id;
	this.topic = topic;
	this.stream = stream;
}
