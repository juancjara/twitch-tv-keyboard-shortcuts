(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
console.log('twitch shortcuts successfully injected', new Date());

var getPlayer = require('./getPlayer.js');

(function(player){

  var stepSize = 10; //seconds
  var isMuted = false; //assuming stream is not muted at the begining
  var player = player;

  var init = function() {
    initListeners();
  };

  var initListeners = function() {
    var keyEvents = {
      75: playOrPause, //k
      76: moveRight, //l
      74: moveLeft, //j,
      77: toggleSound //m
    };

    var keyUpListener = function(e){
      console.log('key pressed');
      if (e.keyCode in keyEvents) {
        keyEvents[e.keyCode]();
      }
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
        return;
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

},{"./getPlayer.js":1}]},{},[2]);
