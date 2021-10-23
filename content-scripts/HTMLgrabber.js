//this listner function does a few things:
// 1. grabs the HTML of the current webpage to send to node server
// 2. gets the data from the session storage
// 3. sets the returned data from the node server into the session storage of the webpage
// 4. removes the data from the session storage

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.message == 'GetHTML') {
        sendResponse({ data: document.body.innerHTML });
    }
});