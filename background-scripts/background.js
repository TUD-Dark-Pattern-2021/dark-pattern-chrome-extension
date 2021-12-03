// Initialize

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ autoscan: false });
});

//function to check whether autoscan is turned on or off in the extension
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete' && tab.active) {
        chrome.storage.local.get(['autoscan'], function(result) {
            if (result.autoscan === true) {
                chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, { message: "GetHTML" }, function(response) {
                        sendData(response.data);

                    });
                    chrome.tabs.sendMessage(tabs[0].id, { message: "DisplayAutoScanIsWorking" }, function(response) {
                        console.log("=======asdfadsfads");
                    });

                });
                chrome.runtime.sendMessage({ message: "disabledetectbutton" });
            } else if (result.autoscan === false) {
                console.log("Auto scan is off");
            }
        });
    }
    return true;
});


//listener to listen for any message sent by scripts 
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request.message)
    if (request.message === 'GetData') {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { message: "GetHTML" }, function(response) {
                sendData(response.data);
                sendResponse("data gotten");
            });
        });
    }
    return true;
});

//fucntion to get the data from the api running on the node server, and then sends the response data to another content script
async function sendData(raw_html) {
    console.log("sending...");
    encoded_html = encodeURIComponent(raw_html);
    var ORC_value = new Promise(function(resolve, reject) {
        chrome.storage.local.get(['ORC'], function(result) {
            resolve(result.ORC);
        });
    });

    const isORCon = await ORC_value;
    console.log(isORCon);

    await fetch("http://dark-pattern-node-js-dev.eu-west-1.elasticbeanstalk.com/api/dp/detect", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            timeout: 0,
            body: JSON.stringify({ "html": encoded_html, is_orc: Number(isORCon) }),
        }).then(response => response.json())
        .then(data => {

            console.log('data==============', data)
            if (data.errcode !== 200) {

                console.log("an error of python service was caught!", data.data.message)
                chrome.runtime.sendMessage({ message: "anErrorWasCaught", data: data.data.message });
            }


            chrome.storage.local.get({ filters: {} }, function(response) {
                console.log('filters:', response)
                let result = data.data
                for (let i in response.filters) {
                    console.log(i)
                    if (response.filters[i] === false && result.items_counts[i]) {
                        result.details = result.details.filter((v) => v.category_name !== i)
                        result.total_counts -= result.items_counts[i]
                        delete result.items_counts[i]
                    }

                }
                console.log('result=========', result)


                chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                    //let tab = tabs[0].id;
                    chrome.storage.local.set({
                        [tabs[0].id]: data
                    });
                    console.log("data is set in storage " + tabs[0].id);
                });
                chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, { message: "Data Gotten", data: data }, function(response) {
                        console.log(response);
                    });
                    chrome.runtime.sendMessage({ message: "Data Retrieved", data: data }, function() {
                        console.log(data);
                    });
                    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                        chrome.tabs.sendMessage(tabs[0].id, { message: "createtoastpopup", data: data }, function(response) {
                            // console.log(response);
                        })
                    });

                });

            });
        })
        .catch(error => {
            console.log('error', error)
            console.log("an error of node service was caught!")
            chrome.runtime.sendMessage({ message: "anErrorWasCaught" });
        });
}


//listens for when the page gets loaded or reloaded, to remove the dark pattern data from chrome storage
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    //console.log(tabId);
    if (changeInfo.status == 'loading' && tab.active) {
        console.log("================sfasdfdsaf");
        chrome.storage.local.remove([tabId.toString()]);
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { message: "removeallpopups" }, function(response) {
                // console.log(response);
            })
        });
    }
});

//listener for when the user submits a report from the UI.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message == 'SendReport') {
        console.log(JSON.stringify(request.data));
        sendReport(request.data);
        sendResponse("cleared form");
    }
});

//sending the submitted report the the node and handlign the repsonse accordingly
async function sendReport(data) {
    await fetch("http://dark-pattern-node-js-dev.eu-west-1.elasticbeanstalk.com/api/dp/newReport", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            timeout: 0,
            body: JSON.stringify(data),
        }).then(response => response.text())
        .then(result => {
            console.log(result);
            chrome.runtime.sendMessage({ message: "formWasAdded" }, function(response) {
                console.log(response);
            });
        })
        .catch(error => console.log('error', error));

}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'navigateToClickedElement') {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { message: "navigateToClickedElement", data: request.data });
        });
    }
    return true;
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request.data)
    if (request.message === 'syncScroll') {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { message: "syncScroll", data: request.data });
        });
    }
    return true;
});