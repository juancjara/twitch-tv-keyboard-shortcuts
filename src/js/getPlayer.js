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
