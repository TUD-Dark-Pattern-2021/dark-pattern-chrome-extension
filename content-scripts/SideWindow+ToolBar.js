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
        openSideWindow();
    } else if (checkForSideWindow == null && checkforToolBar) {
        closeToolBar();
    } else if (checkforToolBar == null && checkForSideWindow) {
        closeSideWindow();
    }
}

//creates and injects the tool bar onto the current webpage. 
function openToolBar() {
    let img1 = chrome.runtime.getURL("images/Folding.png"); //getting the url of the icons
    let img2 = chrome.runtime.getURL("images/linehori.png");
    let img3 = chrome.runtime.getURL("images/eyeopen.png");
    let img4 = chrome.runtime.getURL("images/DPsetting.png");
    let img5 = chrome.runtime.getURL("images/Setting.png");
    let img6 = chrome.runtime.getURL("images/Quit.png");
    let img7 = chrome.runtime.getURL("images/count.png");
    let img8 = chrome.runtime.getURL("images/seting.png");
    let img9 = chrome.runtime.getURL("images/exit.png");
    let img10 = chrome.runtime.getURL("images/minimal.png");
    let sidebar = document.createElement('div');
    sidebar.id = "ToolBar";
    sidebar.className = "barcontainer1";
    //using template literals to create the injected html
    sidebar.innerHTML = `
                   
                     <div class="contentContainer bar1" id="contentsize" >
    <!--top paging button(report and checking)-->
    <div class="pagingArea" >
        <!--(report and checking button)-->
        <div id="div1">
        <input type="button" value="Checking" class="active"/>
        <input type="button" value="Report"/>
        </div >
        <!--(three icons on top)-->
        <div class="functions-top">
            <!--top icons-->
            <div class="functions-top-container">
                <div class="settingicon"><img src="${img8}" width="20px" alt=""/></div>
                <div class="toolbaricon"><img src="${img10}" width="13px"  alt=""/></div>
                <div class="exiticon"><img src="${img9}" width="13px"  alt=""></div>
            </div>
        </div>
    </div>
    <!--two paging this is checking page-->
    <div class="checking-page showpage" style="display:  block ;">
                    <div class="checking-container">
                        <div class="website-name">
                        ${window.location.host}
                        </div>
                        <!--dark pattern menu in the middle (it contain the rest of content of the sidewindow)-->
                        <div class="darkpattern_list" id="accordionMenu">

                            <div id="accordion">
                                <!--dark pattern menu -->
                                <div id="fathermenu">
                                    <p><img src="${img7}" alt="?"/></p> <p>Detect List</p>
                                    <div class="dpMenu" style="display: none" >
                                    <div class="chklist">
                                        <label>
                                            <input type="checkbox" name="checkItem" class="checkboxx"/>
                                            <span>&nbsp;Fake Activities</span><label for="checkbox"></label>
                                        </label>
                                        <label>
                                            <input type="checkbox" name="checkItem" class="checkboxx" id="checkbox"/>

                                            <span>&nbsp;Fake Activities</span><label for="checkbox"></label>

                                        </label>
                                        <label>
                                            <input type="checkbox" name="checkItem" class="checkboxx"/>
                                            <span>&nbsp;Fake Activities</span>
                                        </label>
                                        <label>
                                            <input type="checkbox" name="checkItem" class="checkboxx"/>
                                            <span>&nbsp;Fake Activities</span>
                                        </label>

                                    </div>
                                    </div>
                                </div>
                                <!--rest of page--the checking button -->
                                <div class="detection_button">

                                        <input type="button" value="Detecting" class="detectionbtn"/>
                                    </div>
                                <!--rest of page--the result page -->

                                <div class="analysis-result">
                                    <!--two areas can be switch -->
                                    <div id="result-area">
                                        <!--switch button-->
                                        <div id="result-area-button">
                                            <input type="button" value="Dark Patterns" class="active_result"/>
                                            <input type="button" value="Pie Chart"/>
                                        </div>
                                        <!--result page(only text)-->
                                            <div class='resultArea area' style="display: block">
                                                <div class="textArea_container">
                                                    <div class="text">
                                                        <div class="dpcheckbox">
                                                                <label>
                                                                    <span class="big_font">Fake Activities</span><br>
                                                                    <span class="small_font">keywords: some words, XX XXXX,xxxxxx</span>
                                                                    <input type="checkbox"  />
                                                                </label>
                                                        </div>
                                                        <div class="dpcheckbox">
                                                        <label>
                                                            <span class="big_font" >Fake Activities</span><br>
                                                            <span class="small_font" >keywords: some words, XX XXXX,xxxxxx</span>
                                                            <input type="checkbox" />
                                                        </label>
                                                        </div>
                                                        <div class="dpcheckbox">
                                                        <label>
                                                            <span class="big_font">Fake Activities</span><br>
                                                            <span class="small_font">keywords: some words, XX XXXX,xxxxxx</span>
                                                            <input type="checkbox"/>
                                                        </label>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        <!--Pie chart page(chart)-->
                                            <div class='piechartArea area' style="display: none">
                                                <div class="pieArea_container">
                                                    <div class="infoWrapper">
                                                    <div class="scroll">
                                                        <i class="fa-arrow-left fa-lg"></i>
                                                    </div>
                                                </div>
                                                    <div class="doughnut">
                                                    <div class="count">
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
    <div class="report-page showpage" style="display: none;">

    </div>
</div>

<script type="text/javascript" src="js/jquery.js"></script>
<script type="text/javascript" src="js/sidewindow.js"></script>
                            <!--<div class="pic1"><input name="" id = "toggle" type="button" style=" width:36px; height:36px; box-shadow: none; cursor: pointer; border:0;background:url(${img1}) no-repeat"/></div>
                            <div class="pic2"><div><img class="pic2p" src="${img2}"></div></div>
                            <div class="pic3"><div class="pic3p"><input name="" type="button" style=" width:40px; height:36px; box-shadow: none; border:0;background:url(${img3}) no-repeat"/> </div></div>
                            <div class="pic4"><div class="pic4p"><input name="" type="button" style=" width:40px; height:36px; box-shadow: none; border:0;background:url(${img4}) no-repeat"/> </div></div>
                            <div class="pic5"><div class="pic5p"><input name="" type="button" style=" width:40px; height:36px; box-shadow: none; border:0; background:url(${img5}) no-repeat"/> </div></div>
                            <div class="pic6"><div class="pic6p"><input id = "closeSB" name="" type="button" style=" width:40px; height:50px; box-shadow: none; cursor: pointer; border:0; background:url(${img6}) no-repeat"/> </div></div>
                        </div>-->
                         
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
    let sideWindow = document.createElement('div');
    sideWindow.id = "SideWindow";
    sideWindow.className = "sidewindow";
   sideWindow.innerHTML = `<div id ="closeSW" class= "close_all">



                                <!--<i class="fa fa-chevron-down fa-lg minimizeIcon" id="closeSW"></i>
                                
                                
                                
                            </div>
                            <div class="infoWrapper" id="hello">
                            <input type="button" value="show" id="btn">
                            <div class = "website_name">${window.location.host}</div>
                            <div id = "infosection">
                                <div id = "somedata" class="scroll">
                                    <i class="fa fa-chevron-down fa-lg"></i>
                                </div>
                                <div class="doughnut">
                                    <div class="count">
                                        19
                                    </div>
                                </div> 
                            </div>
                            
                            <div id="menu_items" class="menu_item1"><a href=#>Dark Pattern Detection List</a></div>
                            <div class="hidden_options">Some other things to show when this option in hovered upon</div>
                            <div id="menu_items" class="menu_item2"><a href=#>Report</a></div>
                            <div id="menu_items" class="menu_item3"><a href=#>Extension update</a></div>
                            <div id="menu_items" class="menu_item4"><a href=#>Link to our website</a></div>
                            </div>->
                            
 
                            
                            
                            `;


    sideWindow.onclick = function(event) {
        if (event.target.id === 'closeSW') {
            closeSideWindow();
            openToolBar();
        } else if (event.target.id === 'GetData') {
            getData();
        }
    }
    document.body.appendChild(sideWindow);
    document.getElementById("ToolBar").remove();
}

//removes tool bar from page
function closeToolBar() {
    document.getElementById("ToolBar").remove();
}
//removes side window from page. 
function closeSideWindow() {
    document.getElementById("SideWindow").remove();
}

function getData() {
    chrome.runtime.sendMessage({ message: "Get Data", data: document.body.innerHTML },
        function(response) {
            console.log(response);
        }
    )
}