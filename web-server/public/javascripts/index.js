$(document).ready(function() {

	$('.ui.checkbox').checkbox();

	$('#lightCheck').click(function() {
		if($('#lightSliderGroup').hasClass('disabled')) {
			lightXHR("#light-switch", $("#red-light").val(), $("#green-light").val(), $("#blue-light").val());
			$('#lightSliderGroup').removeClass('disabled');
		} else {
			lightXHR("#light-switch", 0, 0, 0);
			$('#lightSliderGroup').addClass('disabled');
		}
	});

	$("#light-btn").click(function() {
		var red = $("#red-light").val();
		var green = $("#green-light").val();
		var blue = $("#blue-light").val();
		lightXHR("#light-btn", red, green, blue);
	});

	$("#feed-btn").click(function() {
		var angle = $("#angle").val();
		var times = $("#times").val();
		feedXHR(angle, times);
	});

	$('#stream-switch').click(function() {
		if ($(this).hasClass("checked")) {
			streamOn();
		}
	});
});

function streamOn() {
	streamOnXHR();
}

function streamOnXHR() {
	$.ajax({
		url: "/streamon",
		type: "POST",
		data: null,
		success: function(data) {
			if (data != "BUSY") {
				clearScreenBox();
				appendStreamVideo(data);
			}
		},
		error: function(xhr, status, err) {
			console.log("streamOnXHR error stats:" + status + ", err: " + err);
		}
	});
}

function appendStreamVideo(src) {
	var video = $('<video />', {
		src: src,
		type: 'video/webm',
		width: '100%',
		height: '100%',
		autoplay: true 
	});
	video.appendTo($("#screen-box"));
}

function clearScreenBox() {
	$("#screen-box").empty();
}

function appendPoster() {
	var video = $('<video />', {
		src: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/1/13/Neon_tetra_%28Paracheirodon_innesi%29_in_an_aquarium.webm/Neon_tetra_%28Paracheirodon_innesi%29_in_an_aquarium.webm.480p.webm',
		type: 'video/webm',
		width: '100%',
		height: '100%'
	});
	video.appendTo($("#screen-box"));
}

function lightXHR(trigger, red, green, blue) {
	if (trigger == "#light-btn") {
		btnLoading(trigger);
	}
	$.ajax({
		url: "/streamon",
		type: "POST",
		data: null,
		success: function(data) {
			if (trigger == "light-btn") {
				btnStopLoading(trigger);
			}
		},
		error: function(xhr, status, err) {
			console.log("streamOnXHR error stats:" + status + ", err: " + err);
		}
	});
}

function feedXHR(angle, times) {
	btnLoading("#feed-btn");
	$.ajax({
		url: "/feed",
		type: "POST",
		data: {
			angle: angle,
			times: times
		},
		success: function(data){
			btnStopLoading("#feed-btn");
		},
		error: function(xhr, status, err) {
			console.log("feedXHR error stats:" + status + ", err: " + err);
		}
	});
}

function btnLoading(btn) {
	$(btn).addClass("loading");
}

function btnStopLoading(btn) {
	$(btn).addClass("loading");
}
