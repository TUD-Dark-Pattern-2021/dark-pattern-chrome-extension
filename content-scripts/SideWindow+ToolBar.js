//event listener which listens for a message sent by the background.js. 
//once correct message is recieved, runs the maincontroller function and responds to the background.js with the URL of webpage.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.callFunction === "ControllerFunction") {
        sendResponse({ message: document.body.innerHTML });
        MainController();
        return true;
    }
});

//function containing the logic for opening and closing the tool bar and side window. Controls what happens each based of off what is present on the page already.
function MainController() {
    let checkForSideWindow = document.getElementById("SideWindow");
    let checkforToolBar = document.getElementById("ToolBar");
    if (checkforToolBar == null && checkForSideWindow == null) {
        openToolBar();
    } else if (checkForSideWindow == null && checkforToolBar) {
        closeToolBar();
    } else if (checkforToolBar == null && checkForSideWindow) {
        closeSideWindow();
    }
}

//creates and injects the tool bar onto the current webpage. 
function openToolBar() {
    let img1 = chrome.runtime.getURL("../images/Folding.png"); //getting the url of the icons
    let img2 = chrome.runtime.getURL("../images/linehori.png");
    let img3 = chrome.runtime.getURL("../images/eyeopen.png");
    let img4 = chrome.runtime.getURL("../images/DPsetting.png");
    let img5 = chrome.runtime.getURL("../images/Setting.png");
    let img6 = chrome.runtime.getURL("../images/Quit.png");

    let sidebar = document.createElement('div');
    sidebar.id = "ToolBar";
    sidebar.className = "barcontainer1";
    //using template literals to create the injected html
    sidebar.innerHTML = `   
    <div class = "bar1">
    <div class="pic1"><input name="" id = "toggle" type="button" style=" width:36px; height:36px; box-shadow: none; cursor: pointer; border:0;background:url(${img1}) no-repeat"/></div>
                            <div class="pic2"><div><img class="pic2p" src="${img2}"></div></div>
                            <div class="pic3"><div class="pic3p"><input name="" type="button" style=" width:40px; height:36px; box-shadow: none; border:0;background:url(${img3}) no-repeat"/> </div></div>
                            <div class="pic4"><div class="pic4p"><input name="" type="button" style=" width:40px; height:36px; box-shadow: none; border:0;background:url(${img4}) no-repeat"/> </div></div>
                            <div class="pic5"><div class="pic5p"><input name="" type="button" style=" width:40px; height:36px; box-shadow: none; border:0; background:url(${img5}) no-repeat"/> </div></div>
                            <div class="pic6"><div class="pic6p"><input id = "closeSB" name="" type="button" style=" width:40px; height:50px; box-shadow: none; cursor: pointer; border:0; background:url(${img6}) no-repeat"/> </div></div>
                            </div>
                            </div>
                         `
    sidebar.onclick = function(event) {
        if (event.target.id === 'toggle') {
            openSideWindow();
            closeToolBar();
        } else if (event.target.id === 'closeSB') {
            closeToolBar();
        }
    }
    document.body.appendChild(sidebar);
}


//creates and injects the side window onto the current webpage, closes the tool bar aswell
function openSideWindow() {
    let img7 = chrome.runtime.getURL("../images/count.png");
    let img8 = chrome.runtime.getURL("../images/seting.png");
    let img9 = chrome.runtime.getURL("../images/exit.png");
    let img10 = chrome.runtime.getURL("../images/minimal.png");
    let sideWindow = document.createElement('div');
    sideWindow.id = "SideWindow";
    sideWindow.innerHTML = `<div class="DP-contentContainer" id="DB-contentsize" >
    <!--top paging button(report and checking)-->
    <div class="DP-pagingArea" >
        <!--(report and checking button)-->
        <div id="DP-div1">
        <input type="button" value="Checking" class="active" id="check"/>
        <input type="button" value="Report" id="report"/>
        </div >
        <!--(three icons on top)-->
        <div class="DP-functions-top">
            <!--top icons-->
            <div class="DP-functions-top-container">
                <div class="DP-settingicon"><img src="${img8}" style=" width:20px" alt=""/></div>
                <div class="DP-toolbaricon"><img src="${img10}" style=" width:13px"  alt=""/></div>
                <div class="DP-exiticon"><img src="${img9}" style=" width:13px"  alt=""></div>
            </div>
        </div>
    </div>
    <!--two paging this is checking page-->
    <div class="DP-checking-page DP-showpage" style="display:  block ;">
                    <div class="DP-checking-container">
                        <div class="DP-website-name">
                        ${window.location.host}
                        </div>
                        <!--dark pattern menu in the middle (it contain the rest of content of the sidewindow)-->
                        <div class="DP-darkpattern_list" id="DP-accordionMenu">

                            <div id="DP-accordion">
                                <!--dark pattern menu -->
                                <div id="DP-fathermenu" >
                                    <p class="DPp"  id="openMenu"><img src="${img7}" alt="?"/>Detect List</p>
                                    <div class="DP-dpMenu" style="display: none" >
                                    <div class="DP-chklist">
                                        <label>
                                            <input type="checkbox" name="checkItem" class="DP-checkboxx" />
                                            <span class="DP-checkboxx-span">&nbsp;Fake Activities</span><label for="DP-checkbox"></label>
                                        </label>
                                        <label>
                                            <input type="checkbox" name="checkItem" class="DP-checkboxx" id="DP-checkbox" />

                                            <span class="DP-checkboxx-span" >&nbsp;Fake Activities</span><label for="DP-checkbox"></label>

                                        </label>
                                        <label>
                                            <input type="checkbox" name="checkItem" class="DP-checkboxx" />
                                            <span class="DP-checkboxx-span">&nbsp;Fake Activities</span>
                                        </label>
                                        <label>
                                            <input type="checkbox" name="checkItem" class="DP-checkboxx"/>
                                            <span class="DP-checkboxx-span">&nbsp;Fake Activities</span>
                                        </label>

                                    </div>
                                    </div>
                                </div>
                                <!--rest of page--the checking button -->
                                <div class="DP-detection_button" id="Scan">

                                        <input type="button" value="Detecting" class="DP-detectionbtn" id="Scan"/>
                                    </div>
                                <!--rest of page--the result page -->

                                <div class="DP-analysis-result">
                                    <!--two areas can be switch -->
                                    <div id="DP-result-area">
                                        <!--switch button-->
                                        <div id="DP-result-area-button">
                                            <input type="button" value="Dark Patterns" class="DPactive_result" id="DPbt1" />
                                            <input type="button" value="Pie Chart" id="DPbt2"/>
                                        </div>
                                        <!--result page(only text)-->
                                            <div class='DP-resultArea DP-area' style="display: block">
                                                <div class="DP-textArea_container">
                                                    <div class="DP-text">
                                                        <div class="DP-dpcheckbox">
                                                                <label class="DPresulttext">
                                                                    <span class="DP-big_font">Fake Activities</span><br>
                                                                    <span class="DP-small_font">keywords: some words, XX XXXX,xxxxxx</span>
                                                                    <input type="checkbox"  class="DPcheckboxxx" />
                                                                </label>
                                                        </div>
                                                        <div class="DP-dpcheckbox">
                                                        <label class="DPresulttext">
                                                            <span class="DP-big_font" >Fake Activities</span><br>
                                                            <span class="DP-small_font" >keywords: some words, XX XXXX,xxxxxx</span>
                                                            <input type="checkbox" class="DPcheckboxxx"/>
                                                        </label>
                                                        </div>
                                                        <div class="DP-dpcheckbox">
                                                        <label class="DPresulttext">
                                                            <span class="DP-big_font">Fake Activities</span><br>
                                                            <span class="DP-small_font">keywords: some words, XX XXXX,xxxxxx</span>
                                                            <input type="checkbox"  class="DPcheckboxxx"/>
                                                        </label>
                                                        </div>
                                                   
                                                   
                                                    </div>
                                                </div>

                                            </div>
                                        <!--Pie chart page(chart)-->
                                            <div class='DP-piechartArea DP-area' style="display: none" id="dparea">

                                                    <div class="infoWrapper" style="position: fixed; top:10px; height:600px; width:360px;margin-right: 10px; border:none;background-color: transparent; border-radius: 20px; z-index: -99999999999;">
                                                        <div class="scroll"><i class="fa-arrow-left fa-lg"></i></div>
                                                        <div class="doughnut" style="top:420px;padding-top: 30px">
                                                            <div class="count" style="left:40px">
                                                                19
                                                            </div>
                                                        </div>
                                                    </div>

                                            </div>
                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
    <!--two paging this is report page-->
    <div class="DP-report-page DP-showpage" style="display: none">


    </div>

</div>
 `




    sideWindow.onclick = function(event) {
        if (event.target.id === 'closeSW') {
            closeSideWindow();
            openToolBar();
        } else if (event.target.id === 'Scan') {
            getData();
        }else if (event.target.id === 'check'){
            switchPage();

        }else if (event.target.id === 'report'){
            switchPage();

        }else if (event.target.id === 'openMenu'){
            openDPlist()

        }else if (event.target.id === 'DPbt1'){
            resultTextPie()

        }else if (event.target.id === 'DPbt2'){
            resultTextPie()
        }
    }
    document.body.appendChild(sideWindow);
    document.getElementById("ToolBar").remove();
}

//checking/Reporting
function switchPage(){
    $('#DP-div1').find('input').click(function() {
        $('#DP-div1').find('input').attr('class', '');
        $('.DP-contentContainer').find('.DP-showpage').css('display', 'none');
        $(this).attr('class', 'active');
        $('.DP-contentContainer').find('.DP-showpage').eq($(this).index()).css('display', 'block');

    })}

//detection list
function openDPlist(){
$("#DP-accordion>div>p").click( function (){
    if($(".DP-dpMenu").css("display")==="none"){
        $(".DP-dpMenu").css('display', 'block')
        $(this).nextAll().slideDown().end().parent().siblings().children("div");
    }else{
        $(".DP-dpMenu").css('display', 'none')
    }

})}
//check box
$('input[name="checkItem"]').change(function(){
    $("box2").prop('checked',true);
})
//textResult & Piechart
function resultTextPie() {
    $('#DP-result-area-button').find('input').click(function() {
        $('#DP-result-area-button').find('input').attr('class', '');
        $('#DP-result-area').find('.DP-area').css('display', 'none');
        $(this).attr('class', 'DPactiveresult');
        $('#DP-result-area').find('.DP-area').eq($(this).index()).css('display', 'block ');
    })
}



//removes tool bar from page
function closeToolBar() {
    document.getElementById("ToolBar").remove();
}
//removes side window from page. 
function closeSideWindow() {
    document.getElementById("SideWindow").remove();
}

//function to send message to bakcground script, sends the raw html of the current webapge to the background script along with the message
function getData() {
    chrome.runtime.sendMessage({ message: "Get Data", data: document.body.innerHTML },
        function(response) {
            console.log(response);
        }
    )
}