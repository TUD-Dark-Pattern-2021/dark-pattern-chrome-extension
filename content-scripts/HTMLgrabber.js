//this listner function does a few things:
// 1. grabs the HTML of the current webpage to send to node server
// 2. check whether autoscan is turned on or off and creates a toast popup based on the patterns found on the page.

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.message == 'GetHTML') {
        scanforCheckboxes();
        sendResponse({ data: document.body.innerHTML });

    } else if (request.message == 'DarkPatternsWereFoundByAutoDetect') {
        checkautoscan(request.data);
        sendResponse("user has been alerted");
    }
});


function checkautoscan(data) {
    chrome.storage.local.get(['autoscan'], function(result) {
        if (result.autoscan === true) {
            createToastPopup(data);
            showandhidetoast();
        }
    });
}

function createToastPopup(data) {
    let toastpopup = document.createElement('div');
    toastpopup.id = "toastpopup";
    toastpopup.className = "toast_popup";
    if (data.data.details == 0) {
        toastpopup.innerText = "There were no Dark Patterns found on this page";
        toastpopup.className += " patterns_not_found";

    } else {
        toastpopup.innerText = "Careful! Dark Patterns were found on this page";
        toastpopup.className += " patterns_found";
    }
    document.body.appendChild(toastpopup);
}

function showandhidetoast() {
    let toast = document.getElementById("toastpopup")
    toast.classList.add("toast--visible");

    setTimeout(function() {
        toast.classList.remove("toast--visible");
    }, 4000);
}

function scanforCheckboxes() {
    var all_checkboxes = [];
    var checkboxes = document.querySelectorAll('input[type="checkbox"], input[type="radio"]');
    var checked_checkboxes = document.querySelectorAll('input[type="radio"]:checked, input[type="checkbox"]:checked');
    all_checkboxes.push(checkboxes.length, checked_checkboxes.length);
    console.log("total number of checkboxes: " + checkboxes.length);
    console.log("total number of checked checkboxes: " + checked_checkboxes.length);
    chrome.runtime.sendMessage({ message: "checkboxes", data: all_checkboxes }, function(response) {
        console.log(response);
    });
}