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
        _.interval = setInterval(_.onTick, 1000);
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

    _.finalizeWind = function()
    {
        _.minWind = _.wind[0]; _.maxWind = _.wind[0];
        for (var i=0; i<_.wind.length; i++)
        {
            if (_.wind[i] < _.minWind) _.minWind = _.wind[i];
            if (_.wind[i] > _.maxWind) _.maxWind = _.wind[i];
            _.avgWind += _.wind[i];
        }
        _.avgWind /= _.wind.length;
    };
    _.finalizeTemp = function()
    {
        _.minTemp = _.temp[0]; _.maxTemp = _.temp[0];
        for (var i=0; i<_.temp.length; i++)
        {
            if (_.temp[i] < _.minTemp) _.minTemp = _.temp[i];
            if (_.temp[i] > _.maxTemp) _.maxTemp = _.temp[i];
            _.avgTemp += _.temp[i];
        }
        _.avgTemp /= _.temp.length;
    };
    _.finalizeHumd = function()
    {
        _.minHumd = _.humd[0]; _.maxHumd = _.humd[0];
        for (var i=0; i<_.humd.length; i++)
        {
            if (_.humd[i] < _.minHumd) _.minHumd = _.humd[i];
            if (_.humd[i] > _.maxHumd) _.maxHumd = _.humd[i];
            _.avgHumd += _.humd[i];
        }
        _.avgHumd /= _.humd.length;
    };
    _.finalizePres = function()
    {
        _.minPres = _.pres[0]; _.maxPres = _.pres[0];
        for (var i=0; i<_.pres.length; i++)
        {
            if (_.pres[i] < _.minPres) _.minPres = _.pres[i];
            if (_.pres[i] > _.maxPres) _.maxPres = _.pres[i];
            _.avgPres += _.pres[i];
        }
        _.avgPres /= _.pres.length;
    };

    _.finalize = function()
    {
        _.finalizeWind();
        _.finalizeTemp();
        _.finalizeHumd();
        _.finalizePres();
    };
}
