var express = require('express');
var router = express.Router();
var net = require('net');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/streamon', function(req, res, next) {
	var tcpClient = new net.Socket();
	tcpClient.httpRes = res;
	tcpClient.connect(1024, "127.0.0.1", function(){
		tcpClient.write("STREAMON 1");
	});
	tcpClient.on('data', function(data){
		console.log("Receive: " + data);
		tcpClient.httpRes.send(data);
		tcpClient.destroy();
	});
});

router.post('/light', function(req, res, next) {
	var tcpClient = new net.Socket();
	tcpClient.httpRes = res;
	tcpClient.connect(1024, "127.0.0.1", function(){
		tcpClient.write("LIGHT 1 " + req.body.red + " " + req.body.green + " " + req.body.blue);
		tcpClient.httpRes.sendStatus(200);
		tcpClient.destroy();
	});
});

router.post('/feed', function(req, res, next) {
	var tcpClient = new net.Socket();
	tcpClient.httpRes = res;
	tcpClient.connect(1024, "127.0.0.1", function(){
		tcpClient.write("FEED 1 " + req.body.angle + " " + req.body.times);
		tcpClient.httpRes.sendStatus(200);
		tcpClient.destroy();
	});
});

module.exports = router;
