var net = require('net');

function IPCServer(address, port) {
	this.address = address;
	this.port = port;
}

IPCServer.prototype = {
	connect(){},
}
