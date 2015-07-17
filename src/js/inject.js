console.log('twitch shortcuts successfully injected', new Date());
//webapps.stackexchange.com/questions/25419/youtube-keyboard-shortcuts

(function(){

  var stepSize = 10; //seconds
  var isMuted = false; //assuming stream is not muted at the begining
  var player;

  var init = function() {
    player = document.querySelectorAll('.ember-view.full object')[0];
    player.unmute();
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
    player.isPaused() ? player.playVideo(): player.pauseVideo();
  };

  var move = function(steps) {
    return function() {
      if (player.isPaused()) {
        return;
      }
      var jumpTo = player.getVideoTime() + steps;
      if (jumpTo < 0) {jumpTo = 0};
      player.videoSeek(jumpTo);
    } 
  };

  var moveRight = move(stepSize);
  var moveLeft = move(-stepSize);

  init();

})();