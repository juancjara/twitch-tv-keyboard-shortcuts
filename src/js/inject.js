console.log('twitch shortcuts successfully injected', new Date());

var getPlayer = function() {
  var videoPlayer = {};
  var player = null;
  player = document.querySelectorAll('.ember-view.full object')[0];

  if (player) {
    console.log('if');
    videoPlayer.mute = player.mute();
    videoPlayer.unmute = player.unmute();
  } else {
    console.log('else');
    player = document.querySelector('.player-video object');
    var objVolumen = document.querySelector('.player-volume button');
    var muteUnmute = function() {
      objVolumen.click();
    };
    videoPlayer.mute = muteUnmute;
    videoPlayer.unmute = videoPlayer.mute;
  }

  videoPlayer.play = player.playVideo;
  videoPlayer.pause = player.pauseVideo;
  videoPlayer.isPaused = player.isPaused;
  videoPlayer.getTime = player.getVideoTime;
  videoPlayer.jump = player.videoSeek;

  return videoPlayer;
};

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
