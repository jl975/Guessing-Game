var START_GUESSES = 5;
var numTimes = START_GUESSES;

var KEYCODE_ENTER = 13;

var values = {
	"wrapperRGB": [60,255,60,0.2],
	"inputRGB1": [234,255,234,1],
	"inputRGB2": [240,255,240,1],
	"inputRGBb": [119,170,119,1],
	"buttonRGB1": [80,230,80,0.6],
	"buttonRGB2": [70,180,70,0.6],
	"buttonRGBb": [0,136,0,1],
	"buttonRGBt": [34,109,34,1]
};


$(document).ready(function() {
	var theNumber = Math.floor(Math.random()*100) + 1;
	var guesses = [];
	updateNumTimes(START_GUESSES);

	$('.container').hide();
	$('.container').fadeIn(500);

	$('#guessthis').on('click', function() {
		guessThis();
	});
	$(document).keyup(function(e) {
		if (e.keyCode == KEYCODE_ENTER)
			$('#guessthis').click();
	})


	function guessThis() {
		$('#smallHint').hide();
		var guess = +$('input[name=playersGuess]').val();
		if (isNaN(guess) || guess<1 || guess>100)
			display("Invalid input");
		else if (guess != theNumber && !isIn(guess, guesses) && numTimes > 0) {
			judgeNumber(guess);
			guesses.push(guess);
			updateNumTimes(numTimes-1);
		}
		else if (isIn(guess, guesses))
			display("You already tried this number.");
		else if (guess == theNumber) {
			display("You are correct!");
		}
		if (numTimes <= 0) {
			grayscale($('.wrapper'),[255,255,255,1], values.wrapperRGB);
			grayscale($('#things input.rounded'),values.inputRGB1, values.inputRGB2, undefined, values.inputRGBb);
			grayscale($('.btn-block'),[255,255,255,0], values.buttonRGB1, values.buttonRGB2, values.buttonRGBb, values.buttonRGBt);

			display("Better luck next time...");
			$('.container').fadeOut(3000);
		}
		$('input').val('');		
	}

	function display(str) {
		$('#someText').text(str);
	}

	function judgeNumber(num) {
		var diff = Math.abs(theNumber - num);
		var message = "";
		var outcome = "";
		var lastGuess;
		if (guesses.length>0) {
			lastGuess = guesses[guesses.length-1];
			lastDiff = Math.abs(theNumber - lastGuess);
		}
		message += "You are";
		if (diff > 30) {
			outcome = "Ice Cold!";
			if (lastGuess) {
				if (lastDiff > 30) message += " still";
				message += " ICE COLD";
				message += diff < lastDiff ? ", but getting slightly warmer." : ", and getting even colder!";
			}
			else message += " ICE COLD!";
			hotCold('icecold');
		}
		else if (diff <= 30 && diff > 20) {
			outcome = "Cold";
			if (lastGuess) {
				if (lastDiff <= 30 && lastDiff > 20) message += " still";
				message += " cold";
				message += diff < lastDiff ? ", but getting warmer." : ", and getting colder!";
			}
			else message += " cold."
			hotCold('cold');
		}
		else if (diff <= 20 && diff > 10) {
			outcome = "Warm";
			if (lastGuess) {
				if (lastDiff <= 20 && lastDiff > 10) message += " still";
				message += " warm";
				message += diff < lastDiff ? ", but getting warmer." : ", but getting colder.";
			}
			else message += " warm."
			hotCold('warm');
		}
		else if (diff <= 10 && diff > 5) {
			outcome = "Hot";
			if (lastGuess) {
				if (lastDiff <= 10 && lastDiff > 5) message += " still";
				message += " HOT";
				message += diff < lastDiff ? ", and getting hotter!" : ", but getting a bit cooler!";
			}
			else message += " HOT!"
			hotCold('hot');
		}
		else if (diff <= 5) {
			outcome = "Super hot!";
			if (lastGuess) {
				if (lastDiff <= 5) message += " still";
				message += " ON FIRE";
				message += diff < lastDiff ? ", almost there!" : ", but going the wrong way!";
			}
			else message += " ON FIRE!!"
			hotCold('superhot');
		}
		if (theNumber < num) message += " Guess lower.";
		else if (theNumber > num) message += " Guess higher.";
		display(message);
		$('#history').append('<p class="history">'+num+': '+outcome+'</p>');
		$('#history').hide();
	}


	$('#startover').on('click', function() {
		guesses = [];
		updateNumTimes(START_GUESSES);
		$('input').val('');
		$('.othertext').text('');
		theNumber = Math.floor(Math.random()*100) + 1;
		hotCold('warm');

	});

	$('#hint').on('click', function() {
		if (numTimes == START_GUESSES)
			display("Take at least one guess!");
		else {
			$('#smallHint').show();
			$('#smallHint').text('psst...'+theNumber);
		}
	});

	$('#showhistory').on('click', function() {
		if (guesses.length==0)
			display("You have not made any guesses yet");
		else {
			if ($('#history').css('display')=='none') {
				$('#history').slideDown('fast');
				$('#show').text("Hide");
			}
			else if ($('#history').css('display')=='block') {
				$('#history').slideUp('fast');
				$('#show').text("Show");
			}
		}
		$('#smallHint').hide();
	});

	function isIn(element, array) {
		var result = false;
		for (var i=0; i<array.length; i++) {
			if (array[i] == element)
				result = true;
		}
		return result;
	}

	function updateNumTimes(num) {
		numTimes = num;
		$('#guessRemain').text(numTimes);
		if (numTimes==1) $('#plural').hide();
		else $('#plural').show();
	}

	function hotCold(temp) {

		for (var color in values) {
			var red = values[color][0];
			var green = values[color][1];
			var blue = values[color][2];
			var opacity = values[color][3];
			var rgb = [red, green, blue].sort(function(a,b){return b-a});
			function moreIntense() {
				if (opacity==0.6) values[color][3] = 0.8;
				else if (opacity==0.2) values[color][3] = 0.4;
			}
			function lessIntense() {
				if (opacity==0.8) values[color][3] = 0.6;
				else if (opacity==0.4) values[color][3] = 0.2;
			}
			if (temp == 'superhot') {
				values[color][0] = rgb[0];
				values[color][1] = rgb[1]; values[color][2] = rgb[1];
				moreIntense();
			}
			if (temp == 'hot') {
				values[color][0] = rgb[0];
				values[color][1] = rgb[1]; values[color][2] = rgb[1];
				lessIntense();
			}
			else if (temp == 'cold') {
				values[color][2] = rgb[0];
				values[color][0] = rgb[1]; values[color][1] = rgb[1];
				lessIntense();
			}
			else if (temp == 'icecold') {
				values[color][2] = rgb[0];
				values[color][0] = rgb[1]; values[color][1] = rgb[1];
				moreIntense();
			}
			else if (temp == 'warm') {
				values[color][1] = rgb[0];
				values[color][0] = rgb[1]; values[color][2] = rgb[1];
				lessIntense();
			}
		}
		$('.wrapper').css({'background-color': rgba(values.wrapperRGB)});
		$('#things input.rounded').css({
			'background-color': rgba(values.inputRGB1),
			'border-color': rgba(values.inputRGBb)
		});
		$('.btn-block').css({
			'background-color': rgba(values.buttonRGB1),
			'border-color': rgba(values.buttonRGBb),
			'color': rgba(values.buttonRGBt)
		});
	}



	function rgba(r,g,b,a) {
		if (arguments.length==4)
			return "rgba("+r+','+g+','+b+','+a+')';
		else if (arguments.length==1)
			return "rgba(" + r[0]+','+r[1]+','+r[2]+','+r[3]+')';
	}
	function grayscale(element, rgba0, rgba1, rgba2, rgba_border, rgba_text) {
		var parameters = {"element": element};
		var gray0 = Math.floor((rgba0[0]+rgba0[1]+rgba0[2])/3);
		var gray1 = Math.floor((rgba1[0]+rgba1[1]+rgba1[2])/3);
		var gray2;
		if (rgba2) gray2 = Math.floor((rgba2[0]+rgba2[1]+rgba2[2])/3);

		var grad = rgba(gray0,gray0,gray0,rgba0[3])+', '+rgba(gray1,gray1,gray1,rgba1[3]);
		if (gray2) grad += ', '+rgba(gray2,gray2,gray2,rgba2[3]);
		grad += ')';

		parameters["grad"] = grad;
		if (rgba_border) {
			var gray_border = Math.floor((rgba_border[0]+rgba_border[1]+rgba_border[2])/3);
			parameters["border"] = [gray_border,gray_border,gray_border,rgba_border[3]];
		}
		if (rgba_text) {
			var gray_text = Math.floor((rgba_text[0]+rgba_text[1]+rgba_text[2])/3);
			parameters["text"] = [gray_text,gray_text,gray_text,rgba_text[3]];			
		}
		modifyGradient(parameters);
	}

	function modifyGradient(parameters) {
		var element = parameters.element;
		var grad = parameters.grad;
		var border; if (parameters.border) border = parameters.border;
		var text; if (parameters.text) text = parameters.text;
		var css_code = {
			"background": '-webkit-linear-gradient(174deg, '+grad,
			"background": '-o-linear-gradient(174deg, '+grad,
			"background": '-moz-linear-gradient(174deg, '+grad,
			"background": 'linear-gradient(174deg, '+grad
		}
		if (border) {
			css_code["border-color"] = rgba(border[0],border[1],border[2],border[3]);
		}
		if (text) {
			css_code["color"] = rgba(text[0],text[1],text[2],text[3]);			
		}
		element.css(css_code);		
	}

	$('button').on('mouseenter', function() {
		$(this).css({"opacity": '0.8'});
	})
	$('button').on('mouseleave', function() {
		$(this).css({"opacity": '1'});
	})


});