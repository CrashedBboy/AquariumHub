var IoT = require("../module/IoT.js");
var User = require("../model/User.js");

var iot = new IoT("127.0.0.1");

iot.connect();

console.log("Test addUser()");
iot.addUser(new User(1, "topic1"));
iot.addUser(new User(2, "topic2"));
console.log(iot.users);

console.log("Test getUserTopic()");
var topic1 = iot.getUserTopic(1);
console.log("User1 topic: " + topic1);
var topic2 = iot.getUserTopic(2);
console.log("User2 topic: " + topic2);
var topic3 = iot.getUserTopic(3);
console.log("User3 topic: " + topic3);

console.log("Test feed()");
iot.feed(1, 30, 2);
iot.feed(2, 60, 4);

console.log("Test light()");
iot.light(1, 255, 255, 255);
iot.light(2, 0, 0, 0);

console.log("Test streamOn()");
iot.streamOn(1, "http://topic1");
iot.streamOn(2, "http://topic2");

console.log("Test streamOff()");
iot.streamOff(1);
iot.streamOff(2);
