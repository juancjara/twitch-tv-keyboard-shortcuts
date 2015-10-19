(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Storage = require('../chrome-api/storage');
var constants = require('../constants');

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    Storage.get(constants.SHOULD_SAVE, function(shouldSave) {
      Storage.set(request, function()
        {
          console.log('last state saved');
        });
    });
  }
);

var initValue = function(key, defaultVal) {
  Storage.get(key, function(data) {
    if (data === null) {
      var obj = {};
      obj[key] = defaultVal;
      Storage.set(obj, function() {console.log('done')});
    }
  })
};

var initFirstTime = function() {
  initValue(constants.SHOULD_RESUME, true);
  initValue(constants.SHOULD_SAVE, true);
};

initFirstTime();

},{"../chrome-api/storage":2,"../constants":3}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
module.exports = {
  SHOULD_RESUME: 'shoudlResume',
  SHOULD_SAVE: 'shouldSave'
}
},{}]},{},[1]);
