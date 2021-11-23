//this listner function does a few things:
// 1. grabs the HTML of the current webpage to send to node server
// 2. check whether autoscan is turned on or off and creates a toast popup based on the patterns found on the page.
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
    } else if (request.message === "getscollbarposition") {
        let pos = scrollBarPosition();
        sendResponse(pos);
    } else if (request.message === "DisplayAutoScanIsWorking") {

        displayAutoScanIsWorking();
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

function displayAutoScanIsWorking() {
    let logo = chrome.runtime.getURL("../images/logo.png");
    let dots = chrome.runtime.getURL("../images/option.png");
    let close = chrome.runtime.getURL("../images/cross.png");
    console.log("sdfasdfdfa===========")
    let autoscanpopup = document.createElement('div');
    autoscanpopup.id = "autoscanPopup";
    autoscanpopup.className = "autoscanpopup_toast";
    autoscanpopup.innerHTML = `<div class = "grid_container">
    <div class = "item1"><img src = ${logo} alt = "DP Logo" class = "DP_logo"></div>
    <div class = "item2 autodetecttext"><div>The Detector is detecting dark pattern on this page</div><div><img src = ${dots} alt = ". . ." class = "dots"></div></div>
    <div class = "item3"><img src = ${close} alt = "X" class = "closepopup"></div>
    </div>
    `;
    document.body.appendChild(autoscanpopup);

}

function createToastPopup(data) {
    let toastpopup = document.createElement('div');
    toastpopup.id = "toastpopup";
    toastpopup.className = "toast_popup";
    if (data.data.details == 0) {
        toastpopup.innerText = "There were no Dark Patterns found on this page";
        toastpopup.className += " patterns_not_found";

    } else {
        var key = [];
        Object.keys(data.data.items_counts).forEach(function(item) {
            key.push(item.match(/[A-Z][a-z]+|[0-9]+/g).join(" "))
        });
        toastpopup.innerHTML = `<div class = "toastwrapper">
        <div>Careful! There were ${data.data.total_counts} dark patterns found on this webpage</div>
        <div>The types of patterns found on this webpage are: </div>
        <ul class = "typelist">
            ${key.map(type => `
            <li>${type}</li>
            `).join('')}
        </ul>
        </div>
        `;
        toastpopup.className += " patterns_found";
    }
    document.body.appendChild(toastpopup);

}



function showandhidetoast() {
    $("#toastpopup").show('slow');
    $("#toastpopup").delay(15000).hide('slow', function(){ toast.remove()})
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

function scrollBarPosition(){
    var browser_viewport_h = $(window).height();
    var HTML_doc_height = $(document).height();
    let percentage = ((browser_viewport_h / HTML_doc_height) * 100).toFixed(3);
    return percentage;
}