//message listener for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'Data Gotten') {
        // console.log(request.data.data);
        highlight_DP(request.data.data);
        sendResponse("Dark Patterns Highlighted");
    }
});

//function to highlight all given DP on a webpage so far. 
function highlight_DP(data) {
    console.log(data)
    for (item = 0; item < data.details.length; item++) {
        DP_text = data.details[item].tag;
        if (data.details[item].category_name == 'Misdirection') {
            $(DP_text).css({ border: '5px solid red' });
        } else if (data.details[item].category_name == 'Scarcity') {
            $(DP_text).css({ border: '5px solid blue' });
        } else if (data.details[item].category_name == 'Urgency') {
            $(DP_text).css({ border: '5px solid yellow' });
        } else if (data.details[item].category_name == 'Obstruction') {
            $(DP_text).css({ border: '5px solid green' });
        } else if (data.details[item].category_name == 'Social Proof') {
            $(DP_text).css({ border: '5px solid orange' });
        }
    }
}