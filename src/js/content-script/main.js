var Storage = require('../chrome-api/storage');
var constants = require('../constants');
var resumeVideo = require('./resume-video');

console.log('listen past broadcast');
var id = window.location.pathname.split('/').splice(2).join('');

window.onbeforeunload = function() {
  var player = document.querySelectorAll('.ember-view.full object');
    if (player && player.length) {
      player = player[0];
      var obj = {};
      obj[id] = player.getVideoTime();
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
