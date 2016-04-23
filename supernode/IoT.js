var mqtt = require('mqtt');

function IoT(brokerAddr) {
	this.brokerAddr = brokerAddr;
	this.users = new Array();
}

IoT.prototype = {
	connect(){},
	order(topic, action, options){},
	newUser(user){
		this.users.push(user);
	}
};
