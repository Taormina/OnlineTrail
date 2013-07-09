chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		localStorage.siteList = localStorage.siteList != undefined ? localStorage.siteList + request.data + '<br>' : request.data + '<br>';
	}
);
