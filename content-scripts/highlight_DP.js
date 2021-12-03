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
        const target_offset = $(request.data).offset();
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
    let highDemand_img = chrome.runtime.getURL("../images/HighDemand.png");
    let limitedTime_img = chrome.runtime.getURL("../images/FakeLimitedTime.png");
    let confirmshaming_img = chrome.runtime.getURL("../images/FakeLimitedTime.png");

    for (item = 0; item < data.total_counts; item++) {
        let category = data.details[item].type_name;
        DP_text = data.details[item].tag;

        let icon = document.createElement("img");
        icon.id = `DP_id_${item}`;
        icon.classList.add("DP_type_icon", "identifier");
        icon.setAttribute("data-internalid", data.details[item].category_name);

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
            icon.setAttribute("src", highDemand_img);
            DP_text_border.classList.add("DP_text_border_fakeHighDemand", "identifier");

        } else if (category === "FakeLimitedTime") {
            icon.setAttribute("src", limitedTime_img);
            DP_text_border.classList.add('DP_text_border_fakeLimitedTime', "identifier");

        } else if (category === "FakeLowStock") {
            icon.setAttribute("src", lowStock_img);
            DP_text_border.classList.add('DP_text_border_fakeLowStock', "identifier");

        } else if (category === 'Confirmshaming') {
            icon.setAttribute("src", confirmshaming_img);
            DP_text_border.classList.add('DP_text_border_confirmshaming');
        }

        icon_div.append(icon);
        if ($(DP_text).parents('.DP_text_border_div').is('.DP_text_border_div')) {
            if ($(DP_text).parents('.DP_text_border_div').children(".DP_type_div").is(".DP_type_div")) {} else {
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



    //function to create the little popup coming out of each highlighted dark pattern
    //function contains a lot of logic which controls where the popup will appear on the screen based off of where the highlighted DP icon is located
    function showpopup(object) {
        let id = object.getAttribute('id');
        let category = object.getAttribute('data-internalid');
        let element_clicked = document.getElementById(id);
        let position = element_clicked.getBoundingClientRect();
        let pos_left = position.left;
        let pos_top = position.top;
        let pos_bottom = position.bottom;
        let pos_right = position.right;
        let checkforPopup = document.getElementById("DP_popup_active");

        //when there is no popup already on the page
        if (checkforPopup == null) {
            let popup = document.createElement("div");
            popup.className = "popupContainer";
            popup.id = "DP_popup_active";
            popup.addEventListener('click', function(event) {
                    if (event.target.id == "moreinfo") {
                        showmoreinfo();
                    } else if (event.target.id == "lessinfo") {
                        showlessinfo();
                    }
                })
                //popup.innerHTML = "<span id = pointer></span><div>InfoBox</div>";

            //when popup is too close to the top and right hand side of the page
            if (pos_top <= 270 && screen.width - pos_right <= 150) {
                popup.innerHTML = `<span id = 'popuparrow' class = 'DP_pointer_right_top'></span><div>${returnHTML(category)}</div>`;
                popup.style.left = pos_left - 56 + window.scrollX + 'px';
                popup.style.top = pos_top + 54 + window.scrollY + 'px';
                console.log("heelo");
                document.body.appendChild(popup);

                //when popup would be too close to the right hand side of the page
            } else if (screen.width - pos_right <= 150) {
                popup.innerHTML = `<span id = 'popuparrow' class = 'DP_pointer_right'></span><div>${returnHTML(category)}</div>`;
                popup.style.left = pos_left - 56 + window.scrollX + 'px';
                popup.style.top = pos_top - 147 + window.scrollY + 'px';
                document.body.appendChild(popup);

            } else if (pos_top <= 270) { //when popup would be too close to the top of the page
                popup.innerHTML = `<span id = 'popuparrow' class = 'DP_pointer_top'></span><div>${returnHTML(category)}</div>`;
                popup.style.left = pos_left + window.scrollX + 'px';
                popup.style.top = pos_top + 54 + window.scrollY + 'px';
                document.body.appendChild(popup);

            } else { //normal positioning of popup
                popup.innerHTML = `<span id = 'popuparrow' class = 'DP_pointer'></span><div>${returnHTML(category)}</div>`;
                popup.style.left = pos_left + window.scrollX + 'px';
                popup.style.top = pos_top - 147 + window.scrollY + 'px';
                document.body.appendChild(popup);
            }

            //when there is a popup already present on the page
        } else {
            if (pos_top <= 270 && screen.width - pos_right <= 150) {
                $("#DP_popup_active").animate({ "left": pos_left - 56 + window.scrollX + 'px', "top": pos_top + 54 + window.scrollY + 'px' }, 200);
                $("#popuparrow").removeClass().addClass("DP_pointer_top");
                checkforPopup.innerHTML = `<span id = 'popuparrow' class = 'DP_pointer_top'></span><div>${returnHTML(category)}</div>`;

            } else if (pos_top <= 270) {
                $("#DP_popup_active").animate({ "left": pos_left + window.scrollX + 'px', "top": pos_top + 54 + window.scrollY + 'px' }, 200);
                $("#popuparrow").removeClass().addClass("DP_pointer_top");
                checkforPopup.innerHTML = `<span id = 'popuparrow' class = 'DP_pointer_top'></span><div>${returnHTML(category)}</div>`;

            } else if (screen.width - pos_right <= 150) {
                $("#DP_popup_active").animate({ "left": pos_left - 56 + window.scrollX + 'px', "top": pos_top - 147 + window.scrollY + 'px' }, 200);
                $("#popuparrow").removeClass().addClass("DP_pointer_top");
                checkforPopup.innerHTML = `<span id = 'popuparrow' class = 'DP_pointer_top'></span><div>${returnHTML(category)}</div>`;

            } else {
                $("#DP_popup_active").animate({ "left": pos_left + window.scrollX + 'px', "top": pos_top - 147 + window.scrollY + 'px' }, 200);
                $("#popuparrow").removeClass().addClass("DP_pointer");
                checkforPopup.innerHTML = `<span id = 'popuparrow' class = 'DP_pointer'></span><div>${returnHTML(category)}</div>`;
            }

            // checkforPopup.style.left = x + 'px';
            // checkforPopup.style.top = y - 110 + 'px';
        }

    }
}

$(window).resize(function() {
    if (document.getElementById("DP_popup_active") == null) {
        return;
    } else {
        document.getElementById("DP_popup_active").remove();
    }
})

function showmoreinfo() {
    document.getElementById("hiddeninfo").className = "showninfo";
    //$("#hiddeninfo").css("display", "block");
    $("#moreinfo").css("display", "none");
    $("#lessinfo").css("display", "block");

    $("#DP_popup_active").animate({ "height": 265 + 'px' }, 200);
    //$("#hiddeninfo").animate({ "display": "block" }, 200);
}

function showlessinfo() {
    document.getElementById("hiddeninfo").className = "hiddeninfo";
    //$("#hiddeninfo").slideUp(200);
    $("#moreinfo").css("display", "block");
    $("#lessinfo").css("display", "none");
    $("#DP_popup_active").animate({ "height": 137 + 'px' }, 200);
}

//function that returns a certain popup message based off of what kind type and category the dark pattern is in.
function returnHTML(category) {
    //just returning this bit of code for now, as the type of pattern coming back from backend not functioning yet
    return `<div class = DP_PU_Title>Fake Activity</div>
            <div class = "DP_popuptext">This dark pattern might be using the activity of other users on the page to pressure you into making a purchase or decision. </div>
            
            
            <div id = "hiddeninfo" class = "hiddeninfo">
            <div class = "DP_PU_Title">Category - Social Proof</div>
        
            <div class = "DP_popuptext">Social proof patterns attempt to influence and accelerate users’ decisions by exploiting the bandwagon effect cognitive bias, by showing the user actions and behaviours of other users on the particular site.</div>
            </div>
        
            <div>
                <span id = "moreinfo" class = "DP_popupMI">More info?</span>
                <span id = "lessinfo" class = "DP_popupLI">Less info?</span>
                <span class = "DP_popupReport">Incorrectly Indentified?</span>
            </div>    
            `
    if (category === 'Socail Proof') {
        if (type === "Fake Activity") {
            return `<div class = DP_PU_Title>Fake Activity</div>
            <div class = "DP_popuptext">This dark pattern might be using the activity of other users on the page to pressure you into making a purchase or decision. </div>
            
            
            <div id = "hiddeninfo" class = "hiddeninfo">
            <div class = "DP_PU_Title">Category - Social Proof</div>
        
            <div class = "DP_popuptext">Social proof patterns attempt to influence and accelerate users’ decisions by exploiting the bandwagon effect cognitive bias, by showing the user actions and behaviours of other users on the particular site.</div>
            </div>
        
            <div>
                <span id = "moreinfo" class = "DP_popupMI">More info?</span>
                <span id = "lessinfo" class = "DP_popupLI">Less info?</span>
                <span class = "DP_popupReport">Incorrectly Indentified?</span>
            </div>    
            `
        }
    } else if (category === 'Misdirection') {
        if (type === "Confirmshaming") {
            return `<div class = DP_PU_Title>Confirmshaming</div>
            <div class = "DP_popuptext">This dark pattern might be using language and/or emotion in order to steer you away from making a particular choice.</div>
            
            
            <div id = "hiddeninfo" class = "hiddeninfo">
            <div class = "DP_PU_Title">Category - Misdirection</div>
        
            <div class = "DP_popuptext">Misdirection patterns functions by exploiting different affective mechanisms and cognitive biases, through language, visuals, and emotion, in users without actually restricting the set of choices available to user.</div>
            </div>
        
            <div>
                <span id = "moreinfo" class = "DP_popupMI">More info?</span>
                <span id = "lessinfo" class = "DP_popupLI">Less info?</span>
                <span class = "DP_popupReport">Incorrectly Indentified?</span>
            </div>    
            `
        } else if (type === "Pressured Selling") {
            return `<div class = DP_PU_Title>Pressured Selling</div>
            <div class = "DP_popuptext">This dark pattern might be using high pressure tactics, in order for you to purchase a more expensive version of the product or other products related to the original one.</div>
            
            
            <div id = "hiddeninfo" class = "hiddeninfo">
            <div class = "DP_PU_Title">Category - Misdirection</div>
        
            <div class = "DP_popuptext">Misdirection patterns functions by exploiting different affective mechanisms and cognitive biases, through language, visuals, and emotion, in users without actually restricting the set of choices available to user.</div>
            </div>
        
            <div>
                <span id = "moreinfo" class = "DP_popupMI">More info?</span>
                <span id = "lessinfo" class = "DP_popupLI">Less info?</span>
                <span class = "DP_popupReport">Incorrectly Indentified?</span>
            </div>    
            `
        } else if (type === "Trick Questions") {
            return `<div class = DP_PU_Title>Trick Questions</div>
            <div class = "DP_popuptext">This dark pattern might be using high pressure tactics, in order for you to purchase a more expensive version of the product or other products related to the original one.</div>
            
            
            <div id = "hiddeninfo" class = "hiddeninfo">
            <div class = "DP_PU_Title">Category - Misdirection</div>
        
            <div class = "DP_popuptext">Misdirection patterns functions by exploiting different affective mechanisms and cognitive biases, through language, visuals, and emotion, in users without actually restricting the set of choices available to user.</div>
            </div>
        
            <div>
                <span id = "moreinfo" class = "DP_popupMI">More info?</span>
                <span id = "lessinfo" class = "DP_popupLI">Less info?</span>
                <span class = "DP_popupReport">Incorrectly Indentified?</span>
            </div>    
            `
        }
    } else if (category === "Urgency") {
        if (type === "Fake Countdown") {
            return `<div class = DP_PU_Title>Fake Countdown</div>
    <div class = "DP_popuptext">This dark pattern might be using a fake countdown timer in order to pressure you into making a purchase or decision.</div>
    
    
    <div id = "hiddeninfo" class = "hiddeninfo">
    <div class = "DP_PU_Title">Category - Urgency</div>

    <div class = "DP_popuptext">Urgency dark patterns attempts to exploit the scarcity bias in users by making discounts and sales more appealing, using deadlines, countdowns and limited time message on deals and sales.</div>
    </div>

    <div>
        <span id = "moreinfo" class = "DP_popupMI">More info?</span>
        <span id = "lessinfo" class = "DP_popupLI">Less info?</span>
        <span class = "DP_popupReport">Incorrectly Indentified?</span>
    </div>`

        } else if (type === "Ambiguous Deadlines") {
            return `<div class = DP_PU_Title>Ambiguous Deadlines</div>
    <div class = "DP_popuptext">This dark pattern might be using an vague or fake deadlines in order to pressure you into making a purchase or decision.</div>
    
    
    <div id = "hiddeninfo" class = "hiddeninfo">
    <div class = "DP_PU_Title">Category - Urgency</div>

    <div class = "DP_popuptext">Urgency dark patterns attempts to exploit the scarcity bias in users by making discounts and sales more appealing, using deadlines, countdowns and limited time message on deals and sales.</div>
    </div>

    <div>
        <span id = "moreinfo" class = "DP_popupMI">More info?</span>
        <span id = "lessinfo" class = "DP_popupLI">Less info?</span>
        <span class = "DP_popupReport">Incorrectly Indentified?</span>
    </div>`
        }
    } else if (category === "Scaracity") {
        if (type === "High Demand Message") {
            return `<div class = DP_PU_Title>High Demand Message</div>
    <div class = "DP_popuptext">This dark might be trying to make you think that the product is in high demand and is likely to sell out shortly.</div>
    
    
    <div id = "hiddeninfo" class = "hiddeninfo">
    <div class = "DP_PU_Title">Category - Scaracity</div>

    <div class = "DP_popuptext">Scarcity dark patterns attempts to accelerate the users’ decisions, by attempting to increase the perceived value or desirability of a product, by signalling that the product is in high demand or that it is in low stock.</div>
    </div>

    <div>
        <span id = "moreinfo" class = "DP_popupMI">More info?</span>
        <span id = "lessinfo" class = "DP_popupLI">Less info?</span>
        <span class = "DP_popupReport">Incorrectly Indentified?</span>
    </div>`
        } else if (type === "Low Stock Messages") {
            return `<div class = DP_PU_Title>Low Stock Messages</div>
    <div class = "DP_popuptext">This dark might be trying to make you think that the product is in high demand and is likely to sell out shortly.</div>
    
    
    <div id = "hiddeninfo" class = "hiddeninfo">
    <div class = "DP_PU_Title">Category - Scaracity</div>

    <div class = "DP_popuptext">This dark pattern might be tricking you into thinking there are only a limited number of these products available to buy. </div>
    </div>

    <div>
        <span id = "moreinfo" class = "DP_popupMI">More info?</span>
        <span id = "lessinfo" class = "DP_popupLI">Less info?</span>
        <span class = "DP_popupReport">Incorrectly Indentified?</span>
    </div>`
        }
    }
}