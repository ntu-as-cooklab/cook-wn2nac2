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
            break;
        case 1:
            this.innerHTML = txt.WINDOO_CALIBRATING
            this.classList.remove("button-assertive");
            this.classList.add("button-energized");
            this.classList.remove("button-balanced");
            break;
        case 2:
            this.innerHTML = txt.WINDOO_CALIBRATED
            this.classList.remove("button-assertive");
            this.classList.remove("button-energized");
            this.classList.add("button-balanced");
            break;
    }
}

WindooStatusBar.prototype.createdCallback = function() {

    this.setStatus(0);
    document.addEventListener('windooStatusChanged',
        (function (instance) { return function (e) { instance.setStatus(e.detail); } })(this)
    )

};

WindooStatusBar = document.registerElement('windoo-status-bar', { prototype: WindooStatusBar.prototype });
