"use strict";



var takeMeasurement = function()
{
    currentMeasurement = new WindooMeasurement();
    currentMeasurement.onFinish = function()
    {
        WeatherHistory.push(currentMeasurement);
    };
    currentMeasurement.duration = 1000;
    currentMeasurement.start();
};
