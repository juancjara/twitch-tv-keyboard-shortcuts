var Storage = require('../chrome-api/storage');
var constants = require('../constants');

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(request);
    Storage.get(constants.SHOULD_SAVE, function(shouldSave) {
      console.log('SHOULD_SAVE', shouldSave);
      Storage.set(request);
    });
    
  }
);

var initValue = function(key, defaultVal) {
  Storage.get(key, function(data) {
    console.log('val', data);
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