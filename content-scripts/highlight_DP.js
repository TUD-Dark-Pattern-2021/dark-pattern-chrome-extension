//message listener for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'Data Gotten') {
        // console.log(request.data.data);
        highlight_DP(request.data.data);
        sendResponse("Dark Patterns Highlighted");
        return true;
    }
});

//function to highlight all given DP on a webpage so far.
function highlight_DP(data) {
    console.log(data);
    let misdirection_img = chrome.runtime.getURL("../images/four-arrows.png");
    // $(DP_text).css({ border: '5px solid red' });
    for (item = 0; item < data.total_counts; item++) {
        console.log(item);
        DP_text = data.details[item].tag;
        // $(DP_text).css({ border: '5px solid red' });
        let icon = document.createElement("img");
        icon.setAttribute("src", misdirection_img);
        icon.className = "DP_misdirection_icon";
        icon.id = `DP_id_${item} `
        icon.onclick = function() {
            showalert(this.id);
        };
        $(DP_text).before(icon);
    }

    // $(DP_text).prepend("<img src = " + misdirection_img + " alt = 'Misdirection Icon' class = 'DP_misdirection_icon' onclick = showalert();>");
    //}
    // $(".DP_misdirection_icon").hover(function() {
    //     $('.DP_wrapper').addClass("DP_wrapper_outline");
    // }, function() {
    //     $('.DP_wrapper').removeClass("DP_wrapper_outline");
    // });

    // let elem = document.getElementsByClassName("DP_misdirection_icon");
    // let popup = function() {
    //     let popups = document.createElement("div");
    //     popups.addClassName = "popupContainer"
    //     document.appendChild(popups);
    // }
    // Array.from(elem).forEach(function(element) {
    //     element.addEventListener('click', popup);
    // });
}
// function showalert(id) {
//     console.log(id);
//     let elem = document.getElementById(id);

//     console.log(getOffset(elem).left);
//     console.log(getOffset(elem).top);
//     let popup = document.createElement("div");
//     popup.className = "popupContainer";
//     popup.id = "popupcontainer";
//     popup.innerText = "Hello";
//     document.body.appendChild(popup);
// }

function showalert(id) {
    let element_clicked = document.getElementById(id);
    let position = element_clicked.getBoundingClientRect();
    let pos_left = position.left;
    let pos_top = position.top;
    let pos_bottom = position.bottom;
    let pos_right = position.right;
    let checkforPopup = document.getElementById("DP_popup_active");
    if (checkforPopup == null) {
        let popup = document.createElement("div");
        popup.className = "popupContainer";
        //popup.innerHTML = "<span id = pointer></span><div>InfoBox</div>";
        if (pos_top <= 110) {
            popup.innerHTML = "<span id = 'popuparrow' class = 'DP_pointer_top'></span><div>InfoBox</div>";
            popup.style.left = pos_left + window.scrollX + 'px';
            popup.style.top = pos_top + 54 + window.scrollY + 'px';
            popup.id = "DP_popup_active";
            document.body.appendChild(popup);
        } else {
            popup.innerHTML = "<span id = 'popuparrow' class = 'DP_pointer'></span><div>InfoBox</div>";
            popup.style.left = pos_left + window.scrollY + 'px';
            popup.style.top = pos_top - 110 + window.scrollY + 'px';
            popup.id = "DP_popup_active";
            document.body.appendChild(popup);
        }
    } else {
        if (pos_top <= 110) {
            $("#DP_popup_active").animate({ "left": pos_left + window.scrollX + 'px', "top": pos_top + 54 + window.scrollY + 'px' }, 200);
            $("#popuparrow").removeClass().addClass("DP_pointer_top");

        } else {
            $("#DP_popup_active").animate({ "left": pos_left + window.scrollX + 'px', "top": pos_top - 110 + window.scrollY + 'px' }, 200);
            $("#popuparrow").removeClass().addClass("DP_pointer");
        }

        // checkforPopup.style.left = x + 'px';
        // checkforPopup.style.top = y - 110 + 'px';
    }

}