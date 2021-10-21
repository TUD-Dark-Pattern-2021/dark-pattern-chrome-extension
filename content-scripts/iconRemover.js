//listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message == 'FakeHighDemandToggle_highlight') {
        toggleFakeHighDemandIcon(request.data);
    } else if (request.message == 'FakeActivityToggle_highlight') {
        toggleFakeActivityIcon(request.data);
        sendResponse("toggled");
    } else if (request.message == 'FakeCountdownToggle_highlight') {
        toggleCountdownToggleIcon(request.data);
        sendResponse("toggled");
    } else if (request.message == 'FakeLimitedTimeDemandToggle_highlight') {
        toggleFakeLimitedTimeDemandIcon(request.data);
        sendResponse("toggled");
    } else if (request.message == 'FakeLowStockDemandToggle_highlight') {
        toggleFakeLowStockDemandIcon(request.data);
        sendResponse("toggled");
    }
})


function toggleFakeActivityIcon(toggle) {
    document.querySelectorAll(".DP_misdirection_div").forEach(function(icon) {
        if (toggle == 'on') {
            icon.style.display = "none";
            document.querySelectorAll(".DP_text_border").forEach(function(border) {
                border.classList.remove("DP_text_border_misdirection");
            });
        } else {
            icon.style.display = "block";
            document.querySelectorAll(".DP_text_border").forEach(function(border) {
                border.classList.add("DP_text_border_misdirection");
            });
        }
    });
}

function toggleFakeHighDemandIcon(toggle) {
    document.querySelectorAll(".DP_urgency_div").forEach(function(icon) {
        if (toggle == 'on') {
            icon.style.display = "none";
            document.querySelectorAll(".DP_text_border_highdemand").forEach(function(border) {
                border.classList.remove("DP_text_border_urgency");
            });
        } else {
            icon.style.display = "block";
            document.querySelectorAll(".DP_text_border_highdemand").forEach(function(border) {
                border.classList.add("DP_text_border_urgency");
            });
        }
    });
}

function toggleCountdownToggleIcon(toggle) {
    document.querySelectorAll(".DP_scarcity_div").forEach(function(icon) {
        if (toggle == 'on') {
            icon.style.display = "none";
            document.querySelectorAll(".DP_text_border_fakecountdown").forEach(function(border) {
                border.classList.remove("DP_text_border_scarcity");
            });
        } else {
            icon.style.display = "block";
            document.querySelectorAll(".DP_text_border_fakecountdown").forEach(function(border) {
                border.classList.add("DP_text_border_scarcity");
            });
        }
    });
}

function toggleFakeLimitedTimeDemandIcon(toggle) {
    document.querySelectorAll(".DP_socialProof_div").forEach(function(icon) {
        if (toggle == 'on') {
            icon.style.display = "none";
            document.querySelectorAll(".DP_text_border_limitedtime").forEach(function(border) {
                border.classList.remove("DP_text_border_socialProof");
            });
        } else {
            icon.style.display = "block";
            document.querySelectorAll(".DP_text_border_limitedtime").forEach(function(border) {
                border.classList.add("DP_text_border_socialProof");
            });
        }
    });
}

function toggleFakeLowStockDemandIcon(toggle) {
    document.querySelectorAll(".DP_forcedActivity_div").forEach(function(icon) {
        if (toggle == 'on') {
            icon.style.display = "none";
            document.querySelectorAll(".DP_text_border_lowstock").forEach(function(border) {
                border.classList.remove("DP_text_border_forcedActivity");
            });
        } else {
            icon.style.display = "block";
            document.querySelectorAll(".DP_text_border_lowstock").forEach(function(border) {
                border.classList.add("DP_text_border_forcedActivity");
            });
        }
    });
}