var IoT = require('./IoT.js');
var Database = require('./Database.js');
var ENV = require('./env.json');
var User = require('./User.js');
var IPCServer = require('./IPCServer.js');

var iot = new IoT(ENV.brokerAddr);
var db = new Database(ENV.dbAddr, ENV.dbName, ENV.dbUser, ENV.dbPasswd);
var ipcServer = new IPCServer(ENV.ipcAddr, ENV.ipcPort);

/* Start all connections */
iot.connect();
db.connect();

ipcServer.setIoTConn(iot);
ipcServer.setDBConn(db)
ipcServer.start();

/* Retrieving all active user and their topics */
var originUser = db.getOnline();
for (i = 0; i < originUser.length; i++){
	var user = new User(originUser[i].name, originUser[i].topic);
	iot.newUser(user);
}
