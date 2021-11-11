//fires once the autoscan feature is toggled on or off. saves the state of the switch accrodingly which can then be retirved by the
//background.js once the extension is loaded. 
document.getElementById("autoscan").addEventListener('click', function() {
    let autoscan_checkbox = document.getElementById("autoscan");
    if (autoscan_checkbox.checked == true) {
        chrome.storage.local.set({ autoscan: true }, function() {
            console.log('Autoscan has been set to on');
        });
    } else {
        chrome.storage.local.set({ autoscan: false }, function() {
            console.log('Autoscan has been set to off');
        });
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "disabledetectbutton") {
        console.log("hsadfads");
        $("#detection_button").html("Detecting...please wait").attr('disabled', true).css('background-color', 'grey');
    } else if (request.message === "scollbarposition") {
        console.log(request.data);
    }
})