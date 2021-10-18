window.onload = function() {
    chrome.tabs.query({ active: true, currentWindow: true },
        function(tabs) {
            let domain = new URL(tabs[0].url).hostname
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
            console.log(response);
            document.getElementById("detection_button").innerHTML = "Detecting...please wait";
        });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'Data Retrieved') {
        console.log(request.data);
        sendResponse("Data arrived at Popup.js")
        document.getElementById("detection_button").innerHTML = "Detect Dark Patterns";
        document.getElementById("no_detection").style.display = 'none';

        buildchart(request.data);


    }
});

function buildchart(data) {
    console.log(data.data.items_counts);
    let categories = data.data.items_counts
    var cat_names = Object.keys(categories);
    var cat_num = Object.values(categories);
    console.log(cat_names);
    console.log(cat_num);

    const chart = document.getElementById("doughnut_chart");
    let doughnut_chart = new Chart(chart, {
        type: 'doughnut',
        data: {
            labels: cat_names,
            datasets: [{
                backgroundColor: ['red', 'blue', 'yellow', 'green', 'black', 'orange'],
                data: cat_num
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    align: 'start'
                }
            }
        }
    });
}