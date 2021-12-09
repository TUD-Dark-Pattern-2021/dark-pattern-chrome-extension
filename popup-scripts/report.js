//JS file for handling all the logic benhind the report functionaility in the UI. Beigns with some bit of error checking
//to make sure all form fields are filled out. the it creates an array with the inputted values and sends it to the background.js

document.getElementById("SubmitButton").addEventListener('click', function() {
    if (document.getElementById("WebsiteURL").value == "" || document.getElementById("keyword").value == "" || document.getElementById("PatternDescription").value == "") {
        if (document.getElementById("WebsiteURL").value == "") {
            $('#WebsiteURL').effect("shake");
            $('#WebsiteURL').css("border", "1px solid red")
        }
        if (document.getElementById("keyword").value == "") {
            $('#keyword').effect("shake");
            $('#keyword').css("border", "1px solid red")
        }
        if (document.getElementById("PatternDescription").value == "") {
            $('#PatternDescription').effect("shake");
            $('#PatternDescription').css("border", "1px solid red")
        }
    } else {
        submitform();
    }
});

function submitform() {
    let websiteUrl = document.getElementById("WebsiteURL").value;
    let patternString = document.getElementById("keyword").value;
    let patternType = $('#patternType :selected').val();
    let description = document.getElementById("PatternDescription").value;
    if ($("report_type").is(':checked')) {
        var classification = 1
    } else {
        var classification = 0
    }

    let data_object = { "url": websiteUrl, "patternString": patternString, "patternType": patternType, "classification": classification, "description": description };
    chrome.runtime.sendMessage({ message: "SendReport", data: data_object },
        function(response) {
            console.log(response);
        }
    );

    $('#SubmitButton').attr("value", "Submitting...");
    $("#reportform input").prop("disabled", true);
    $("#reportform textarea").prop("disabled", true);
    $("#reportform select").prop("disabled", true);
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message == "formWasAdded") {
        document.getElementById("reportform").reset();
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            let domain = new URL(tabs[0].url);
            document.getElementById("WebsiteURL").value = domain;
        });

        $('#SubmitButton').attr("value", "Submit");
        $("#reportform input").prop("disabled", false);
        $("#reportform textarea").prop("disabled", false);
        $("#reportform select").prop("disabled", false);
    }
});