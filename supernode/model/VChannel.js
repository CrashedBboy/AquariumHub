function VChannel(id, feedUrl, streamUrl) {
	this.id = id;
	this.feedUrl = feedUrl;
	this.streamUrl = streamUrl;
	this.filename = null;
}

VChannel.prototype.getStreamUrl = function() {
	return this.streamUrl;
}

VChannel.prototype.getFeedUrl = function() {
	return this.feedUrl;
}

VChannel.prototype.getID = function() {
	return this.is;
}

VChannel.prototype.getFileName = function() {
	return this.filename;
}

VChannel.prototype.setFileName = function(filename) {
	this.filename = filename;
}

module.exports = VChannel;
