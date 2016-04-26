var mysql = require();
var VChannel

function Database(address, database, user, userPasswd){
	this.address = address;
	this.database = database;
	this.user = user;
	this.userPasswd = userPasswd;
	this.connection = null;
}

Database.prototype.connect = function(){
	this.connection = mysql.createConnection({
		host: this.address,
		database: this.database,
		user: this.user,
		password: this.userPasswd
	});
	this.connection.connect();
}

Database.prototype.getOnline = function(){
	this.connection.query("SELECT * FROM user_ichannel WHERE user_id != -1", function(error, result){
			return result;
	});
}

Database.prototype.setTopicUser(topicID, userID) {
	this.connection.query("UPDATE user_ichannel SET user_id ="+ userID +" WHERE channel_id =" + topicID, function(error, result){
		if (error)
			throw error;
	});
}

Database.prototype.setTopicFree(topicID) {
	this.connection.query("UPDATE user_ichannel SET user_id = -1 WHERE channel_id =" + topicID, function(error, result){
		if (error)
			throw error;
	});
}

Database.prototype.setUserOnline(userID) {
	this.connection.query("UPDATE user_device SET online_status = 1 WHERE user_id =" + userID, function(error, result){
		if (error)
			throw error;
	});
}

Database.prototype.setUserOffline(userID) {
	var now = Date.now();
	this.connection.query("UPDATE user_device SET online_status = 0, last_online = " + now + " WHERE user_id =" + userID, function(error, result){
		if (error)
			throw error;
	});
}

Database.prototype.getUserTopic = function(userID) {
	/* Inner join of user_ichannel and IoT_channels */
	var query = "SELECT IoT_channels.topic FROM user_ichannel INNER JOIN IoT_channels ON IoT_channels.id=user_ichannel.channel_id \ 
								WHERE user_ichannel.user_id =" + userID;
	this.connection.query(query, function(error, result) {
		if (error)
			throw error;
		if (result.length > 0) {
			return result[0].topic
		} else {
			return false;
		}
	});
}

Database.prototype.getAvailavleVChannel = function() {
	var query = "SELECT * FROM video_channels INNER JOIN user_vchannel ON video_channels.id=user_vchannel.channel_id \ 
								WHERE user_vchannel.user_id=-1 LIMIT 1"
	this.connection.query(, function(error, result) {
		if (error)
			throw error;
		if (result.length > 0) {
			return result[0];
		} else {
			return false;
		}
	});
}

Database.prototype.setVChannelOn = function(channelID, userID) {
	this.connection.query("UPDATE user_vchanel SET user_id=" + userID + " WHERE channel_id=" + channelID, function(error, result) {
		if (error)
			throw error;
	});
}

Database.prototype.setVchannelOff = function(channelID) {
	this.connection.query("UPDATE user_vchannel SET user=-1 WHERE channel_id=" + channelID, function(error, result) {
		if (error)
			throw error;
	});
}
