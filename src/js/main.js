var Vue = require('vue/dist/vue.common.js')
var keycode = require('keycode');

var Notification = require('./chrome-api/notification');
var Alarm = require('./chrome-api/alarm');
var Storage = require('./chrome-api/storage');
var constants = require('./constants');
var resumeVideo = require('./content-script/resume-video');

var utils = require('./utils');

Notification.iconUrl = '../images/twitch-128.png';
Notification.title = 'Twitch tv shortcuts';

var persistenceUpdateKey = function (id, keyCode) {
  storageUpdateKey(id, keyCode);

  var payload = {
    id: id,
    keyCode: keyCode,
  };
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.sendMessage(tab.id, {payload: payload});
  })
}

//double loading script
var injectJs = function injectJs() {
  Notification.create({message: 'Script loading'});

  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.executeScript(tab.id, {file:"js/inject.js"}, function(){
      Notification.create({message: 'Script loaded'});
    });
  });
};

var init = function (bindings) {
  new Vue({
    el: '#list-commands',
    data: {
      keyBindings: bindings,
      editIndex: -1,
    },
    created: function () {
      document.addEventListener('keyup', this.handleKeyPressed);
    },
    methods: {
      handleKeyPressed: function (e) {
        if (e.keyCode === 27) {
          return this.cancelEdit();
        }
        this.updateKey(e.keyCode);
      },
      updateKey: function (code) {
        Vue.set(
          this.keyBindings,
          this.editIndex,
          Object.assign(
            {},
            this.keyBindings[this.editIndex], {
              key: keycode(code),
              keyCode: code,
            })
        );
        persistenceUpdateKey(this.keyBindings[this.editIndex].id, code);
        this.cancelEdit();
      },
      editKey: function (index) {
        this.editIndex = index;
      },
      cancelEdit: function() {
        this.editIndex = -1;
      },
      uppercase: function (text) {
        return text.toUpperCase();
      }
    }
  });
}

var storageUpdateKey = function (id, key) {
  Storage.get(KEY, function (data) {
    data[id] = key;
    Storage.set({[KEY]: data});
  });
}

var keyBindings = [
  {
    keyCode: 75,
    key: 'K',
    desc: 'Play or Pause',
    id: 'play'
  }, {
    keyCode: 76,
    key: 'L',
    desc: 'Forward 10 seconds',
    id: 'right'
  }, {
    keyCode: 74,
    key: 'J',
    desc: 'Rewind 10 seconds',
    id: 'left'
  }, {
    keyCode: 77,
    key: 'M',
    desc: 'Mute or Unmute',
    id: 'mute'
  }
];


var KEY = 'TWITCH_KEYS';

var handleStoredKeys = function (data) {
  if (!data) {
    var initialData = {
      play: 75,
      right: 76,
      left: 74,
      mute: 77,
    };
    return Storage.set({[KEY]: initialData}, function () {
      init(keyBindings);
    })
  }

  keyBindings = keyBindings.map(function (item) {
    return Object.assign(
      {},
      item,
      {
        key: keycode(data[item.id]),
        keyCode: data[item.id],
      }
    );
  })
  init(keyBindings);
}

document.getElementById("inject")
   .addEventListener("click", injectJs);

Storage.get(KEY, handleStoredKeys);
