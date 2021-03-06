//when extension is opened via the icon, the session storage is checked to see if there is data already being stored there from a scan already done on the page, if not extension 
//opens as normal
window.onload = function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        var key = (tabs[0].id).toString();
        console.log(key);
        chrome.tabs.sendMessage(tabs[0].id, { message: "getpercentagescreenvisible" });
        chrome.storage.local.get([key], function(results) {
            if (results[key] == null) {
                console.log("chrome storage is empty");
            } else {
                chrome.storage.local.get([key + "_checkboxes"], function(results) {
                    checkboxDataDisplay(results[key + "_checkboxes"]);
                });
                let storage_data = results[key];
                if (Object.keys(storage_data.data.items_counts).length == 0) {
                    $("#no_detection, #full_results, #error").hide();
                    $("#infoContainer, #noDetection").show();
                    document.getElementById("detection_button").innerHTML = "Detect Dark Patterns";

                } else {
                    $("#no_detection, #noDetection, #error").hide();
                    $("#infoContainer, #full_results").show();
                    document.getElementById("number_detected").innerHTML = storage_data.data.total_counts
                    buildchart(storage_data.data);

                }
                $("#results_page").show();
                $("#about_page").hide();
                $("#about").removeClass("nav_list_active");
                $("#results").addClass("nav_list_active");
            }

        });

    });

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        let domain = new URL(tabs[0].url).hostname;
        document.getElementById("domain_name").innerHTML = domain;
        var key_check = `${tabs[0].id}_checkboxes`;
        try {
            chrome.storage.local.get([key_check], function(results) {

                console.log(results[key_check]);
                checkboxDataDisplay(results[key_check]);
            });
        } catch (e) {
            console.log(e);
        }
    });

    chrome.storage.local.get(['autoscan'], function(results) {
        console.log(results, autoscan);
        $("#autoscan").attr("checked", results.autoscan);
    });

    chrome.storage.local.get(['ORC'], function(results) {
        $("#id_switch_ORC").attr("checked", results.ORC);
    });

    chrome.storage.local.get({ filters: {} }, function(result) {
        console.log('filters:', result)
        for (let k in result.filters) {
            $(`#id_switch_${k}`).attr("checked", result.filters[k])
        }
    });

}


bindEvents();

function bindEvents() {
    $("#detection_button").on('click', getdata);
    $("#results, #reports, #settings, #about").on('click', switchtab);

    $('#render_list').on('click', '.dp-list-left', function() {

        $(this).find('.right-arrow').toggleClass('active')
        $(this).parent().siblings('.dp-list-detail-wrapper').slideToggle()
    })

    $('.switch').on('click', '#id_switch_FakeActivity, #id_switch_FakeCountdown, #id_switch_FakeLimitedTime, #id_switch_FakeLowStock, #id_switch_FakeHighDemand, #id_switch_Confirmshaming', function(e) {
        let category = $(this).attr('data-type')
        let status = $(this).is(':checked')
        console.log(status)
        chrome.storage.local.get({ filters: {} }, function(result) {
            let filters = result.filters;
            filters[category] = status
            chrome.storage.local.set({ filters }, function() {
                // you can use strings instead of objects
                // if you don't  want to define default values
                chrome.storage.local.get('filters', function(result) {
                    console.log(result.filters);
                });
            });
        });
    })
}

//controlls the 3 different tabs on the extension UI
function switchtab() {

    $(".nav_list_active").removeClass("nav_list_active");
    $(this).addClass("nav_list_active");

    if (this.id == "results") {
        $("#reports_page, #settings_page, #about_page").hide();
        $("#results_page").show();

    } else if (this.id == "reports") {
        $("#results_page, #settings_page, #about_page").hide();
        $("#reports_page").show();
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            let domain = new URL(tabs[0].url);
            document.getElementById("WebsiteURL").value = domain;
        });

    } else if (this.id == "settings") {
        $("#results_page, #reports_page, #about_page").hide();
        $("#settings_page").show();

    } else if (this.id == "about") {
        $("#results_page, #reports_page, #settings_page").hide();
        $("#about_page").show();
    }
}
//sends a message to background to detect patterns on page.
function getdata() {
    chrome.runtime.sendMessage({ message: "GetData" }, function() {
        $("#detection_button").html("Detecting...please wait").attr('disabled', true).css('background-color', 'grey');
    });
}

//fires once data is gotten back from the node server, if no patterns are found it does something and if patterns are found, it uses the data to build the results UI
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message == 'Data Retrieved') {
        $("#detection_button").html("Detect Dark Patterns").attr('disabled', false).css('background-color', '#FEDB00');
        $("#results_page").show();
        $("#reports_page, #about_page, #settings_page").hide();

        $(".nav_list_active").removeClass("nav_list_active");
        $("#results").addClass("nav_list_active");
        //console.log(Object.keys(request.data.data.items_counts).length);
        if (Object.keys(request.data.data.items_counts).length == 0) {
            $("#infoContainer, #noDetection").show();
            $("#no_detection, #full_results, #error").hide();
        } else {
            $("#infoContainer, #full_results").show();
            $("#no_detection, #noDetection, #error").hide();
            document.getElementById("number_detected").innerHTML = request.data.data.total_counts
            buildchart(request.data.data);
            console.log(request.data.data, '============---------------------')
        }
        sendResponse("Data arrived at Popup.js");
    } else if (request.message == "anErrorWasCaught") {
        $("#detection_button").html("Detect Dark Patterns").attr('disabled', false).css('background-color', '#FEDB00');
        $("#results_page, #error").show().html(request.data);
        $("#reports_page, #about_page, #settings_page, #no_detection").hide();
    }
});

//builds the doughnut chart using chartjs
function buildchart(data) {
    cat_colours = [];
    cat_names_split = [];
    //console.log(data.data.items_counts);

    const colours = { 'FakeActivity': "#fc34b4", 'FakeCountdown': "#fb0534", 'FakeHighDemand': "#0aca66", 'FakeLimitedTime': "#745cfc", 'FakeLowStock': "#f9a81e", 'Confirmshaming': "#08b0f7" };
    let categories = data.items_counts

    var cat_names = Object.keys(categories);
    cat_names.forEach(elem => {
        cat_names_split.push(elem.match(/[A-Z][a-z]+|[0-9]+/g).join(" "));
    });
    var cat_num = Object.values(categories);
    console.log(cat_names_split);

    for (x = 0; x < cat_names.length; x++) {
        cat_colours.push(colours[cat_names[x]]);
    }

    //console.log(cat_colours);
    Chart.helpers.each(Chart.instances, function(instance) {
        instance.destroy();
    });
    const canv = document.getElementById("doughnut_chart").getContext("2d");
    new Chart(canv, {
        type: 'doughnut',
        data: {

            labels: cat_names_split,
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
            onHover: (event, chartElement) => {
                event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
            },

            onClick: (e, activeEls) => {
                let dataIndex = activeEls[0].index;
                let label = e.chart.data.labels[dataIndex];
                $('#' + label.replace(/\s+/g, '')).trigger('click');
            },
            responsive: false
        }

    });

    renderlist(data);
}

//creates the list of categories on the restuls page, with a toggle switch for each one as well
function renderlist(data) {
    document.getElementById('render_list').innerHTML = '';

    data.grouped_details = _.groupBy(data.details, (item) => {
        return item.type_name
    });
    console.log(data);
    var parsedHtml = Ashe.parse($('#render_list_template').html(), data);
    $('#render_list').off('.mark')

    $('#render_list').on('click.mark', '.dp-list-detail', function() {
        //console.log(123)
        let key = $(this).attr('data-dp-key')

        let target = _.find(data.details, { key })
        chrome.runtime.sendMessage({
            message: "navigateToClickedElement",
            data: {
                tag: target.tag,
                content: target.content,
                tagType: target.tag_type
            }
        }, function(response) {
            console.log(response);
        });

    })
    $('#render_list').append(parsedHtml)

}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "checkboxes") {
        checkboxDataDisplay(request.data);
        sendResponse("checkbox data recieved!");
    } else if (request.message === "screenvisiblity") {
        displayPagePercentageVisible(request.data);
    }
})

function checkboxDataDisplay(data) {
    let unchecked = chrome.runtime.getURL("../images/unchecked_checkbox.png");
    let checked = chrome.runtime.getURL("../images/checked_checkbox.png");
    document.getElementById("totalcheckboxes").innerHTML = data[0];
    document.getElementById("checked_checkboxes").innerHTML = `<img src = ${unchecked} style = "width 20px; height=20px; vertical-align: middle; margin-right: 10px;"> <span style = "margin-right: 10px">-</span> <span>${data[0] - data[1]}</span>`;
    document.getElementById("unchecked_checkboxes").innerHTML = `<img src = ${checked} style = "width 20px; height=20px; vertical-align: middle; margin-right: 10px;"> <span style = "margin-right: 10px">-</span> <span>${data[1]}</span>`;
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.storage.local.set({
            [tabs[0].id + "_checkboxes"]: data
        });
    });
}

function displayPagePercentageVisible(percentage) {
    if (percentage < 90 || percentage == 100) {
        document.getElementById("screenpercentage").innerHTML = `<div class = "percentage_style percentage_colour_good">${percentage}%</div>`
    } else {
        document.getElementById("screenpercentage").innerHTML = `<div class = "percentage_style percentage_colour_bad">${percentage}%</div>`
    }
}