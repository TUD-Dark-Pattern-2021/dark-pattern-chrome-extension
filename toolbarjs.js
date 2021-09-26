
dragElement(document.getElementById(("moving")));
function dragElement(toolb) {
    var p1 = 0;
    var p2 = 0;
    var p3 = 0;
    var p4 = 0;
    if (document.getElementById(toolb.id + "moving")) {
        document.getElementById(toolb.id + "moving").onmousedown = dragMouseDown;
    } else {
        toolb.onmousedown = dragMouseDown;
    }
    function dragMouseDown(t) {
        t = t || window.event;
        p3 = t.clientX;
        p4 = t.clientY;
        document.onmouseup = closeDragElement;

        document.onmousemove = elementDrag;
    }

    function elementDrag(t) {
        t = t || window.event;
        p1 = p3 - t.clientX;
        p2 = p4 - t.clientY;
        p3 = t.clientX;
        p4 = t.clientY;
        toolb.style.top = (toolb.offsetTop - p2) + "px";
        toolb.style.left = (toolb.offsetLeft - p1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}


var div = document.getElementByIdx_x('d1');
div.setAttribute("class", "abc");
function changeStyle4() {
    var obj = document.getElementById("css");
    obj.setAttribute("href","stylesheetH.css");
}


