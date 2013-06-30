if (document.cookie.indexOf("__utm") != -1)
	chrome.runtime.sendMessage({data: window.location.hostname}, function(response) {});
