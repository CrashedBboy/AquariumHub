var net = require('net');

function IPCServer(address, port) {
	this.address = address;
	this.port = port;
	this.serverSock;
}
    
IPCServer.prototype.connectionHandler = function(sock) {
  console.log("New Connection from " + sock.remoteAddress);
  sock.on('data', this.parse.bind(this, sock));
  sock.on('close', function() {
    console.log("Close Connection to " + sock.remoteAddress);
  });
} 

IPCServer.prototype.init = function() {
  this.serverSock = net.createServer(this.connectionHandler);
} 

IPCServer.prototype.start = function() {
  this.serverSock.listen(this.port, this.address);
} 

IPCServer.prototype.parse = function(sock, data) {
	var msg = data.toString();
	switch (msg.split(" ")[0]) {
		case "NEW":
			this.beaconActionHandler(msg);
			break;
		case "HEARTBEAT":
		case "ACK":
			this.iotActionHandler(msg);
			break;
		case "FEED":
		case "LIGHT":
		case "STREAMON":
		case "STREAMOFF":
		case "TASK":
			this.httpActionHandler(msg);
	}
} 
