var mqtt = require('mqtt');

function IoT(brokerAddr) {
	this.brokerAddr = brokerAddr;
}

IoT.prototype = {
	connect(){},
	order(topic, action, options){}
};
