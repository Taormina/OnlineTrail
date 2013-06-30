var siteList = "";

console.log("Background began");

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
		console.log("Background received message");
		siteList += request.data + "<br>";
});
