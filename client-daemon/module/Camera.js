var exec = require('child_process').exec;

function Camera() {
	this.pid = "";
}

Camera.prototype.start = function(feedUrl) {
	exec('ffmpeg -f v4l2 -vcodec mjpeg -r 10 -s 640x480 -i /dev/video0 ' + feedUrl, function(err, stdout, stderr) {
		console.log("ffmpeg close");
	});
}

Camera.prototype.close = function() {
	exec('pgrep -f ffmpeg', function(err, stdout, stderr) {
		this.pid = parseInt(stdout.split('\n')[1]);
		exec('kill ' + this.pid, function(err, stdout, stderr) {
			console.log("killed mpeg (process " + this.pid + ")");
		});
	});
}

module.exports = Camera;
