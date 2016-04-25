var mysql = require();

function Database(address, database, user, userPasswd){
	this.bindAddress = address;
	this.database = database;
	this.user = user;
	this.userPasswd = userPasswd;
}

Database.prototype = {
	connect(){},
	getOnline(){},
	updateOnlineStatus(user, state){},
	getUserTopic(userID){},
	getTopicUser(topicID){},
	newActionRecord(user, action){},
	getAvailableVChannel(){},
	setVChannel(channel, state){},
};
