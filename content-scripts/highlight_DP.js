//message listener for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'Data Gotten') {


        console.log(request.data.data);
        highlight_DP(request.data.data);
        sendResponse("Dark Patterns Highlighted");


    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'navigateToClickedElement') {
        let targetElement = null;
        if (request.data.tagType !== 'image') {
            // a compromise to navigate to target element
            $(request.data.tag).each((i, v) => {
                if ($(v).html().trim().slice(0, 3) === request.data.content.trim().slice(0, 3)) {
                    targetElement = $(v)
                }
            })
        } else {
            targetElement = $(request.data.tag)
        }

        const target_offset = targetElement.offset();
        const target_top = target_offset.top;
        const height = window.innerHeight || document.documentElement.clientHeight ||
            document.body.clientHeight;
        //goto that anchor by setting the body scroll top to anchor top
        $('html, body').animate({ scrollTop: target_top - height / 2 }, 400);
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request.data)
    let $el = $('html, body')
    if (request.message === 'syncScroll') {
        let { percent } = request.data
        var scrollTopPos = (percent / 100) * $el.height();
        forcedScroll = true;
        console.log(scrollTopPos)
        $el.scrollTop(scrollTopPos);
    }
});



//function to highlight all given DP on a webpage so far.
function highlight_DP(data) {
    let fakeActivity_img = chrome.runtime.getURL("../images/FakeActivity.png");
    let fakeCountdown_img = chrome.runtime.getURL("../images/FakeCountdown.png");
    let lowStock_img = chrome.runtime.getURL("../images/FakeLowStock.png");
    let highDemand_img = chrome.runtime.getURL("../images/FakeHighDemand.png");
    let limitedTime_img = chrome.runtime.getURL("../images/FakeLimitedTime.png");
    let confirmshaming_img = chrome.runtime.getURL("../images/Confirmshaming.png");

    for (item = 0; item < data.total_counts; item++) {
        let { type_name: category, tag: DP_text, content: dpContent } = data.details[item];
        // let category = data.details[item].type_name;
        // DP_text = data.details[item].tag;

        let icon = document.createElement("img");
        icon.id = `DP_id_${item}`;
        icon.classList.add("DP_type_icon", "identifier");
        icon.setAttribute("data-internalid", data.details[item].type_name);

        let icon_div = document.createElement("div");
        icon_div.classList.add("DP_type_div", "identifier")

        let DP_text_border = document.createElement('div');

        if (category == "FakeActivity") {
            icon.setAttribute("src", fakeActivity_img);
            DP_text_border.classList.add('DP_text_border_fakeActivity', "identifier");

        } else if (category === "FakeCountdown") {
            icon.setAttribute("src", fakeCountdown_img);
            DP_text_border.classList.add('DP_text_border_fakeCountdown', "identifier");

        } else if (category === "FakeHighDemand") {
            console.log("fdssssssss================");
            icon.setAttribute("src", highDemand_img);
            DP_text_border.classList.add("DP_text_border_fakeHighDemand", "identifier");

        } else if (category === "FakeLimitedTime") {
            icon.setAttribute("src", limitedTime_img);
            DP_text_border.classList.add('DP_text_border_fakeLimitedTime', "identifier");

        } else if (category === "FakeLowStock") {
            icon.setAttribute("src", lowStock_img);
            DP_text_border.classList.add('DP_text_border_fakeLowStock', "identifier");

        } else if (category === 'Confirmshaming') {
            console.log("sdfasdfasdfasdfasdf==============f");
            icon.setAttribute("src", confirmshaming_img);
            DP_text_border.classList.add('DP_text_border_confirmshaming', "identifier");
        }

        icon_div.append(icon);
        if ($(DP_text).parents('.DP_text_border_div').is('.DP_text_border_div')) {
            if (!$(DP_text).parents('.DP_text_border_div').children(".DP_type_div").is(".DP_type_div")) {
                $(DP_text).parents(".DP_text_border_div").prepend(icon_div);
                $(DP_text).wrap(DP_text_border);

            }
        } else {
            let DP_text_div = document.createElement('div');
            DP_text_div.classList.add("DP_text_border_div", "identifier");
            $(DP_text).wrap(DP_text_div);
            $(DP_text).parent().prepend(icon_div);
            $(DP_text).wrap(DP_text_border);
        }
    }

}