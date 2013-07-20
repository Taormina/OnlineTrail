function urlDomain(data) {
  var a = document.createElement('a');
  a.href = data;
  return a.hostname;
}

var siteList = [];

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.reset == true) {
			siteList = [];	
		} else if (localStorage.lastActive != undefined) {
			var link = {source: localStorage.lastActive, target: request.data, cookie: request.cookie};
			siteList.push(link);
		}
		localStorage.siteList = JSON.stringify(siteList);
	}
);

chrome.tabs.onActivated.addListener(function(activeInfo) {
	chrome.tabs.get(activeInfo.tabId, function(tab) {
		localStorage.lastActive = urlDomain(tab.url);
	});
});
