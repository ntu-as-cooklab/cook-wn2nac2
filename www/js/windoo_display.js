"use strict"

//////////////// Windoo display base class /////////////////////////////////////

var WindooDisp = {};
WindooDisp.prototype = Object.create(HTMLElement.prototype);

WindooDisp.prototype.createdCallback = function()
{
    this.classList.add("windooContainer");
    (this.titleDiv      = document.createElement('div')).className = "windooTitle";
    (this.unitDiv       = document.createElement('div')).className = "windooUnit";
    (this.displayDiv    = document.createElement('div')).className = "windooDisplay";
    this.displayDiv.innerHTML = "N/A";
    (this.graphDiv      = document.createElement('div')).className = "windoo-graph-container";
    this.appendChild(this.titleDiv);
    this.appendChild(this.unitDiv);
    this.appendChild(this.displayDiv);
    this.appendChild(this.graphDiv);
    (this.canvas = document.createElement('canvas')).className = "windoo-graph";
    this.graphDiv.appendChild(this.canvas);
    (this.graphIcon = document.createElement('i')).className = "windooGraphIcon icon";
    this.appendChild(this.graphIcon);
}

//////////////// Wind, temp, humd, pres derived display classes ////////////////

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
    this.graphDiv.id    = "wind-graph-container";
    this.canvas.id      = "wind-graph";
    this.graphIcon.id   = "windGraphIcon";
    this.titleDiv.innerHTML = txt.WIND_TITLE;
    this.unitDiv.innerHTML  = txt.WIND_UNIT;

    document.addEventListener('newWind',
        (function (instance) { return function (e) { instance.displayDiv.innerHTML = e.detail.toFixed(2); } })(this)
    )
};

TempDisp.prototype.createdCallback = function()
{
    WindooDisp.prototype.createdCallback.call(this);
    this.graphDiv.id    = "temp-graph-container";
    this.canvas.id      = "temp-graph";
    this.graphIcon.id   = "tempGraphIcon";
    this.titleDiv.innerHTML = txt.TEMP_TITLE;
    this.unitDiv.innerHTML  = txt.TEMP_UNIT;

    document.addEventListener('newTemp',
        (function (instance) { return function (e) { instance.displayDiv.innerHTML = e.detail.toFixed(2); } })(this)
    )
};

HumdDisp.prototype.createdCallback = function()
{
    WindooDisp.prototype.createdCallback.call(this);
    this.graphDiv.id    = "humd-graph-container";
    this.canvas.id      = "humd-graph";
    this.graphIcon.id   = "humdGraphIcon";
    this.titleDiv.innerHTML = txt.HUMD_TITLE;
    this.unitDiv.innerHTML  = txt.HUMD_UNIT;

    document.addEventListener('newHumd',
        (function (instance) { return function (e) { instance.displayDiv.innerHTML = e.detail.toFixed(2); } })(this)
    )
};

PresDisp.prototype.createdCallback = function()
{
    WindooDisp.prototype.createdCallback.call(this);
    this.graphDiv.id    = "pres-graph-container";
    this.canvas.id      = "pres-graph";
    this.graphIcon.id   = "presGraphIcon";
    this.titleDiv.innerHTML = txt.PRES_TITLE;
    this.unitDiv.innerHTML  = txt.PRES_UNIT;

    document.addEventListener('newPres',
        (function (instance) { return function (e) { instance.displayDiv.innerHTML = e.detail.toFixed(1); } })(this)
    )
};

WindDisp = document.registerElement('wind-disp', { prototype: WindDisp.prototype });
TempDisp = document.registerElement('temp-disp', { prototype: TempDisp.prototype });
HumdDisp = document.registerElement('humd-disp', { prototype: HumdDisp.prototype });
PresDisp = document.registerElement('pres-disp', { prototype: PresDisp.prototype });
