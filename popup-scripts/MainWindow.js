window.onload = function() {
    chrome.runtime.sendMessage({ message: "check session storage" }, function(response) {
        if (response == null) {

        } else {
            let storage_data = JSON.parse(response);
            if ((storage_data.details).length == 0) {
                document.getElementById("detection_button").innerHTML = "Detect Dark Patterns";
                document.getElementById("no_detection").style.display = 'none';
                document.getElementById("noDetection").style.display = 'block';

            } else {

                document.getElementById("no_detection").style.display = 'none';
                document.getElementById("infoContainer").style.display = 'block';
                document.getElementById("noDetection").style.display = 'none';
                document.getElementById("number_detected").innerHTML = storage_data.total_counts
                buildchart(storage_data);
            }
        }

    });


    chrome.tabs.query({ active: true, currentWindow: true },
        function(tabs) {
            let domain = new URL(tabs[0].url).hostname;
            document.getElementById("domain_name").innerHTML = domain;
        });


}

document.getElementById("results").addEventListener("click", switchtab);
document.getElementById("reports").addEventListener("click", switchtab);
document.getElementById("settings").addEventListener("click", switchtab);
document.getElementById("detection_button").addEventListener("click", getdata);

function switchtab(e) {
    let active = document.getElementsByClassName("nav_list_active");
    active[0].classList.remove("nav_list_active");
    document.getElementById(this.id).classList.add("nav_list_active");

    if (this.id == "results") {
        document.getElementById("results_page").style.display = "block";
        document.getElementById("reports_page").style.display = "none";
        document.getElementById("settings_page").style.display = "none";
    } else if (this.id == "reports") {
        document.getElementById("results_page").style.display = "none";
        document.getElementById("reports_page").style.display = "block";
        document.getElementById("settings_page").style.display = "none";
    } else if (this.id == "settings") {
        document.getElementById("results_page").style.display = "none";
        document.getElementById("reports_page").style.display = "none";
        document.getElementById("settings_page").style.display = "block";
    }

}

function getdata() {
    chrome.runtime.sendMessage({ message: "GetData" },
        function(response) {
            //console.log(response);
            document.getElementById("detection_button").innerHTML = "Detecting...please wait";
        });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'Data Retrieved') {
        //console.log(request.data);
        sendResponse("Data arrived at Popup.js");
        if ((request.data.data.details).length == 0) {
            document.getElementById("detection_button").innerHTML = "Detect Dark Patterns";
            document.getElementById("no_detection").style.display = 'none';
            document.getElementById("noDetection").style.display = 'block';

        } else {

            document.getElementById("detection_button").innerHTML = "Detect Dark Patterns";
            document.getElementById("no_detection").style.display = 'none';
            document.getElementById("infoContainer").style.display = 'block';
            document.getElementById("noDetection").style.display = 'none';
            document.getElementById("number_detected").innerHTML = request.data.data.total_counts
            buildchart(request.data.data);
        }
        chrome.runtime.sendMessage({ message: "Put Data in Storage", data: JSON.stringify(request.data.data) }, function(response) {
            console.log(response);
        });
    }
});

function buildchart(data) {
    cat_colours = [];
    //console.log(data.data.items_counts);

    const colours = { 'Scarcity': "#FF5869", 'Misdirection': "#FF8200", 'Urgency': "#FEDB00", 'Social Proof': "#69B3E7", 'Obstruction': "#FC9BB3" };
    let categories = data.items_counts

    var cat_names = Object.keys(categories);
    var cat_num = Object.values(categories);
    //console.log(cat_names);

    for (x = 0; x < cat_names.length; x++) {
        cat_colours.push(colours[cat_names[x]]);
    }

    //console.log(cat_colours);
    Chart.helpers.each(Chart.instances, function(instance) {
        instance.destroy();
    });
    const chart = document.getElementById("doughnut_chart");
    let doughnut_chart = new Chart(chart, {
        type: 'doughnut',
        data: {

            labels: cat_names,
            datasets: [{
                backgroundColor: cat_colours,
                data: cat_num
            }],
            hoverOffset: 4
        },
        options: {
            plugins: {
                legend: {
                    display: false
                },
            },
            responsive: false
        }
    });
    renderlist(cat_names)
}



function renderlist(category_names) {
    document.getElementById('render_list').innerHTML = '';
    for (let i = 0; i < category_names.length; i++) {

        if (category_names[i] == 'Misdirection') {
            img = chrome.runtime.getURL("../images/Misdirection.png");
        } else if (category_names[i] == 'Social Proof') {
            img = chrome.runtime.getURL("../images/SocialProof.png");
        } else if (category_names[i] == 'Scarcity') {
            img = chrome.runtime.getURL("../images/Scarcity.png");
        } else if (category_names[i] == 'Obstruction') {
            img = chrome.runtime.getURL("../images/Obstruction.png");
        } else if (category_names[i] == 'Urgency') {
            img = chrome.runtime.getURL("../images/Urgency.png");
        }
        let cont = document.createElement('div')
        cont.innerHTML = `  
        <img src = "${img}" class = "img_sizing"><span class = "category_list">${category_names[i]} </span><span class = "switch_wrapper"><label class="switch"><input type="checkbox" checked id = ${category_names[i]}><span class="slider"></label></span>
        `

        cont.addEventListener('click', function(event) {
            if (event.target.id == "Misdirection") {
                removeMisdirectionIcons();
            } else if (event.target.id == "Obstruction") {
                removeMisdirectionIcons();
            } else if (event.target.id == "Urgency") {
                removeMisdirectionIcons();
            } else if (event.target.id == "Social Proof") {
                removeMisdirectionIcons();
            } else if (event.target.id == "Scarcity") {
                removeMisdirectionIcons();
            }
        })
        document.getElementById('render_list').appendChild(cont);
    }
}


function removeMisdirectionIcons() {
    let checkbox = document.getElementById('Urgency');
    if (checkbox.checked == true) {
        alert("hello");
        chrome.runtime.sendMessage({ message: "MisdirectionToogleOn" }, function(response) {
            console.log(response);
        })
    } else {
        alert("goodbye");
        chrome.runtime.sendMessage({ message: "MisdirectionToogleOff" }, function(response) {
            console.log(response);
        })
    }
}