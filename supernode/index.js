var IoT = require('./IoT.js');
var Database = require('./Database.js');
var ENV = require('./env.json');
var User = require('./User.js');
var IPCServer = require('./IPCServer.js');

var iot = new IoT(ENV.brokerAddr);
var db = new Database(ENV.dbAddr, ENV.dbName, ENV.dbUser, ENV.dbPasswd);
var ipcServer = new IPCServer(ENV.ipcAddr, ENV.ipcPort);

/* Start all connections */
var supernode = iot.connect();
var dbConn = db.connect();
var ipc = ipcServer.connect();

/* Retrieving all active user and their topics */
for (each in db.getOnline()){
	var user = new User(each);
	iot.newUser(user);
}

