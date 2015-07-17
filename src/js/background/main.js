var Storage = require('../chrome-api/storage');
var constants = require('../constants');

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(request);
    Storage.set(request);
  }
);

var initFirstTime = function() {
  Storage.get(constants.SHOULD_RESUME, function(data) {
    console.log('looking for', data);
    if (data === null) {
      var obj = {};
      obj[constants.SHOULD_RESUME] = true; 
      Storage.set(obj, function() {console.log('done');});
    }
  })
};

initFirstTime();