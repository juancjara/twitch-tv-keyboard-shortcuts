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
