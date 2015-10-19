(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Alarm = {
  actions: {},

  create: function(name, alarmInfo, fn) {
    chrome.alarms.create(name, alarmInfo);
    Alarm.actions[name] = fn;
  },

  listenAll: function() {
    chrome.alarms.onAlarm.addListener(function(elem) {
      Alarm.actions[elem.name]();
    });
  },

  clearAll: function(cb) {
    chrome.alarms.clearAll(cb);
  }

}

module.exports = Alarm;

},{}],2:[function(require,module,exports){
var Notification = {
  iconUrl: '../images/default-128.png',
  title: 'Set a title',
  type: 'basic',

  create: function(data, cb) {
    data = data || {};
    cb = cb || function() {};
    var id = '' + (new Date()).getTime();

    chrome.notifications.create(id, {
      type: data.type || Notification.type,
      iconUrl: data.icon || Notification.iconUrl,
      title: data.title || Notification.title, 
      message: data.message || ''
    }, cb);
  }
}

module.exports = Notification;
},{}],3:[function(require,module,exports){
var Storage = {
  property: chrome.storage.local,

  set: function(data, cb) {
    cb = cb || function() {};
    Storage.property.set(data, cb);
  },

  get: function(key, cb) {
    cb = cb || function() {};

    Storage.property.get(key, function(data) {
      var value;
      if (key in data) {value = data[key]}
      else {value = null};
      cb(value);
    });
  }  

};

module.exports = Storage;

},{}],4:[function(require,module,exports){
module.exports = {
  SHOULD_RESUME: 'shoudlResume',
  SHOULD_SAVE: 'shouldSave'
}
},{}],5:[function(require,module,exports){
var Storage = require('../chrome-api/storage');
var utils = require('../utils');

var templateUrl = 'http://www.twitch.tv{path}?t={time}';

var updateUrl = function(time, pathname, searchPath, cb) {
  
  if (time && 
     (!searchPath || time !== utils.unformatTime(searchPath))) {
    
    return cb(utils.format(templateUrl, 
                        {
                          path: pathname, 
                          time: utils.formatSecondsToPath(time)
                        }));
  }
  return null;
};

var resumeVideo = function(pathname, searchPath, cb) {
  var id = pathname.split('/').splice(2).join('');
  Storage.get(id, function(time) {
    console.log('time', time)
    updateUrl(time, pathname, searchPath, cb)
  });
}

module.exports = resumeVideo;

},{"../chrome-api/storage":3,"../utils":7}],6:[function(require,module,exports){
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
  {key: 'J', description: 'Rewind 10 seconds'},
  {key: 'L', description: 'Forward 10 seconds'},
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

},{"./chrome-api/alarm":1,"./chrome-api/notification":2,"./chrome-api/storage":3,"./constants":4,"./content-script/resume-video":5,"./utils":7}],7:[function(require,module,exports){
var format = function(s, d) {
  for(var p in d)
    s=s.replace(new RegExp('{'+p+'}','g'), d[p]);
  return s;
}

var argsToArray = function(args) {
  return args = Array.prototype.slice.call(args);
}

var partial = function(fn) {
  var pastArgs = argsToArray(arguments).slice(1);
  return function() {
    var newArgs = argsToArray(arguments);
    return fn.apply(null, pastArgs.concat(newArgs));
  }
}

var floatToInt = function(value) {
  return value | 0;
}

var formatSecondsToPath = function(seconds) {
  var h = floatToInt(seconds / 3600)
  var temp = seconds - (h * 3600);
  var m = floatToInt(temp / 60);
  var s = temp - m * 60;

  var template = '{h}h{m}m{s}s';
  return format(template, {h: h, m: m, s: s})
};

var unformatTime = function(data) {
  var numbers = data.substring(3).replace(/[a-zA-Z]/g, ' ').trim()
    .split(' ').map(function(n) {return ~~n});

  var len = numbers.length
  var s = len? numbers[len - 1]: 0;
  var m = len - 2 > -1? numbers[len - 2]: 0;
  var h = len - 3 > -1? numbers[len - 3]: 0; 

  return s + m * 60 + h * 3600;
}


var regexOrigin = /http:\/\/([^\/])*/g;
var regexPathname = /[^?]*/g;
//group as url utils
var getOrigin = function(url) {
  return url.match(regexOrigin)[0];
};

var getPathname = function(url) {
  return url.replace(getOrigin(url), '').match(regexPathname)[0];
};

var getSearchPath = function(url) {
  return url
    .replace(getOrigin(url), '')
    .replace(getPathname(url), '');
}

module.exports = format;
format.format = format;
format.floatToInt = floatToInt;
format.formatSecondsToPath = formatSecondsToPath;
format.unformatTime = unformatTime;
format.getPathname = getPathname;
format.getSearchPath = getSearchPath;
format.partial = partial;
},{}]},{},[6]);
