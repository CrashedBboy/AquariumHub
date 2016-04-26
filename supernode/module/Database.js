var mysql = require('mysql');
var VChannel = require('../model/VChannel.js');

function Database(address, database, user, userPasswd){
	this.address = address;
	this.database = database;
	this.user = user;
	this.userPasswd = userPasswd;
	this.connection = null;
}

Database.prototype.connect = function (){
	this.connection = mysql.createConnection({
		host: this.address,
		database: this.database,
		user: this.user,
		password: this.userPasswd
	});
	this.connection.connect();
}

Database.prototype.getOnline = function (callback){
	this.connection.query("SELECT * FROM user_ichannel WHERE user_id != -1", callback);
}

Database.prototype.setTopicUser = function (topicID, userID) {
	this.connection.query("UPDATE user_ichannel SET user_id ="+ userID +" WHERE channel_id =" + topicID, function(error, result){
		if (error)
			throw error;
	});
}

Database.prototype.setTopicFree = function (topicID) {
	this.connection.query("UPDATE user_ichannel SET user_id = -1 WHERE channel_id =" + topicID, updateCallback);
}

Database.prototype.setUserOnline = function (userID) {
	this.connection.query("UPDATE user_device SET online_status = 1 WHERE user_id =" + userID, updateCallback);
}

Database.prototype.setUserOffline = function (userID) {
	var now = Date.now();
	this.connection.query("UPDATE user_device SET online_status = 0, last_online = " + now + " WHERE user_id =" + userID, updateCallback);
}

Database.prototype.getUserTopic = function(userID, callback) {
	/* Inner join of user_ichannel and IoT_channels */
	var query = "SELECT IoT_channels.topic FROM user_ichannel INNER JOIN IoT_channels ON IoT_channels.id=user_ichannel.channel_id WHERE user_ichannel.user_id =" + userID;
	this.connection.query(query, callback);
}

Database.prototype.getTopicByID = function (topicID, callback) {
	this.connection.query("SELECT topic FROM IoT_channels WHERE id=" + topicID, callback);
}

Database.prototype.getAvailableVChannel = function(callback) {
	var query = "SELECT * FROM video_channels INNER JOIN user_vchannel ON video_channels.id=user_vchannel.channel_id WHERE user_vchannel.user_id=-1 LIMIT 1";
	this.connection.query(query, callback);
}

Database.prototype.setVChannelUser = function (channelID, userID) {
	this.connection.query("UPDATE user_vchannel SET user_id=" + userID + " WHERE channel_id=" + channelID, updateCallback);
}

Database.prototype.setVChannelFree = function (channelID) {
	this.connection.query("UPDATE user_vchannel SET user_id=-1 WHERE channel_id=" + channelID, updateCallback);
}

Database.prototype.getUserVChannel = function (userID, callback) {
	this.connection.query("SELECT channel_id FROM user_vchannel WHERE user_id=" + userID, callback);
}

Database.prototype.close = function () {
	this.connection.end();
}

function updateCallback(error, result) {
		if (error)
			throw error;
}

module.exports = Database;
