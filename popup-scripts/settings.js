document.getElementById("autoscan").addEventListener('click', function() {
    let autoscan_checkbox = document.getElementById("autoscan");
    if (autoscan_checkbox.checked == true) {
        chrome.storage.sync.set({ autoscan: true }, function() {
            console.log('Autoscan has been set to on');
        });
    } else {
        chrome.storage.sync.set({ autoscan: false }, function() {
            console.log('Autoscan has been set to off');
        });
    }
});


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'checkautoscan') {
        chrome.storage.sync.get(['autoscan'], function(result) {
            if (result.autoscan === true) {
                if (request.data.data.details.length == 0) {
                    alert("no patterns found on page");
                } else {
                    alert("patterns found on page");
                }
            }
        });
    }
});