var format = function(s, d) {
  for(var p in d)
    s=s.replace(new RegExp('{'+p+'}','g'), d[p]);
  return s;
}

var floatToInt = function(value) {
  return value | 0;
}

var formatSecondsToPath = function(seconds) {
  var h = floatToInt(seconds / 3600)
  var temp = seconds - (h * 3600);
  var m = floatToInt(temp / 60);
  var s = temp - m * 60;

  var template = '{h}h{m}m{s}s';
  return format(template, {h: h, m: m, s: s})
};

var unformatTime = function(data) {
  var numbers = data.substring(3).replace(/[a-zA-Z]/g, ' ').trim()
    .split(' ').map(function(n) {return ~~n});

  var len = numbers.length
  var s = len? numbers[len - 1]: 0;
  var m = len - 2 > -1? numbers[len - 2]: 0;
  var h = len - 3 > -1? numbers[len - 3]: 0; 

  return s + m * 60 + h * 3600;
}


var regexOrigin = /http:\/\/([^\/])*/g;
var regexPathname = /[^?]*/g;
//group as url utils
var getOrigin = function(url) {
  return url.match(regexOrigin)[0];
};

var getPathname = function(url) {
  return url.replace(getOrigin(url), '').match(regexPathname)[0];
};

var getSearchPath = function(url) {
  return url
    .replace(getOrigin(url), '')
    .replace(getPathname(url), '');
}

module.exports = format;
format.format = format;
format.floatToInt = floatToInt;
format.formatSecondsToPath = formatSecondsToPath;
format.unformatTime = unformatTime;
format.getPathname = getPathname;
format.getSearchPath = getSearchPath;
