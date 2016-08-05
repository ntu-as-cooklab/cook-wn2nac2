"use strict";

var newLat, newLong, newDesc;

var takeMeasurement = function()
{
    if ('undefined' !== typeof glbsens.currentMeasurement)
     { if (glbsens.currentMeasurement.observing) glbsens.currentMeasurement.stop(); else takeNewMeasurement(); }
    else {
        takeNewMeasurement();
    }
};

function takeNewMeasurement()
{
    //console.log("aha");
    glbsens.currentMeasurement = new WindooMeasurement();
        setMeasureButtonStatus(2);
        glbsens.currentMeasurement.onFinish = function()
        {
            setIconStatusChecked(document.getElementById("measure-status-icon"));
            setMeasureButtonStatus(3);

            //alert("Wind: " + glbsens.currentMeasurement.avgWind.toFixed(2) + "\nTemp: " + glbsens.currentMeasurement.avgTemp.toFixed(2) +
            //"\nHumd: " + glbsens.currentMeasurement.avgHumd.toFixed(2) + "\nPres: " + glbsens.currentMeasurement.avgPres.toFixed(2));

            newMeasurementDone(glbsens.currentMeasurement);
        };
        glbsens.currentMeasurement.onTick = function()
        {
            //console.log("before measurement tick")
            onMeasurementTick();
        };
        glbsens.currentMeasurement.duration = duration;
        glbsens.currentMeasurement.start();
}

function onMeasurementTick()
{
    var elapsed = Date.now() - glbsens.currentMeasurement.timeStarted;
    var progress = elapsed/glbsens.currentMeasurement.duration;
    var deg = 360 * progress;

    //console.log("Measurement: " + (progress * 100) + "%");
    $('.ppc-progress-fill').css('transform','rotate('+ deg +'deg)');

    progress > 0.5 ? $('.progress-pie-chart').addClass('gt-50') : $('.progress-pie-chart').removeClass('gt-50');

    $('.ppc-percents span').html((progress*100).toFixed(0) + '%' + "<br><br>" + (elapsed/1000).toFixed(0) + "/" + glbsens.currentMeasurement.duration/1000 + "s");
}
