(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Storage = {
  property: chrome.storage.local,

  set: function(data, cb) {
    cb = cb || function() {};
    Storage.property.set(data, cb);
  },

  get: function(key, cb) {
    cb = cb || function() {};

    Storage.property.get(key, function(data) {
      var value;
      if (key in data) {value = data[key]}
      else {value = null};
      cb(value);
    });
  }  

};

module.exports = Storage;

},{}],2:[function(require,module,exports){
module.exports = {
  SHOULD_RESUME: 'shoudlResume',
  SHOULD_SAVE: 'shouldSave'
}
},{}],3:[function(require,module,exports){
var Storage = require('../chrome-api/storage');
var constants = require('../constants');
var resumeVideo = require('./resume-video');
var getPlayer = require('../getPlayer');

console.log('listen past broadcast content script loaded');
var id = window.location.pathname.split('/').splice(2).join('');

window.onbeforeunload = function() {
  var player = getPlayer();
  if (player.getTime) {
    var obj = {};
    obj[id] = player.getTime();
    console.log('time', player.getTime());
    chrome.extension.sendMessage(obj);
  }
};

var updateUrl = function(newUrl) {
  if (newUrl) {
    window.location.href = newUrl;
  }
}

Storage.get(constants.SHOULD_RESUME, function(shouldResume) {
  console.log(constants.SHOULD_RESUME, shouldResume)

  if (shouldResume) {
    resumeVideo(window.location.pathname, window.location.search, updateUrl);
  }
})

},{"../chrome-api/storage":1,"../constants":2,"../getPlayer":5,"./resume-video":4}],4:[function(require,module,exports){
var Storage = require('../chrome-api/storage');
var utils = require('../utils');

var templateUrl = 'http://www.twitch.tv{path}?t={time}';

var updateUrl = function(time, pathname, searchPath, cb) {
  
  if (time && 
     (!searchPath || time !== utils.unformatTime(searchPath))) {
    
    return cb(utils.format(templateUrl, 
                        {
                          path: pathname, 
                          time: utils.formatSecondsToPath(time)
                        }));
  }
  return null;
};

var resumeVideo = function(pathname, searchPath, cb) {
  var id = pathname.split('/').splice(2).join('');
  Storage.get(id, function(time) {
    console.log('time', time)
    updateUrl(time, pathname, searchPath, cb)
  });
}

module.exports = resumeVideo;

},{"../chrome-api/storage":1,"../utils":6}],5:[function(require,module,exports){
var getPlayer = function() {
  var videoPlayer = {};
  var player = null;
  player = document.querySelectorAll('.ember-view.full object')[0];

  if (player) {
    videoPlayer.mute = player.mute();
    videoPlayer.unmute = player.unmute();
  } else {
    player = document.querySelector('.player-video object');
    var objVolumen = document.querySelector('.player-volume button');
    var muteUnmute = function() {
      objVolumen.click();
    };
    videoPlayer.mute = muteUnmute;
    videoPlayer.unmute = videoPlayer.mute;
  }

  if (!player) return {};

  videoPlayer.play = player.playVideo;
  videoPlayer.pause = player.pauseVideo;
  videoPlayer.isPaused = player.isPaused;
  videoPlayer.jump = player.videoSeek;
  videoPlayer.getTime = function() {
    return ~~player.getVideoTime();
  }

  return videoPlayer;
};

module.exports = getPlayer;

},{}],6:[function(require,module,exports){
var format = function(s, d) {
  for(var p in d)
    s=s.replace(new RegExp('{'+p+'}','g'), d[p]);
  return s;
}

var argsToArray = function(args) {
  return args = Array.prototype.slice.call(args);
}

var partial = function(fn) {
  var pastArgs = argsToArray(arguments).slice(1);
  return function() {
    var newArgs = argsToArray(arguments);
    return fn.apply(null, pastArgs.concat(newArgs));
  }
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
format.partial = partial;
},{}]},{},[3]);
