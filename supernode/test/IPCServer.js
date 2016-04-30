var IPCServer = require("../module/IPCServer.js");
var Database = require("../module/Database.js");
var IoT = require("../module/IoT.js");

var ipc = new IPCServer("127.0.0.1", 1024);
var db = new Database("127.0.0.1", "aquariumhub", "aquariumhub", "");
var iot = new IoT("127.0.0.1");

db.connect();
iot.connect();

ipc.init();
ipc.setIoTConn(iot);
ipc.setDBConn(db);
ipc.start();
