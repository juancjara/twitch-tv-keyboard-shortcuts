var Notification = require('./chrome-api/notification');
var Alarm = require('./chrome-api/alarm');
var Storage = require('./chrome-api/storage');
var constants = require('./constants');
var resumeVideo = require('./content-script/resume-video');

var utils = require('./utils');

Notification.iconUrl = '../images/twitch-128.png';
Notification.title = 'Twitch tv shortcuts';

var elemTemplate = '{key} - {description}';

//double loading script
var injectJs = function injectJs() {
  Notification.create({message: 'Script loading'});
  
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.executeScript(null, {file:"js/inject.js"}, function(){
      Notification.create({message: 'Script loaded'});
    });
    
  });
};

var data = [
  {key: 'K', description: 'Play or Pause'},
  {key: 'L', description: 'Rewind 10 seconds'},
  {key: 'J', description: 'Forward 10 seconds'},
  {key: 'M', description: 'Mute or unmute'}
];

var toggleChecked = function(e) {
  var obj = {}; obj[constants.SHOULD_RESUME] = e.target.checked;
  Storage.set(obj);
}

var list = document.getElementById('list-commands');
var autoResume = document.getElementById('autoResume');

var updateUrl = function(newUrl) {
  console.log('newUrl', newUrl);
  if (newUrl) {
    chrome.tabs.update(null, {url: newUrl});
  }
}

var initEvents = function() {

  document.getElementById('resume')
    .addEventListener('click', function() {
      
      chrome.tabs.getSelected(null, function(tab) {  
        
        resumeVideo(utils.getPathname(tab.url), utils.getSearchPath(tab.url),
                    updateUrl);
        
      });

    });

  document.getElementById("inject")
    .addEventListener("click", injectJs);
  
  autoResume.addEventListener('click', toggleChecked);
}

var init = function() {
  data.forEach(function(e) {
    var li = document.createElement('li');
 
    li.innerHTML = utils.format(elemTemplate, e);
    list.appendChild(li);
  });

  Storage.get(constants.SHOULD_RESUME, function(shouldResume) {
    autoResume.checked = shouldResume;
  })

  initEvents();
}

init();