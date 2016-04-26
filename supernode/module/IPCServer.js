var net = require('net');
var User = require('../model/User.js');
var VChannel = require('../model/VChannel.js');
var moduleName = "[IPCServer]";

function IPCServer(address, port) {
	this.address = address;
	this.port = port;
	this.serverSock;
	this.dbConn = "";
	this.iotConn = "";
}

IPCServer.prototype.setIoTConn = function(iot) {
	this.iotConn = iot;
}

IPCServer.prototype.setDBConn = function(db) {
	this.dbConn = db;
}
    
IPCServer.prototype.connectionHandler = function(sock) {
  console.log(moduleName + "New Connection from " + sock.remoteAddress);
  sock.on('data', this.parse.bind(this, sock));
} 

IPCServer.prototype.init = function() {
  this.serverSock = net.createServer(this.connectionHandler.bind(this));
} 

IPCServer.prototype.start = function() {
  this.serverSock.listen(this.port, this.address);
} 

IPCServer.prototype.parse = function(sock, data) {
	console.log(moduleName + "Receive: " + data);
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
			this.dbConn.getTopicByID(actionSlices[2], (function(error, result) {
				if (error)
					throw error;
				if (result.length > 0) {
					var u = new User(actionSlices[1], result[0].topic);
					this.iotConn.addUser(u);
					this.dbConn.setTopicUser(actionSlices[2], actionSlices[1]);
					this.dbConn.setUserOnline(actionSlices[1]);
				}
			}).bind(this));
			break;
		default:
	}
	socket.end();
}

IPCServer.prototype.httpActionHandler = function (socket, action) {
	var act = action.split(" ");
	var actLen = act.length;
	switch(act[0]) {
		case "FEED":
			if (actLen == 4) {
				this.iotConn.feed(act[1], act[2], act[3]);
			}
			socket.end();
			break;
		case "LIGHT":
			if (actLen == 5)
				this.iotConn.light(act[1], act[2], act[3], act[4]);
			socket.end();
			break;
		case "STREAMON":
			if (actLen == 2) {
				this.dbConn.getAvailableVChannel((function(error, result){
					if (error)
						throw error;
					if (result.length > 0) {
						var vc = new VChannel(result[0].id, result[0].feed_url, result[0].stream_url, result[0].filename);
						this.dbConn.setVChannelUser(vc.getID(), act[1]);
						this.iotConn.streamOn(act[1], vc.getFeedUrl());
						socket.end(vc.getStreamUrl());
					} else {
						socket.end("BUSY");
					}
				}).bind(this));
			}
			break;
		case "STREAMOFF":
			if (actLen == 2) {
				this.iotConn.streamOff(act[1]);
				this.dbConn.getUserVChannel(act[1], (function (error, result) {
					if (error)
						throw error;
					if (result.length > 0) {
						this.dbConn.setVChannelFree(result[0].channel_id);
					}
				}).bind(this));
			}
			socket.end();
			break;
		case "TASK":
			break;
	}
}
module.exports = IPCServer;
