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
