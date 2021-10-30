//JS file for handling all the logic benhind the report functionaility in the UI. Beigns with some bit of error checking
//to make sure all form fields are filled out. the it creates an array with the inputted values and sends it to the background.js

document.getElementById("SubmitButton").addEventListener('click', function() {
    if (document.getElementById("WebsiteURL").value == "" || document.getElementById("keyword").value == "" || document.getElementById("PatternCategory").value == "" || document.getElementById("PatternDescription").value == "") {
        document.getElementById("warning").style.display = "block";
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
            // console.log(response);
            document.getElementById("warning").style.display = "none";
        }
    );


}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("hello");
    if (request.message == "formWasAdded") {
        document.getElementById("reportform").reset();
        document.getElementById("success").style.display = "block";
        setInterval(timer, 3000);

    }
});

function timer() {
    document.getElementById("success").style.display = "none";
}



// document.getElementById("urgency_button").addEventListener('click', displayTypes);
// document.getElementById("social_button").addEventListener('click', displayTypes);
// document.getElementById("scarcity_button").addEventListener('click', displayTypes);



// function displayTypes() {
//     document.getElementById("type_wrapper").style.display = "block";
//     var current_selected = document.querySelectorAll('.mis_button.mis_button_selected');
//     if (current_selected.length == 1) {
//         current_selected[0].classList.remove('mis_button_selected');
//     }
//     this.classList.add('mis_button_selected');

//     if (this.id == 'urgency_button') {
//         document.getElementById("urgencytype").style.display = "block"
//         document.getElementById("Socailprooftype").style.display = "none";
//         document.getElementById("Scarcitytype").style.display = "none";

//     } else if (this.id == 'social_button') {
//         document.getElementById("Socailprooftype").style.display = "block";
//         document.getElementById("urgencytype").style.display = "none";
//         document.getElementById("Scarcitytype").style.display = "none";

//     } else if (this.id == 'scarcity_button') {
//         document.getElementById("Scarcitytype").style.display = "block";
//         document.getElementById("urgencytype").style.display = "none";
//         document.getElementById("Socailprooftype").style.display = "none";
//     }
// }

// document.getElementById("Fake_activity").addEventListener('click', typeSelect);
// document.getElementById("fake_countdown").addEventListener('click', typeSelect);
// document.getElementById("limited_time").addEventListener('click', typeSelect);
// document.getElementById("high_demand").addEventListener('click', typeSelect);
// document.getElementById("low_stock").addEventListener('click', typeSelect);

// function typeSelect() {
//     var type_selected = document.querySelectorAll('.all_types_button.type_button_selected');
//     if (type_selected.length == 1) {
//         type_selected[0].classList.remove('type_button_selected');
//     }
//     this.classList.add('type_button_selected');
// }


// chrome.runtime.sendMessage({ message: "SendReport", data: object_ofafasd },
//     function(response) {
//         console.log(response);
//     }
// )