//JS file for handling all the logic benhind the report functionaility in the UI. Beigns with some bit of error checking
//to make sure all form fields are filled out. the it creates an array with the inputted values and sends it to the background.js

document.getElementById("SubmitButton").addEventListener('click', function() {
    if (document.getElementById("WebsiteURL").value == "" || document.getElementById("keyword").value == "" || document.getElementById("PatternCategory").value == "" || document.getElementById("PatternDescription").value == "") {
        $('#warning').show();
    } else {
        submitform();
    }
});

function submitform() {
    let websiteurl = document.getElementById("WebsiteURL").value
    let keyword = document.getElementById("keyword").value
    let patterncategory = document.getElementById("PatternCategory").value
    let description = document.getElementById("PatternDescription").value

    if (patterncategory == "Urgency") {
        var patterncategory_num = "1";
    } else {
        var patterncategory_num = "2";
    }

    let data_object = { "url": websiteurl, "keyword": keyword, "category": patterncategory_num, "description": description };
    // console.log(data_object);

    chrome.runtime.sendMessage({ message: "SendReport", data: data_object },
        function(response) {
            $('#warning').hide();
        }
    );
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    //console.log("hello");
    if (request.message == "formWasAdded") {
        document.getElementById("reportform").reset();
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            let domain = new URL(tabs[0].url);
            document.getElementById("WebsiteURL").value = domain;
        });
        document.getElementById("success").style.display = "block";
        setInterval(timer, 3000);

    }
});

function timer() {
    document.getElementById("success").style.display = "none";
}