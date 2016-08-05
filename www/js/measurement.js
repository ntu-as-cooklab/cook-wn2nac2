"use strict";

var WindooObservation = function()
{
    this.observing     = false;
    this.wind          = [];
    this.temp          = [];
    this.humd          = [];
    this.pres          = [];
    this.windTime      = [];
    this.tempTime      = [];
    this.humdTime      = [];
    this.presTime      = [];
    this.duration      = 0;
};

WindooObservation.prototype.enable = function()
{
    //console.log("Enabling...");
    this.observing = true;
};

WindooObservation.prototype.disable = function()
{
    //console.log("Disabling...");
    this.observing = false;
};

WindooObservation.prototype.addWind = function(newVal, newTime = Date.now())
{
    this.wind.push(newVal)
    this.windTime.push(newTime)
};
WindooObservation.prototype.addTemp = function(newVal, newTime = Date.now())
{
    this.temp.push(newVal)
    this.tempTime.push(newTime)
};
WindooObservation.prototype.addHumd = function(newVal, newTime = Date.now())
{
    this.humd.push(newVal)
    this.humdTime.push(newTime)
};
WindooObservation.prototype.addPres = function(newVal, newTime = Date.now())
{
    this.pres.push(newVal)
    this.presTime.push(newTime)
};

/////////////////// WindooMeasurement class ///////////////////

var WindooMeasurement = function()
{
    WindooObservation.call(this);
    this.id                 = 0;
    this.userId             = 0;
    this.timeStarted        = 0;
    this.timeFinished       = 0;
    this.latitude           = 0;
    this.longitude          = 0;
    this.windDirection      = -1;
    this.weatherType        = 0;
    this.comment            = "";
    this.photo              = null;
    this.avgWind            = 0;
    this.avgTemp            = 0;
    this.avgHumd            = 0;
    this.avgPres            = 0;
    this.minWind            = 0;
    this.minTemp            = 0;
    this.minHumd            = 0;
    this.minPres            = 0;
    this.maxWind            = 0;
    this.maxTemp            = 0;
    this.maxHumd            = 0;
    this.maxPres            = 0;
    this.onFinish           = null;
    this.onTick             = null;
    this.interval           = null;
};

WindooMeasurement.prototype = Object.create(WindooObservation.prototype);
WindooMeasurement.prototype.constructor = WindooMeasurement;

WindooMeasurement.prototype.start = function()
{
    //console.log("Starting...");
    this.enable();
    this.timeStarted   = Date.now();
    this.interval = setInterval(this.onTick, 1000);
    setTimeout( (function(measurement) { return function(){ measurement.stop(); }; })(this) , this.duration);
};

WindooMeasurement.prototype.stop = function()
{
    //console.log("Stopping...")
    //console.log(this);
    clearInterval(this.interval);
    this.disable();
    this.timeFinished  = Date.now();
    this.finalize();
    if (this.onFinish) this.onFinish();
};

WindooMeasurement.prototype.finalizeWind = function()
{
    this.minWind = this.wind[0];
    this.maxWind = this.wind[0];
    this.avgWind = 0;
    for (var i=0; i<this.wind.length; i++)
    {
        if (this.wind[i] < this.minWind) this.minWind = this.wind[i];
        if (this.wind[i] > this.maxWind) this.maxWind = this.wind[i];
        this.avgWind += this.wind[i];
    }
    this.avgWind /= this.wind.length;
};

WindooMeasurement.prototype.finalizeTemp = function()
{
    this.minTemp = this.temp[0];
    this.maxTemp = this.temp[0];
    this.avgTemp = 0;
    for (var i=0; i<this.temp.length; i++)
    {
        if (this.temp[i] < this.minTemp) this.minTemp = this.temp[i];
        if (this.temp[i] > this.maxTemp) this.maxTemp = this.temp[i];
        this.avgTemp += this.temp[i];
    }
    this.avgTemp /= this.temp.length;
};

WindooMeasurement.prototype.finalizeHumd = function()
{
    this.minHumd = this.humd[0];
    this.maxHumd = this.humd[0];
    this.avgHumd = 0;
    for (var i=0; i<this.humd.length; i++)
    {
        if (this.humd[i] < this.minHumd) this.minHumd = this.humd[i];
        if (this.humd[i] > this.maxHumd) this.maxHumd = this.humd[i];
        this.avgHumd += this.humd[i];
    }
    this.avgHumd /= this.humd.length;
};

WindooMeasurement.prototype.finalizePres = function()
{
    this.minPres = this.pres[0];
    this.maxPres = this.pres[0];
    this.avgPres = 0;
    for (var i=0; i<this.pres.length; i++)
    {
        if (this.pres[i] < this.minPres) this.minPres = this.pres[i];
        if (this.pres[i] > this.maxPres) this.maxPres = this.pres[i];
        this.avgPres += this.pres[i];
    }
    this.avgPres /= this.pres.length;
};

WindooMeasurement.prototype.finalize = function()
{
    this.finalizeWind();
    this.finalizeTemp();
    this.finalizeHumd();
    this.finalizePres();
};
