var Database = require('../module/Database.js');

var db = new Database("127.0.0.1", "aquariumhub", "aquariumhub", "");
db.connect();

function printResult(error, result) {
	console.log(result);
}
