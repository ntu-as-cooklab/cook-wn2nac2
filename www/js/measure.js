"use strict";

var newLat, newLong, newDesc;

var takeMeasurement = function()
{
    if ('undefined' !== typeof glbsens.currentMeasurement)
     { glbsens.currentMeasurement.observing ? glbsens.currentMeasurement.stop() : takeNewMeasurement(); }
    else
        takeNewMeasurement();
};

function takeNewMeasurement()
{
    glbsens.currentMeasurement = new WindooMeasurement();
    glbsens.currentMeasurement.duration = duration;
    glbsens.currentMeasurement.onTick = onMeasurementTick;
    glbsens.currentMeasurement.onFinish = onMeasurementFinish;
    glbsens.currentMeasurement.start();
    setMeasureButtonStatus(2);
};

function onMeasurementFinish()
{
    newMeasurementDone(glbsens.currentMeasurement);
    setIconStatusChecked(document.getElementById("measure-status-icon"));
    setMeasureButtonStatus(3);
};

function onMeasurementTick()
{
    var elapsed = Date.now() - glbsens.currentMeasurement.timeStarted;
    var progress = elapsed/glbsens.currentMeasurement.duration;
    var deg = 360 * progress;

    $('.ppc-progress-fill').css('transform','rotate('+ deg +'deg)');

    progress > 0.5 ? $('.progress-pie-chart').addClass('gt-50') : $('.progress-pie-chart').removeClass('gt-50');

    $('.ppc-percents span').html((progress*100).toFixed(0) + '%' + "<br><br>" + (elapsed/1000).toFixed(0) + "/" + glbsens.currentMeasurement.duration/1000 + "s");
}
