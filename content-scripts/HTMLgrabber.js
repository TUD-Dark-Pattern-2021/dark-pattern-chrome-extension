//this listner function does a few things:
// 1. grabs the HTML of the current webpage to send to node server
// 2. check whether autoscan is turned on or off and creates a toast popup based on the patterns found on the page.

window.onload = function() {
    var browser_viewport_h = $(window).height();
    var HTML_doc_height = $(document).height();
    var scroll = $(window).scrollTop();

    console.log(scroll);
    let percentage = ((browser_viewport_h / HTML_doc_height) * 100).toFixed(3);
}

window.onscroll = function() {

}


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.message == 'GetHTML') {
        scanforCheckboxes();
        let html = stripScripts(document.body.innerHTML);
        //console.log(html);
        sendResponse({ data: html });


    } else if (request.message == 'createtoastpopup') {
        createToastPopup(request.data);
        showandhidetoast();
        sendResponse("user has been alerted");
    } else if (request.message === "getpercentagescreenvisible") {
        calculatePercentageScreenVisible();
        sendResponse("calculated!");
    }
});

function stripScripts(s) {

    var div = document.createElement('div');
    div.innerHTML = s;
    var scripts = div.getElementsByTagName('script');
    var i = scripts.length;
    while (i--) {
        scripts[i].parentNode.removeChild(scripts[i]);
    }
    return div.innerHTML;

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
        console.log(data.data.items_counts);
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
    calculatePercentageScreenVisible();

}

function calculatePercentageScreenVisible() {
    var browser_viewport_h = $(window).height();
    var HTML_doc_height = $(document).height();
    //console.log(browser_viewport_h, HTML_doc_height);
    let percentage = ((browser_viewport_h / HTML_doc_height) * 100).toFixed(3);
    //console.log(percentage + "% of the webpage is visible on screen")

    chrome.runtime.sendMessage({ message: "screenvisiblity", data: percentage }, function(response) {
        console.log(response);
    })
}