"use strict"

var WindooStatusBar = {};
WindooStatusBar.prototype = Object.create(HTMLElement.prototype);

WindooStatusBar.prototype.setStatus = function (status)
{
    switch(status)
    {
        case 0:
            this.innerHTML = txt.WINDOO_NOT_CONNECTED
            this.classList.add("button-assertive");
            this.classList.remove("button-energized");
            this.classList.remove("button-balanced");
            $("#showMeasureInfo").html('<div  class="bar bar-footer bar-energized"> <div class="title">Need to Connect Windoo to Start</div> </div>');
            break;
        case 1:
            this.innerHTML = txt.WINDOO_CALIBRATING
            this.classList.remove("button-assertive");
            this.classList.add("button-energized");
            this.classList.remove("button-balanced");
            $("#showMeasureInfo").html('<div  class="bar bar-footer bar-energized"> <div class="title">Need to Connect Windoo to Start</div> </div>');
            break;
        case 2:
            this.innerHTML = txt.WINDOO_CALIBRATED
            this.classList.remove("button-assertive");
            this.classList.remove("button-energized");
            this.classList.add("button-balanced");
            $("#showMeasureInfo").html('<div  class="bar bar-footer bar-positive"> <div class="title">Click "Start" to Measure the Data</div> </div>');
            break;
    }
}

WindooStatusBar.prototype.createdCallback = function()
{
    this.className = "windoo-status-bar button button-full";
    this.setStatus(windooStatus);
    document.addEventListener('windooStatusChanged',
        (function (instance) { return function (e) { instance.setStatus(e.detail); } })(this)
    )
    document.addEventListener('skywatchStatusChanged',
        (function (instance) { return function (e) { instance.setStatus(e.detail); } })(this)
    )
};

WindooStatusBar = document.registerElement('windoo-status-bar', { prototype: WindooStatusBar.prototype });
