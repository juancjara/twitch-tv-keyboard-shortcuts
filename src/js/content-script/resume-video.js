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