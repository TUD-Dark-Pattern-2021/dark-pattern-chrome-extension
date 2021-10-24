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