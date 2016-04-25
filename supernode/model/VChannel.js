function VChannel(id, feedUrl, streamUrl, filename = null) {
	this.id = id;
	this.feedUrl = feedUrl;
	this.streamUrl = streamUrl;
	this.filename = filename;
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

module.exports = VChannel;
