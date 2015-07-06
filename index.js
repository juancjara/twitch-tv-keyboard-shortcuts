var stepSize = 10; //seconds
var accSteps = 0;
var pauseAt = 0;
var startTime = 0;
var player;

var init = function() {
  player = $('.ember-view.full object')[0];
  player.videoSeek(0);
  play();
};

var playOrPause = function() {
  player.isPaused() ? play(): pause();
}

var play = function() {
  accSteps = 0;
  startTime = new Date().getTime() - (pauseAt - startTime);
  console.log((new Date().getTime() - startTime)/1000 );
  player.playVideo();
};

var pause = function() {
  pauseAt = new Date().getTime() + accSteps *1000;
  console.log((pauseAt - startTime)/1000)
  player.pauseVideo();
};

var move = function(steps) {
  return function() {
    if (player.isPaused()) {
      return;
    }
    var now = new Date().getTime();
    var jump = Math.round((now - startTime)/1000) + accSteps + steps;
    console.log(jump);
    accSteps += steps;
    player.videoSeek(jump);
  } 
};

var moveRight = move(stepSize);
var moveLeft = move(-stepSize);

init();