//message listener for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'Data Gotten') {
        console.log(request.data.data);
        highlight_DP(request.data.data);
        sendResponse("Dark Patterns Highlighted");


    }
});

//function to highlight all given DP on a webpage so far.
function highlight_DP(data) {
    let misdirection_img = chrome.runtime.getURL("../images/four-arrows.png");
    // $(DP_text).css({ border: '5px solid red' });
    for (item = 0; item < data.total_counts; item++) {
        let category = data.details[item].category_name;
        DP_text = data.details[item].tag;
        // $(DP_text).css({ border: '5px solid red' });
        let icon = document.createElement("img");
        icon.setAttribute("src", misdirection_img);
        icon.className = "DP_misdirection_icon";
        icon.id = `DP_id_${item} `;
        icon.setAttribute("data-internalid", data.details[item].category_name);
        icon.setAttribute("href", "#");
        icon.onclick = function() {
            showpopup(this);
        };
        $(DP_text).prepend(icon);
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
            //popup.innerHTML = "<span id = pointer></span><div>InfoBox</div>";

            //when popup is too close to the top and right hand side of the page
            if (pos_top <= 150 && screen.width - pos_right <= 150) {
                popup.innerHTML = `<span id = 'popuparrow' class = 'DP_pointer_right_top'></span><div>${returnHTML(category)}</div>`;
                popup.style.left = pos_left - 56 + window.scrollX + 'px';
                popup.style.top = pos_top + 54 + window.scrollY + 'px';
                console.log("heelo");
                document.body.appendChild(popup);

                //when popup would be too close to the right hand side of the page
            } else if (screen.width - pos_right <= 150) {
                popup.innerHTML = `<span id = 'popuparrow' class = 'DP_pointer_right'></span><div>${returnHTML(category)}</div>`;
                popup.style.left = pos_left - 56 + window.scrollX + 'px';
                popup.style.top = pos_top + 54 + window.scrollY + 'px';
                document.body.appendChild(popup);

            } else if (pos_top <= 150) { //when popup would be too close to the top of the page
                popup.innerHTML = `<span id = 'popuparrow' class = 'DP_pointer_top'></span><div>${returnHTML(category)}</div>`;
                popup.style.left = pos_left + window.scrollX + 'px';
                popup.style.top = pos_top + 54 + window.scrollY + 'px';
                document.body.appendChild(popup);

            } else { //normal positioning of popup
                popup.innerHTML = `<span id = 'popuparrow' class = 'DP_pointer'></span><div>${returnHTML(category)}</div>`;
                popup.style.left = pos_left + window.scrollX + 'px';
                popup.style.top = pos_top - 110 + window.scrollY + 'px';
                document.body.appendChild(popup);
            }

            //when there is a popup already present on the page
        } else {
            if (pos_top <= 150 && screen.width - pos_right <= 150) {
                $("#DP_popup_active").animate({ "left": pos_left - 56 + window.scrollX + 'px', "top": pos_top + 54 + window.scrollY + 'px' }, 200);
                $("#popuparrow").removeClass().addClass("DP_pointer_top");
                checkforPopup.innerHTML = `<span id = 'popuparrow' class = 'DP_pointer_top'></span><div>${returnHTML(category)}</div>`;

            } else if (pos_top <= 150) {
                $("#DP_popup_active").animate({ "left": pos_left + window.scrollX + 'px', "top": pos_top + 54 + window.scrollY + 'px' }, 200);
                $("#popuparrow").removeClass().addClass("DP_pointer_top");
                checkforPopup.innerHTML = `<span id = 'popuparrow' class = 'DP_pointer_top'></span><div>${returnHTML(category)}</div>`;

            } else if (screen.width - pos_right <= 150) {
                $("#DP_popup_active").animate({ "left": pos_left - 56 + window.scrollX + 'px', "top": pos_top + window.scrollY + 'px' }, 200);
                $("#popuparrow").removeClass().addClass("DP_pointer_top");
                checkforPopup.innerHTML = `<span id = 'popuparrow' class = 'DP_pointer_top'></span><div>${returnHTML(category)}</div>`;

            } else {
                $("#DP_popup_active").animate({ "left": pos_left + window.scrollX + 'px', "top": pos_top - 110 + window.scrollY + 'px' }, 200);
                $("#popuparrow").removeClass().addClass("DP_pointer");
                checkforPopup.innerHTML = `<span id = 'popuparrow' class = 'DP_pointer'></span><div>${returnHTML(category)}</div>`;
            }

            // checkforPopup.style.left = x + 'px';
            // checkforPopup.style.top = y - 110 + 'px';
        }

    }

    function returnHTML(category) {
        return `<div>${category}</div>`
    }


    $(window).resize(function() {
        if (document.getElementById("DP_popup_active") == null) {
            return;
        } else {
            document.getElementById("DP_popup_active").remove();
        }
    })