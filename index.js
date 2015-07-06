var injectJs = function injectJs() {
  chrome.tabs.getSelected(null, function(tab) {
  chrome.tabs.executeScript(null, {file:"injectKeys.js"});
  });
};

document.getElementById("btn")
  .addEventListener("click", injectJs);
