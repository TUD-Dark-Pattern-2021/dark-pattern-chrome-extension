chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.message == 'GetHTML') {
        sendResponse({ data: document.body.innerHTML });
        console.log("HTML retrived");
    }
});