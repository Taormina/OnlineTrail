function urlDomain(data) {
  var a = document.createElement('a');
  a.href = data;
  return a.hostname;
}

function Link(s, t, c) {

	this.source = s;
	this.target = t;
	this.cookie = c;
}

var siteList = [];

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (localStorage.lastActive != undefined) {
			var link = Link(localStorage.lastActive, request.data, request.cookie);
			siteList.push(link);
			localStorage.siteList = JSON.stringify(siteList);
		}
	}
);

chrome.tabs.onActivated.addListener(function(activeInfo) {
	chrome.tabs.get(activeInfo.tabId, function(tab) {
		localStorage.lastActive = urlDomain(tab.url);
	});
});
