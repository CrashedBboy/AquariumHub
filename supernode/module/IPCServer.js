var net = require('net');
var User = require('./User.js');

function IPCServer(address, port) {
	this.address = address;
	this.port = port;
	this.serverSock;
	this.dbConn = null;
	this.iotConn = null;
}

IPCServer.prototype.setIoTConn = function(iot) {
	this.iotConn = iot;
}

IPCServer.prototype.setDBConn = function(db) {
	this.dbConn = db;
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
			this.beaconActionHandler(sock, msg);
			break;
		case "FEED":
		case "LIGHT":
		case "STREAMON":
		case "STREAMOFF":
		case "TASK":
			this.httpActionHandler(sock, msg);
			break;
		default:
			console.log("Receive invalid message: " + msg);
	}
} 

IPCServer.prototype.beaconActionHandler = function(socket, action) {
	var actionSlices = action.split(" ");
	switch(actionSlices[0]) {
		case "NEW":
			var u = new User(actionSlices[1], actionSlices[2]);
			this.iotConn.addUser(u);
			break;
	}
}


IPCServer.prototype.httpActionHandler(socket, action) {
	var act = action.split(" ");
	var actLen = act.length;
	switch(act[0]) {
		case "FEED":
			if (actLen == 4)
				this.iotConn.feed(act[1], act[2], act[3]);
			break;
		case "LIGHT":
			if (actLen == 5)
				this.iotConn.light(act[1], act[2], act[3], act[4]);
			break;
		case "STREAMON":
			if (actLen == 2) {
				var channel = this.dbConn.getAvailableVChannel();
				if (channel != -1) {
					this.iotConn.streamOn(act[1], channel.getFeedUrl());
					socket.write(channel.getStreamUrl());
				} else {
					socket.write("BUSY");
				}
			}
			break;
		case "STREAMOFF":
			if (actLen == 2) {
				this.iotConn.streamOff(act[1]);
				this.dbConn.userStreamOff(act[1]);
			}
			break;
		case "TASK":
			break;
	}
}

module.exports = IPCServer;
