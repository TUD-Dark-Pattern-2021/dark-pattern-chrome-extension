chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.message == 'GetHTML') {
        sessionStorage.setItem("DarkPatternData_534724", "adsfasdfas");
        sendResponse({ data: document.body.innerHTML });

    } else if (request.message == 'CheckSessionStorage') {
        let item = sessionStorage.getItem("DarkPatternData_534724");
        sendResponse(item);
    } else if (request.message == "PutDataInStorage") {
        sessionStorage.setItem("DarkPatternData_534724", request.data);
        sendResponse("Data is now in session storage");
    } else if (request.message == "RemoveDataFromStorage") {
        sessionStorage.removeItem("DarkPatternData_534724");
        sendResponse("Data is removed from local storage");
    }
});