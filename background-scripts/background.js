//sets a listener onto the extension icon and listens till the icon is clicked. Once clicked the 'tab' object gives the current tab that is open and the id fo the current tab can be gotten.
//sends a message to the content script once the icon is clicked. Content scripts answers with a reply, which gets console logged.
chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.sendMessage(
        tab.id, { callFunction: "ControllerFunction" },
        function(response) {
            console.log("hasf");
        });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'Get Data') {
        sendData(request.data);
        sendResponse("Done");
    }
});

async function sendData(raw_html) {
    encoded_html = encodeURIComponent(raw_html);
    await fetch("http://dark-pattern-node-js-dev.eu-west-1.elasticbeanstalk.com/api/dp/detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        timeout: 0,
        body: JSON.stringify({ "html": encoded_html }),
    }).then((response) => {
        return response.json();
    }).then(data => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { message: "Data Gotten", data: data }, (response) => {
                console.log(response);
            });

        })

    });
}

//just testing to see if the push works