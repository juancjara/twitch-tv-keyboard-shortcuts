function t(s,d){
  for(var p in d)
    s=s.replace(new RegExp('{'+p+'}','g'), d[p]);
  return s;
}

var elemTemplate = '{key} - {description}';

var Notification = {
  iconUrl: 'twitch-128.png',
  title: 'Twitch tv shortcuts',

  create: function(data) {
    data = data || {};
    var id = '' + (new Date()).getTime();
    chrome.notifications.create(id, {
      type: 'basic',
      iconUrl: data.icon || Notification.iconUrl,
      title: data.title || Notification.title, 
      message: data.message
    }, function() {});
  }
}

//double loading script
var injectJs = function injectJs() {
  Notification.create({message: 'Script loading'});
  
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.executeScript(null, {file:"injectKeys.js"}, function(){
      Notification.create({message: 'Script loaded'});
    });
    
  });
};

var data = [
  {key: 'K', description: 'Play or Pause'},
  {key: 'L', description: 'Rewind 10 seconds'},
  {key: 'J', description: 'Forward 10 seconds'},
  {key: 'M', description: 'Mute or unmute'}
]

var init = function() {
  var list = document.getElementById('list-commands');
  data.forEach(function(e) {
    var li = document.createElement('li');
    li.innerHTML = t(elemTemplate, e);
    list.appendChild(li);
  });

  document.getElementById("btn")
    .addEventListener("click", injectJs);

}

init();