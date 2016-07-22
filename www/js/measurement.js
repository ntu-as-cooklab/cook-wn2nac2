"use strict";

var WindooObservation = function(_ = this)
{
    _.observing     = false;
    _.wind          = [];
    _.temp          = [];
    _.humd          = [];
    _.pres          = [];
    _.windTime      = [];
    _.tempTime      = [];
    _.humdTime      = [];
    _.presTime      = [];
    _.duration      = 0;

    _.enable = function()
    {
        _.observing = true;
    };

    _.disable = function()
    {
        _.observing     = false;
    };

    var add = function(val, time)
    {
        return function(newVal, newTime = Date.now())
        {
            val.push(newVal)
            time.push(newTime)
        };
    };
    _.addWind = add(_.wind, _.windTime);
    _.addTemp = add(_.temp, _.tempTime);
    _.addHumd = add(_.humd, _.humdTime);
    _.addPres = add(_.pres, _.presTime);

    var purge = function(val, time)
    {
        return function()
        {
            var noEarlierThan = Date.now() - _.duration;
            while (time[0] < noEarlierThan)
            {
                val.shift();
                time.shift();
            }
        };
    };
    _.purgeWind = purge(_.wind, _.windTime);
    _.purgeTemp = purge(_.temp, _.tempTime);
    _.purgeHumd = purge(_.humd, _.humdTime);
    _.purgePres = purge(_.pres, _.presTime);
    _.purge = function()
    {
        _.purgeWind();
        _.purgeTemp();
        _.purgeHumd();
        _.purgePres();
    };
    var purger;
    _.enablePurge = function(purgeInterval)
    {
        purger = setInterval(_.purge, purgeInterval);
    };
    _.disablePurge = function()
    {
        clearInterval(purger);
    };
};

var WindooMeasurement = function(_ = this)
{
    WindooObservation(_);
    _.id                 = 0;
    _.userId             = 0;
    _.timeStarted        = 0;
    _.timeFinished       = 0;
    _.windDirection      = -1;
    _.weatherType        = 0;
    _.comment            = "";
    _.photo              = null;
    _.avgWind            = 0;
    _.avgTemp            = 0;
    _.avgHumd            = 0;
    _.avgPres            = 0;
    _.minWind            = 0;
    _.minTemp            = 0;
    _.minHumd            = 0;
    _.minPres            = 0;
    _.maxWind            = 0;
    _.maxTemp            = 0;
    _.maxHumd            = 0;
    _.maxPres            = 0;
    _.onFinish           = null;
    _.onTick             = null;
    _.interval           = null;

    _.start = function()
    {
        _.enable();
        _.timeStarted   = Date.now();
        interval = setInterval(_.onTick, 1000);
        setTimeout(_.stop, _.duration);
    };

    _.stop = function()
    {
        clearInterval(_.interval);
        _.disable();
        _.timeFinished  = Date.now();
        _.finalize();
        if (typeof _.onFinish == 'function') _.onFinish();
    };

    var finalize = function(val, time, avg, min, max)
    {
        return function()
        {
            for (var i=0; i<val.length; i++)
            {
                if (val[i] < min) min = val[i];
                if (val[i] > max) max = val[i];
                avg += val[i];
            }
            avg /= val.length;
        };
    };
    _.finalizeWind = finalize(_.wind, _.windTime, _.avgWind, _.minWind, _.maxWind);
    _.finalizeTemp = finalize(_.temp, _.tempTime, _.avgTemp, _.minTemp, _.maxTemp);
    _.finalizeHumd = finalize(_.humd, _.humdTime, _.avgHumd, _.minHumd, _.maxHumd);
    _.finalizePres = finalize(_.pres, _.presTime, _.avgPres, _.minPres, _.maxPres);

    _.finalize = function()
    {
        _.finalizeWind();
        _.finalizeTemp();
        _.finalizeHumd();
        _.finalizePres();
    };
}
