var IPCServer = require("./module/IPCServer.js");
var Database = require("./module/Database.js");
var IoT = require("./module/IoT.js");
var env = require("./env.json");

var ipc = new IPCServer(env.IPC.addr, env.IPC.port);
var db = new Database(env.Database.addr, env.Database.name, env.Database.user, env.Database.password);
var iot = new IoT(env.IoT.brokerAddr);

db.connect();
iot.connect();

ipc.init();
ipc.setIoTConn(iot);
ipc.setDBConn(db);
ipc.start();
