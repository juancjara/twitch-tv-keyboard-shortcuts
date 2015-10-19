var Storage = require('../chrome-api/storage');
var constants = require('../constants');
var resumeVideo = require('./resume-video');
var getPlayer = require('../getPlayer');

console.log('listen past broadcast content script loaded');
var id = window.location.pathname.split('/').splice(2).join('');

window.onbeforeunload = function() {
  var player = getPlayer();
  if (player.getTime) {
    var obj = {};
    obj[id] = player.getTime();
    console.log('time', player.getTime());
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
