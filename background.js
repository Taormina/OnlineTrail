function urlDomain(data) {
  var a = document.createElement('a');
  a.href = data;
  return a.hostname;
}

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (localStorage.lastActive != undefined) {
			if (localStorage.siteList != undefined) {
				localStorage.siteList += localStorage.lastActive + "," + request.data + '\n';
			} else {
				localStorage.siteList = localStorage.lastActive + "," + request.data + '\n';
			}
		}
	}
);

chrome.tabs.onActivated.addListener(function(activeInfo) {
	chrome.tabs.get(activeInfo.tabId, function(tab) {
		localStorage.lastActive = urlDomain(tab.url);
	});
});
