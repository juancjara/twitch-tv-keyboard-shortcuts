(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
