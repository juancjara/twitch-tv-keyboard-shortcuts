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
