document.getElementById("urgency_button").addEventListener('click', displayTypes);
document.getElementById("social_button").addEventListener('click', displayTypes);
document.getElementById("scarcity_button").addEventListener('click', displayTypes);



function displayTypes() {
    document.getElementById("type_wrapper").style.display = "block";
    var current_selected = document.querySelectorAll('.mis_button.mis_button_selected');
    if (current_selected.length == 1) {
        current_selected[0].classList.remove('mis_button_selected');
    }
    this.classList.add('mis_button_selected');

    if (this.id == 'urgency_button') {
        document.getElementById("urgencytype").style.display = "block"
        document.getElementById("Socailprooftype").style.display = "none";
        document.getElementById("Scarcitytype").style.display = "none";

    } else if (this.id == 'social_button') {
        document.getElementById("Socailprooftype").style.display = "block";
        document.getElementById("urgencytype").style.display = "none";
        document.getElementById("Scarcitytype").style.display = "none";

    } else if (this.id == 'scarcity_button') {
        document.getElementById("Scarcitytype").style.display = "block";
        document.getElementById("urgencytype").style.display = "none";
        document.getElementById("Socailprooftype").style.display = "none";
    }
}

document.getElementById("Fake_activity").addEventListener('click', typeSelect);
document.getElementById("fake_countdown").addEventListener('click', typeSelect);
document.getElementById("limited_time").addEventListener('click', typeSelect);
document.getElementById("high_demand").addEventListener('click', typeSelect);
document.getElementById("low_stock").addEventListener('click', typeSelect);

function typeSelect() {
    var type_selected = document.querySelectorAll('.all_types_button.type_button_selected');
    if (type_selected.length == 1) {
        type_selected[0].classList.remove('type_button_selected');
    }
    this.classList.add('type_button_selected');
}