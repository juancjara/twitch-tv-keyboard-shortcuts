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

var toggleChecked = function(key, e) {
  console.log('toggleChecked');
  var obj = {}; obj[key] = e.target.checked;
  Storage.set(obj);
}

var list = document.getElementById('list-commands');
var autoResume = document.getElementById('autoResume');
var autoSave = document.getElementById('autoSave');

var updateUrl = function(newUrl) {
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
  
  autoResume.addEventListener('click', utils.partial(toggleChecked,
                                                     constants.SHOULD_RESUME));
  autoSave.addEventListener('click', utils.partial(toggleChecked,
                                                     constants.SHOULD_SAVE));

}

var updateCheckbox = function(field, checked) {
  field.checked = checked;
};

var init = function() {
  data.forEach(function(e) {
    var li = document.createElement('li');
 
    li.innerHTML = utils.format(elemTemplate, e);
    list.appendChild(li);
  });

  Storage.get(constants.SHOULD_RESUME, utils.partial(updateCheckbox, autoResume));
  Storage.get(constants.SHOULD_SAVE, utils.partial(updateCheckbox, autoSave));

  initEvents();
}

init();