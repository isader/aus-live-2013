/******************************************************************************
 * General function
 *******************************************************************************/
if( typeof console == "undefined") {
	this.console = {
		log : function() {
		}
	};
};
String.prototype.toProperCase = function() {
	return this.replace(/\w\S*/g, function(txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
};
String.prototype.addLinks = function() {
	var regEx = new RegExp(/^http/);
	var words = this.split(' ');
	for(var i = 0; i < words.length; i++) {
		var isLink = false;
		words[i].replace(regEx, function(txt) {
			isLink = true;
		});
		if(isLink) {
			words[i] = '<a href="' + words[i] + '">' + words[i] + '</a>'
		}
	}
	return words.join(' ');
}
// Tool function to create a request string
String.prototype.toQueryString = function() {
	var parts = [];
	for(var each in this)
	if(this.hasOwnProperty(each)) {
		parts.push(encodeURIComponent(each) + '=' + encodeURIComponent(this[each]));
	}
	return parts.join('&');
};
function DateExt() {
}

Number.prototype.padZero = function(len) {
	var s = String(this), c = '0';
	len = len || 2;
	while(s.length < len)
	s = c + s;
	return s;
}

DateExt.prototype.stringToDate = function(dateStr) {
	var dateArray = dateStr.split('-');
	return new Date(Number(dateArray[0]), Number(dateArray[1]), Number(dateArray[2]));
};

DateExt.prototype.dateToString = function(date) {
	this.daysOfTheWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	this.monthsOfTheYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var dateStr = this.daysOfTheWeek[date.getDay()] + ', ' + this.monthsOfTheYear[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear()
	return dateStr;
};

DateExt.prototype.dateDiiference = function(earlierDate, laterDate) {
	var nTotalDiff = laterDate.getTime() - earlierDate.getTime();
	var oDiff = new Object();
	oDiff.minutesFull = Math.floor(nTotalDiff / 1000 / 60);
	
	
	oDiff.days = Math.floor(nTotalDiff / 1000 / 60 / 60 / 24);
	nTotalDiff -= oDiff.days * 1000 * 60 * 60 * 24;

	oDiff.hours = Math.floor(nTotalDiff / 1000 / 60 / 60);
	nTotalDiff -= oDiff.hours * 1000 * 60 * 60;

	oDiff.minutes = Math.floor(nTotalDiff / 1000 / 60);
	
	nTotalDiff -= oDiff.minutes * 1000 * 60;
	
	oDiff.seconds = Math.floor(nTotalDiff / 1000);

	return oDiff;

}
DateExt.prototype.formatDateToHours = function (rowDate) {
	var timestamp = new Date(rowDate),
		hours = timestamp.getHours() + 1,
		minutes = timestamp.getMinutes(),
		ampm = (hours > 12) ? "PM" : "AM";

	hours = (hours > 12) ? hours - 12 : hours;

	return hours + ':' + minutes + ampm;
};
var dateExt = new DateExt();

function ColourExt() {
}

ColourExt.prototype.hex = function(c) {
	var s = "0123456789abcdef";
	var i = parseInt(c);
	if(i == 0 || isNaN(c))
		return "00";
	i = Math.round(Math.min(Math.max(0, i), 255));
	return s.charAt((i - i % 16) / 16) + s.charAt(i % 16);
}
/* Convert an RGB triplet to a hex string */
ColourExt.prototype.convertToHex = function(rgb) {
	return this.hex(rgb[0]) + this.hex(rgb[1]) + this.hex(rgb[2]);
}
/* Remove '#' in color hex string */
ColourExt.prototype.trimHash = function(s) {
	return (s.charAt(0) == '#') ? s.substring(1, 7) : s;
}
/* Convert a hex string to an RGB triplet */
ColourExt.prototype.convertToRGB = function(hex) {
	var color = [];
	color[0] = parseInt((this.trimHash(hex)).substring(0, 2), 16);
	color[1] = parseInt((this.trimHash(hex)).substring(2, 4), 16);
	color[2] = parseInt((this.trimHash(hex)).substring(4, 6), 16);
	return color;
}
// @format (hex|rgb|null) : Format to return, default is integer
ColourExt.prototype.randomColor = function() {
	return Math.round(0xffffff * Math.random()).toString(16);
}
/**
 * Converts a hex number back to an integer, uses the javascript parseInt method
 * with a base number (or radix) of 16. EG: parseInt("0x" + hex);
 *
 * @param {String} hex The hex code to convert
 * @returns {Integer} The integer conversion of the hex number
 */
ColourExt.prototype.hexToInt = function(hex) {
	return parseInt("0x" + hex);
}
ColourExt.prototype.hsvToRgb = function(h, s, v) {
	var s = s / 100, v = v / 100;
	var hi = Math.floor((h / 60) % 6);
	var f = (h / 60) - hi;
	var p = v * (1 - s);
	var q = v * (1 - f * s);
	var t = v * (1 - (1 - f) * s);
	var rgb = [];
	switch (hi) {
		case 0:
			rgb = [v, t, p];
			break;
		case 1:
			rgb = [q, v, p];
			break;
		case 2:
			rgb = [p, v, t];
			break;
		case 3:
			rgb = [p, q, v];
			break;
		case 4:
			rgb = [t, p, v];
			break;
		case 5:
			rgb = [v, p, q];
			break;
	}
	var r = Math.min(255, Math.round(rgb[0] * 256)), g = Math.min(255, Math.round(rgb[1] * 256)), b = Math.min(255, Math.round(rgb[2] * 256));
	return [r, g, b];

}
/**
 * Given to colours and the percent you want to be between them will return you a colour
 */
ColourExt.prototype.getPointInFade = function(startColour, endColour, perecent) {

	var start = this.convertToRGB(startColour);
	var end = this.convertToRGB(endColour);
	var c = [];
	c[0] = start[0] * perecent + (1 - perecent) * end[0];
	c[1] = start[1] * perecent + (1 - perecent) * end[1];
	c[2] = start[2] * perecent + (1 - perecent) * end[2];
	return this.convertToHex(c);
}
function NumberExt() {
}

NumberExt.prototype.addCommas = function(nStr) {
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while(rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}
NumberExt.prototype.addDot = function(nStr) {
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while(rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + '.' + '$2');
	}
	return x1 + x2;
}
var numberExt = new NumberExt();

function MathExt() {
}

MathExt.prototype.roundNumber = function(num, dec) {
	var result = Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
	return result;
}
var mathExt = new MathExt()

function LocationExt() {
}

LocationExt.prototype.getQuerystring = function(key, default_) {
	if(default_ == null)
		default_ = "";
	key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
	var qs = regex.exec(window.location.href);
	if(qs == null)
		return default_;
	else
		return qs[1];
}
var locationExt = new LocationExt()

var CookieExt = function() {

}

CookieExt.prototype.createCookie = function(name, value, hours) {
	if(hours) {
		var now = new Date();
		var hrs = now.getHours();
		hrs += hours
		var res = now.setHours(hrs);
		var expires = "; expires=" + now.toGMTString();
	} else {
		var expires = "";
	}
	document.cookie = name + "=" + value + expires + "; path=/";
}

CookieExt.prototype.readCookie = function(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while(c.charAt(0) == ' ')
		c = c.substring(1, c.length);
		if(c.indexOf(nameEQ) == 0)
			return c.substring(nameEQ.length, c.length);
	}
	return null;
}

CookieExt.prototype.eraseCookie = function(name) {
	createCookie(name, "", -1);
}
var cookieExt = new CookieExt();

function ValidationExt() {
}

ValidationExt.prototype.required = function($str) {
	if($str == null || $str == '') {
		return false;
	}
	return true;
}

ValidationExt.prototype.isDate = function($dateStr) {
	if($dateStr.match(/^[0-9]{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])/)) {
		return true;
	} else {
		return false;
	}

}
var validationExt = new ValidationExt();

function TableExt() {
}

TableExt.prototype.sortFunc = function(list, column, direction) {
	if(isNaN(list[0][column])) {

		if(direction == 'Up') {
			return function(a, b) {
				var A = b[column].toLowerCase();
				var B = a[column].toLowerCase();
				if(A < B) {
					return -1;
				} else if(A > B) {
					return 1;
				} else {
					return 0;
				}
			}
		} else {
			return function(a, b) {
				var B = b[column].toLowerCase();
				var A = a[column].toLowerCase();
				if(A < B) {
					return -1;
				} else if(A > B) {
					return 1;
				} else {
					return 0;
				}
			}
		}
	} else {

		if(direction == 'Up') {
			return function(a, b) {
				return Number(b[column]) - Number(a[column]);
			}
		} else {
			return function(a, b) {
				return Number(a[column]) - Number(b[column]);
			}
		}
	}
}
var tableExt = new TableExt();

function findState(postcode) {
	var ranges = {
		'NSW':[
			1000, 1999,
			2000, 2599,
			2619, 2898,
			2921, 2999
		],
		'ACT':[
			200, 299,
			2600, 2618,
			2900, 2920
		],
		'VIC':[
			3000, 3999,
			8000, 8999
		],
		'QLD':[
			4000, 4999,
			9000, 9999
		],
		'SA':[
			5000, 5999
		],
		'WA':[
			6000, 6797,
			6800, 6999
		],
		'TAS':[
			7000, 7999
		],
		'NT':[
			800, 999
		]
	},
	exceptions = {
		872: 'NT',
		2540: 'NSW',
		2611: 'ACT',
		2620: 'NSW',
		3500: 'VIC',
		3585: 'VIC',
		3586: 'VIC',
		3644: 'VIC',
		3707: 'VIC',
		2899: 'NSW',
		6798: 'WA',
		6799: 'WA',
		7151: 'TAS'
	};

	$postcode = parseInt(postcode);
	if (exceptions[postcode]) {
		return exceptions[postcode];
	}

	for(var i in ranges) {
		c = ranges[i].length;
		for (var j = 0; j < c; j += 2) {
			var min = ranges[i][j];
			var max = ranges[i][j+1];
			if (postcode >= min && postcode <= max) {
				return i;
			}
		}
	}
	return null;
}

function partyShortCode (name) {
	switch (name) {
		case "Labor":
			return "ALP";
			break;
		case "Liberal":
			return "LP";
			break;
		case "The Greens":
			return "GRN";
			break;
		case "": 
			return "IND";
			break;
		default: 
			return "ZZZ";
			break;
	}
}

function formatNumber (number) {
	return Math.round( number * 10 ) / 10
}




