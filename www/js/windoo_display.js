"use strict"

//////////////// Windoo display base class /////////////////////////////////////

var WindooDisp = {};
WindooDisp.prototype = Object.create(HTMLElement.prototype);

WindooDisp.prototype.createdCallback = function()
{
    this.titleDiv      = document.createElement('div');
    this.unitDiv       = document.createElement('div');
    this.dataDiv    = document.createElement('div');
    this.dataDiv.innerHTML = "N/A";

    (this.graphIcon = document.createElement('i')).className = "windooGraphIcon icon";

    if (this.classList.contains("windoo-disp-small"))
    {
        this.insertBefore(this.graphIcon, this.firstChild);
        this.insertBefore(this.unitDiv, this.firstChild);
        this.insertBefore(this.dataDiv, this.firstChild);
        this.insertBefore(this.titleDiv, this.firstChild);
        this.titleDiv.classList.add("windoo-disp-title-small");
        this.unitDiv.classList.add("windoo-disp-unit-small");
        this.dataDiv.classList.add("windoo-disp-data-small");
    }
    else
    {
        this.insertBefore(this.graphIcon, this.firstChild);
        this.insertBefore(this.dataDiv, this.firstChild);
        this.insertBefore(this.unitDiv, this.firstChild);
        this.insertBefore(this.titleDiv, this.firstChild);
        this.classList.add("windoo-disp")
        this.titleDiv.classList.add("windoo-disp-title");
        this.unitDiv.classList.add("windoo-disp-unit");
        this.dataDiv.classList.add("windoo-disp-data");
    }
}

//////////////// Derived display classes: wind, temp, humd, pres ////////////////

var WindDisp = {};
var TempDisp = {};
var HumdDisp = {};
var PresDisp = {};
WindDisp.prototype = Object.create(WindooDisp.prototype);
TempDisp.prototype = Object.create(WindooDisp.prototype);
HumdDisp.prototype = Object.create(WindooDisp.prototype);
PresDisp.prototype = Object.create(WindooDisp.prototype);

// TODO
// if      (event.data < tempDisplay.innerHTML)
// {
//     tempGraphIcon.classList.remove  ("ion-arrow-graph-up-right");
//     tempGraphIcon.classList.add     ("ion-arrow-graph-down-right");
// }
// else if (event.data > tempDisplay.innerHTML)
// {
//     tempGraphIcon.classList.remove  ("ion-arrow-graph-down-right");
//     tempGraphIcon.classList.add     ("ion-arrow-graph-up-right");
// }

WindDisp.prototype.createdCallback = function()
{
    WindooDisp.prototype.createdCallback.call(this);
    this.titleDiv.innerHTML = txt.WIND_TITLE;
    this.unitDiv.innerHTML  = txt.WIND_UNIT;
    this.graphIcon.id   = "windGraphIcon";

    document.addEventListener('newWind',
        (function (instance) { return function (e) { instance.dataDiv.innerHTML = e.detail.toFixed(2); } })(this)
    )
};

TempDisp.prototype.createdCallback = function()
{
    WindooDisp.prototype.createdCallback.call(this);
    this.titleDiv.innerHTML = txt.TEMP_TITLE;
    this.unitDiv.innerHTML  = txt.TEMP_UNIT;
    this.graphIcon.id   = "tempGraphIcon";

    document.addEventListener('newTemp',
        (function (instance) { return function (e) { instance.dataDiv.innerHTML = e.detail.toFixed(2); } })(this)
    )
};

HumdDisp.prototype.createdCallback = function()
{
    WindooDisp.prototype.createdCallback.call(this);
    this.titleDiv.innerHTML = txt.HUMD_TITLE;
    this.unitDiv.innerHTML  = txt.HUMD_UNIT;
    this.graphIcon.id   = "humdGraphIcon";

    document.addEventListener('newHumd',
        (function (instance) { return function (e) { instance.dataDiv.innerHTML = e.detail.toFixed(2); } })(this)
    )
};

PresDisp.prototype.createdCallback = function()
{
    WindooDisp.prototype.createdCallback.call(this);
    this.titleDiv.innerHTML = txt.PRES_TITLE;
    this.unitDiv.innerHTML  = txt.PRES_UNIT;
    this.graphIcon.id   = "presGraphIcon";

    document.addEventListener('newPres',
        (function (instance) { return function (e) { instance.dataDiv.innerHTML = e.detail.toFixed(1); } })(this)
    )
};

WindDisp = document.registerElement('wind-disp', { prototype: WindDisp.prototype });
TempDisp = document.registerElement('temp-disp', { prototype: TempDisp.prototype });
HumdDisp = document.registerElement('humd-disp', { prototype: HumdDisp.prototype });
PresDisp = document.registerElement('pres-disp', { prototype: PresDisp.prototype });
