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
var getHtml5PlayerMethods = function (player) {
  return {
    play: player.play.bind(player),
    pause: player.pause.bind(player),
    isPaused: function () {
      return player.paused;
    },
    getTime: function () {
      return player.currentTime;
    },
    jump: function (nextTime) {
      player.currentTime = nextTime;
    },
  };
}

var getFlashPlayerMethods = function (player) {
  return {
    play: player.playVideo,
    pause: player.pauseVideo,
    isPaused: function () {
      return !player.isPaused();
    },
    jump: player.videoSeek,
    getTime: function() {
      return ~~player.getVideoTime();
    },
  };
}

var getPlayerMethods = {
  'html5': getHtml5PlayerMethods,
  'flash': getFlashPlayerMethods,
};

var getPlayer = function() {
  var html5Player = document.querySelector('.player-video video');
  var flashPlayer = document.querySelector('.player-video object');

  if (!flashPlayer && !html5Player) {
    return {}
  }

  var player = html5Player || flashPlayer;
  var playerType;
  if (html5Player) {
    playerType = 'html5';
  } else {
    playerType = 'flash';
  }

  var objVolume = document.querySelector('.player-volume button');
  var toggleVolume = objVolume.click.bind(objVolume);
  var volumenMethods = {
    mute: toggleVolume,
    unmute: toggleVolume,
  };

  return Object.assign(
    {},
    volumenMethods,
    getPlayerMethods[playerType](player)
  );
};

module.exports = getPlayer;

},{}],3:[function(require,module,exports){
console.log('twitch shortcuts successfully injected', new Date());

var getPlayer = require('./getPlayer.js');

var Storage = require('./chrome-api/storage');
//TODO: refactor storage

(function(player){

  var stepSize = 10; //seconds
  var isMuted = false; //assuming stream is not muted at the begining
  var player = player;
  var keyEvents = {};

  var init = function() {
    keyEvents = {
      play: {
        key: 75,
        cb: playOrPause,
      },
      right: {
        key: 76,
        cb: moveRight,
      },
      left: {
        key: 74,
        cb: moveLeft,
      },
      mute: {
        key: 77,
        cb: toggleSound,
      }
    };

    var receiveMessage = function (message) {
      keyEvents[message.payload.id].key = message.payload.keyCode;
    }
    Storage.get('TWITCH_KEYS', function(savedBindings) {
      Object.keys(savedBindings).forEach(function (k) {
        keyEvents[k].key = savedBindings[k];
      });
      chrome.runtime.onMessage.addListener(receiveMessage);
    })
    initListeners();
  };

  var initListeners = function() {

    var keyUpListener = function(e){
      var tagName = e.target.tagName;
      if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
        return false;
      }

      console.log('key pressed');
      var match = Object.keys(keyEvents).forEach(function (k) {
        if (keyEvents[k].key === e.keyCode) {
          keyEvents[k].cb();
        }
      })
    };
    document.addEventListener('keyup', keyUpListener);
  };

  var toggleSound = function() {
    isMuted ? player.unmute(): player.mute();
    isMuted = !isMuted;
  };

  var playOrPause = function() {
    player.isPaused() ? player.play(): player.pause();
  };

  var move = function(steps) {
    return function() {
      if (player.isPaused()) {
        return  ;
      }
      var nextTime = player.getTime() + steps;
      if (nextTime < 0) {
        nextTime = 0
      };
      player.jump(nextTime);
    }
  };

  var moveRight = move(stepSize);
  var moveLeft = move(-stepSize);

  init();

})(getPlayer());

},{"./chrome-api/storage":1,"./getPlayer.js":2}]},{},[3]);
