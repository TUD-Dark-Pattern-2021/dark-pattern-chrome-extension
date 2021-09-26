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
    // let DP_text = data.details[0].tag;
    // $(DP_text).html("abc")
    console.log(data)
    for (item = 0; item < data.details.length; item++) {
        DP_text = data.details[item].tag;
        $(DP_text).css({ border: '5px solid red' });
        // console.log(DP_text);
        // $('body :not(script)').contents().filter(function() {
        //     return this.nodeType === 3;
        // }).replaceWith(function() {
        //     return this.nodeValue.replace(DP_text, `<span class = "DP_smallcaps">${DP_text}</span>`);
        // });
    }
}