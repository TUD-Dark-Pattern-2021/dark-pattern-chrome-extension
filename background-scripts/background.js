// // sets a listener onto the extension icon and listens till the icon is clicked. Once clicked the 'tab' object gives the current tab that is open and the id fo the current tab can be gotten.
// // sends a message to the content script once the icon is clicked. Content scripts answers with a reply, which gets console logged.
// chrome.action.onClicked.addListener((tab) => {
//     chrome.tabs.sendMessage({ message: "getURL" }, function(response) {
//         console.log(response);
//     });
// });


//listener to listen for any message sent by scripts 
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'GetData') {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { message: "GetHTML" }, function(response) {
                //console.log(response.data);
                sendData(response.data);
                sendResponse("data gotten");
            });
        });
    }
    return true;
});

//fucntion to get the data from the api running on the node server, and then sends the response data to another content script
async function sendData(raw_html) {
    encoded_html = encodeURIComponent(raw_html);
    await fetch("http://dark-pattern-node-js-dev.eu-west-1.elasticbeanstalk.com/api/dp/detect", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            timeout: 0,
            body: JSON.stringify({ "html": encoded_html }),
        }).then(response => response.json())
        .then(data => {
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { message: "Data Gotten", data: data }, function(response) {
                    //console.log(response);
                });
                chrome.runtime.sendMessage({ message: "Data Retrieved", data: data }, function(response) {
                    //console.log(response);
                });
            });


        })

}

//listener for toggling on and off the patterns highlighted on the page
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'MisdirectionToogleOn') {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { message: "MisdirectionToogleOn_highlight" }, function(response) {
                console.log(response);
            });
        })
    } else if (request.message === 'MisdirectionToogleOff') {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { message: "MisdirectionToogleOff_highlight" }, function(response) {
                console.log(response);
            });
        })
    }



});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'check session storage') {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { message: "CheckSessionStorage" }, function(response) {
                sendResponse(response);
            });
        });

    } else if (request.message = "Put Data in Storage") {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { message: "PutDataInStorage", data: request.data }, function(response) {
                sendResponse(response);
            });
        });
    }
});

chrome.webNavigation.onCommitted.addListener((details) => {
    if (["reload"].includes(details.transitionType)) {
        chrome.webNavigation.onCompleted.addListener(function onComplete() {
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { message: "RemoveDataFromStorage" }, function(response) {
                    console.log(response);
                });
            });

            //chrome.webNavigation.onCompleted.removeListener(onComplete);
        });
    }
});