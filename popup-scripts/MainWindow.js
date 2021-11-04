//when extension is opened via the icon, the session storage is checked to see if there is data already being stored there from a scan already done on the page, if not extension 
//opens as normal
window.onload = function() {

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        let key = (tabs[0].id).toString();
        console.log(key);
        chrome.storage.sync.get([key], function(results) {
            console.log(results[key]);
            if (results[key] == null) {
                console.log("chrome storage is empty");
            } else {
                let storage_data = results[key];

                console.log(storage_data.data.details);
                if ((storage_data.data.details).length == 0) {
                    document.getElementById("detection_button").innerHTML = "Detect Dark Patterns";
                    document.getElementById("no_detection").style.display = 'none';
                    document.getElementById("noDetection").style.display = 'block';

                } else {

                    document.getElementById("no_detection").style.display = 'none';
                    document.getElementById("infoContainer").style.display = 'block';
                    document.getElementById("noDetection").style.display = 'none';
                    document.getElementById("number_detected").innerHTML = storage_data.data.total_counts
                    buildchart(storage_data.data);
                }
            }
        });
    });

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        let domain = new URL(tabs[0].url).hostname;
        document.getElementById("domain_name").innerHTML = domain;
    });

    chrome.storage.sync.get(['autoscan'], function(results) {
        if (results.autoscan == true) {
            document.getElementById("autoscan").checked = true;
        }
    });
}





document.getElementById("results").addEventListener("click", switchtab);
document.getElementById("reports").addEventListener("click", switchtab);
document.getElementById("settings").addEventListener("click", switchtab);
document.getElementById("detection_button").addEventListener("click", getdata);
bindEvents()
function bindEvents() {
    $('#render_list').on('click', '#id_switch_FakeActivity', function (e) {
        removeFakeActivityIcons();
    })
    $('#render_list').on('click', '#id_switch_FakeCountdown', function (e) {
        removeFakeCountdownIcons();
    })
    $('#render_list').on('click', '#id_switch_FakeHighDemand', function (e) {
        removeFakeHighDemandIcons();
    })
    $('#render_list').on('click', '#id_switch_FakeLimitedTime', function (e) {
        removeFakeLimitedTimeIcons();
    })
    $('#render_list').on('click', '#id_switch_FakeLowStock', function (e) {
        removeFakeLowStockIcons();
    })
    $('#render_list').on('click', '.dp-list-left', function () {
        $(this).find('.right-arrow').toggleClass('active')
        $(this).parent().siblings('.dp-list-detail-wrapper').slideToggle()
    })
}
//controlls the 3 different tabs on the extension UI
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
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            let domain = new URL(tabs[0].url);
            document.getElementById("WebsiteURL").value = domain;
        });
    } else if (this.id == "settings") {
        document.getElementById("results_page").style.display = "none";
        document.getElementById("reports_page").style.display = "none";
        document.getElementById("settings_page").style.display = "block";
    }

}
//sends a message to background to detect patterns on page.
function getdata() {
    chrome.runtime.sendMessage({ message: "GetData" },
        function(response) {
            //console.log(response);
            document.getElementById("detection_button").innerHTML = "Detecting...please wait";
        });
}

//fires once data is gotten back from the node server, if no patterns are found it does something and if patterns are found, it uses the data to build the results UI
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message == 'Data Retrieved') {
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

    }
});

//builds the doughnut chart using chartjs
function buildchart(data) {
    cat_colours = [];
    //console.log(data.data.items_counts);

    const colours = { 'FakeActivity': "#FF5869", 'FakeCountdown': "#FF8200", 'FakeHighDemand': "#FEDB00", 'FakeLimitedTime': "#69B3E7", 'FakeLowStock': "#FC9BB3" };
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

    renderlist(data)
}


//creates the list of categories on the restuls page, with a toggle switch for each one as well
function renderlist(data) {
    document.getElementById('render_list').innerHTML = '';

    data.grouped_details = _.groupBy(data.details, (item) => {
        return item.category_name
    })
    console.log(data)
    var parsedHtml = Ashe.parse($('#render_list_template').html(), data);
    console.log(parsedHtml)
    $('#render_list').off('.mark')
    $('#render_list').on('click.mark', '.dp-list-detail', function (){
        console.log(123)
        let key = $(this).attr('data-dp-key')
        let target = _.find(data.details, {key})
        console.log(key)
        chrome.runtime.sendMessage({ message: "navigateToClickedElement", data: target.tag }, function(response) {
            console.log(response);
        });

    })
    $('#render_list').append(parsedHtml)
    // }
    // chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    //     var checkboxes = document.querySelectorAll('')
    // });
}

// function savecheckboxstate() {


// }


//to remove the misdirection icon once switch is toggled.
function removeFakeActivityIcons() {
    let checkbox = document.getElementById('id_switch_FakeActivity');
    if (checkbox.checked == true) {
        var toggle_icon = 'off';
    } else {
        var toggle_icon = 'on';
    }
    chrome.runtime.sendMessage({ message: "FakeActivityToggle", data: toggle_icon }, function(response) {
        console.log(response);
    });
}

function removeFakeCountdownIcons() {
    let checkbox = document.getElementById('id_switch_FakeCountdown');
    if (checkbox.checked == true) {
        var toggle_icon = 'off';
    } else {
        var toggle_icon = 'on';
    }
    chrome.runtime.sendMessage({ message: "FakeCountdownToggle", data: toggle_icon }, function(response) {
        console.log(response);
    });
}

function removeFakeHighDemandIcons() {
    let checkbox = document.getElementById('id_switch_FakeHighDemand');
    if (checkbox.checked == true) {
        var toggle_icon = 'off';
    } else {
        var toggle_icon = 'on';
    }
    chrome.runtime.sendMessage({ message: "FakeHighDemandToggle", data: toggle_icon }, function(response) {
        console.log(response);
    });
}

function removeFakeLimitedTimeIcons() {
    let checkbox = document.getElementById('id_switch_FakeLimitedTime');
    if (checkbox.checked == true) {
        var toggle_icon = 'off';
    } else {
        var toggle_icon = 'on';
    }
    chrome.runtime.sendMessage({ message: "FakeLimitedTimeDemandToggle", data: toggle_icon }, function(response) {
        console.log(response);
    });
}

function removeFakeLowStockIcons() {
    let checkbox = document.getElementById('id_switch_FakeLowStock');
    if (checkbox.checked == true) {
        var toggle_icon = 'off';
    } else {
        var toggle_icon = 'on';
    }
    chrome.runtime.sendMessage({ message: "FakeLowStockDemandToggle", data: toggle_icon }, function(response) {
        console.log(response);
    });
}