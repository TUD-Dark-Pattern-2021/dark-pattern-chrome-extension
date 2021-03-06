//fires once the autoscan feature is toggled on or off. saves the state of the switch accrodingly which can then be retirved by the
//background.js once the extension is loaded. 
document.getElementById("autoscan").addEventListener('click', function() {
    let autoscan_checkbox = document.getElementById("autoscan");
    if (autoscan_checkbox.checked == true) {
        chrome.storage.local.set({ autoscan: true }, function() {
            console.log('Autoscan has been set to on');
        });
    } else {
        chrome.storage.local.set({ autoscan: false }, function() {
            console.log('Autoscan has been set to off');
        });
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "disabledetectbutton") {
        console.log("hsadfads");
        $("#detection_button").html("Detecting...please wait").attr('disabled', true).css('background-color', 'grey');
    } else if (request.message === "scollbarposition") {
        console.log(request.data);
    }
});


$('#id_switch_ORC').on('click', function(e) {
    if ($(this).is(':checked')) {
        chrome.storage.local.set({ ORC: true }, function() {
            console.log("ORC on");
        });
    } else {
        chrome.storage.local.set({ ORC: false }, function() {
            console.log("ORC Off");
        });
    }
});

$('#autoscan_info').on({
    mouseenter: function() {
        $('#autoscan_info_text').show();
    },
    mouseleave: function() {
        $('#autoscan_info_text').hide();
    }
});

$('#filter_info').on({
    mouseenter: function() {
        $('#detection_info_text').show();
    },
    mouseleave: function() {
        $('#detection_info_text').hide();
    }
});

$('#ocr_info').on({
    mouseenter: function() {
        $('#ocr_info_text').show();
    },
    mouseleave: function() {
        $('#ocr_info_text').hide();
    }
});

$('#patternTypeInfo').on({
    mouseenter: function() {
        $('#patternType_info_text').show();
    },
    mouseleave: function() {
        $('#patternType_info_text').hide();
    }
});

$('#reportpage_questionmark').on({
    mouseenter: function() {
        $('#helpUs').show();
    },
    mouseleave: function() {
        $('#helpUs').hide();
    }
});

$('#questionmark_checkboxes').on({
    mouseenter: function() {
        $('#checkbox_info_text').show();
    },
    mouseleave: function() {
        $('#checkbox_info_text').hide();
    }
});

$('#questionmark_percentage').on({
    mouseenter: function() {
        $('#percentage_info_text').show();
    },
    mouseleave: function() {
        $('#percentage_info_text').hide();
    }
});

$('#expand').on('click', function(e) {
    if ($('#fullwrapper').hasClass("scaled")) {

        $('#fullwrapper').removeClass("scaled");
        $('body').animate({ width: "400px", height: "460px" }, 70);
        $(this).attr("src", "../images/expand.png");

    } else {
        $('#fullwrapper').addClass("scaled");
        $('body').animate({ width: "483px", height: "557px" }, 70);
        $(this).attr("src", "../images/collapse.png");
    }
});