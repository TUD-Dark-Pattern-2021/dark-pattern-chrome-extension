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
        if (request.data.data.details == 0) {
            createNoDPFoundPopUp();
        } else {
            createToastPopup(request.data);
        }

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
    let autoscanpopup = document.createElement('div');
    autoscanpopup.id = "autoscanPopup";
    autoscanpopup.className = "autoscanpopup_toast";
    autoscanpopup.innerHTML = `<div class = "grid_container">
    <div class = "item1"><img src = ${logo} alt = "DP Logo" class = "DP_logo"></div>
    <div class = "item2 autodetecttext"><div>The Detector is detecting dark pattern on this page</div><div><img src = ${dots} alt = ". . ." class = "dots"></div></div>
    <div class = "item3"><img src = ${close} alt = "X" class = "closepopup" id = "closepopup"></div>
    </div>
    `;
    autoscanpopup.onclick = function(event) {
        if (event.target.id === 'closepopup') {
            $('#autoscanPopup').hide();
        }
    }
    document.body.appendChild(autoscanpopup);

}



function createNoDPFoundPopUp() {
    try {
        $('#autoscanPopup').hide();
    } catch (e) {
        console.log(e);
    }
    let logo = chrome.runtime.getURL("../images/logo.png");
    let close = chrome.runtime.getURL("../images/cross.png");
    let noDPpopup = document.createElement('div');
    noDPpopup.id = "NoDPpopup";
    noDPpopup.className = "noDPpopup";
    noDPpopup.innerHTML = `<div class = "grid_container">
    <div class = "item1"><img src = ${logo} alt = "DP Logo" class = "DP_logo"></div>
    <div class = "item2 autodetecttext"><div>There were no Dark Patterns found on this page</div></div>
    <div class = "item3"><img src = ${close} alt = "X" class = "closepopup" id = "closeNoDPpopup"></div>
    </div>
    `;
    noDPpopup.onclick = function(event) {
        if (event.target.id === 'closeNoDPpopup') {
            $('#NoDPpopup').hide();
        }
    }
    document.body.appendChild(noDPpopup);

    $("#NoDPpopup").fadeIn("slow");
    $("#NoDPpopup").delay(10000).fadeOut('slow', function() { $(this).remove() });
}



function createToastPopup(data) {
    let logo = chrome.runtime.getURL("../images/logo.png");
    let toastpopup = document.createElement('div');
    let close = chrome.runtime.getURL("../images/cross.png");
    let FA = chrome.runtime.getURL("../images/FakeActivity.png");
    toastpopup.id = "toastpopup";
    toastpopup.className = "toast_popup";
    // var key = [];
    // Object.keys(data.data.items_counts).forEach(function(item) {
    //     key.push(item.match(/[A-Z][a-z]+|[0-9]+/g).join(" "))
    // });
    toastpopup.innerHTML = `<div class = "grid_container_patternsfound">
        <div class = "item1_found"><img src = ${logo} alt = "DP Logo" class = "logo"></div>
        <div class = "item2_found">
        <div class = "careful">Careful!</div>
         <div class = "warning_text">There were ${data.data.total_counts} dark patterns found on this webpage.</div>
         <div class = "warning_text">The patterns types are:</div>
         <div>
         <ul class = "list_styling">
         <li><img src = ${FA} alt = "Fake Activity Icon" class = "list_icon"><span class = "warning_text">Fake Activity</span></li>
         <li><img src = ${FA} alt = "Fake Activity Icon" class = "list_icon"><span class = "warning_text">Fake Activity</span></li>
         <li><img src = ${FA} alt = "Fake Activity Icon" class = "list_icon"><span class = "warning_text">Fake Activity</span></li>
         <li><img src = ${FA} alt = "Fake Activity Icon" class = "list_icon"><span class = "warning_text">Fake Activity</span></li>
         <li><img src = ${FA} alt = "Fake Activity Icon" class = "list_icon"><span class = "warning_text">Fake Activity</span></li>
         </ul>

         <div class = "outlined_text">Each dark pattern will have an icon beside it and be highlighted with dashed coloured boxes similar to this text!</div>
         </div>
         
         </div>
        <div class = "item3_found"><img src = ${close} alt = "X" class = "closepopup" id = "closeNoDPpopup"></div>
        </div>
        `;
    toastpopup.className += " patterns_found";
    document.body.appendChild(toastpopup);

    //     <ul class = "typelist">
    //     ${key.map(type => `
    //     <li>${type}</li>
    //     `).join('')}
    // </ul>

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

function scrollBarPosition() {
    var browser_viewport_h = $(window).height();
    var HTML_doc_height = $(document).height();
    let percentage = ((browser_viewport_h / HTML_doc_height) * 100).toFixed(3);
    return percentage;
}