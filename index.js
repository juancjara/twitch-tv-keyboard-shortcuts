//webapps.stackexchange.com/questions/25419/youtube-keyboard-shortcuts
var stepSize = 10; //seconds
var isMuted = false; //assuming stream is not muted at the begining
var player;

var init = function() {
  player = $('.ember-view.full object')[0];
  initListeners();
};

var initListeners = function() {
  var keyEvents = {
    75: playOrPause, //k
    76: moveRight, //l
    74: moveLeft, //j,
    77: toggleSound //m
  };

  $(document).keydown(function(e) {
    if (e.which in keyEvents) {
      keyEvents[e.which]();
    }
  });
};

var toggleSound = function() {
  isMuted = !isMuted;
  isMuted ? unmute(): mute();
};

var mute = function() {player.mute()};
var unmute = function() {player.unmute();}

var playOrPause = function() {
  player.isPaused() ? play(): pause();
};

var play = function() {
  player.playVideo();
};

var pause = function() {
  player.pauseVideo();
};

var move = function(steps) {
  return function() {
    var actualTime = player.getVideoTime();
    var jumpTo = actualTime + steps;
    if (jumpTo < 0) {jumpTo = 0};
    player.videoSeek(jumpTo);
  } 
};

var moveRight = move(stepSize);
var moveLeft = move(-stepSize);

init();
