"use strict";

var newLat, newLong, newDesc;

var takeMeasurement = function()
{
    if ('undefined' !== typeof currentMeasurement)
     { if (currentMeasurement.observing) currentMeasurement.stop(); else takeNewMeasurement(); }
    else {
        takeNewMeasurement();
    }
};

function takeNewMeasurement()
{
    currentMeasurement = new WindooMeasurement();
        setMeasureButtonStatus(2);
        currentMeasurement.onFinish = function()
        {
            setIconStatusChecked(document.getElementById("measure-status-icon"));
            setMeasureButtonStatus(3);

            alert("Wind: " + currentMeasurement.avgWind.toFixed(2) + "\nTemp: " + currentMeasurement.avgTemp.toFixed(2) +
            "\nHumd: " + currentMeasurement.avgHumd.toFixed(2) + "\nPres: " + currentMeasurement.avgPres.toFixed(2));

            newMeasurementDone(currentMeasurement);
        };
        currentMeasurement.onTick = function()
        {
            onMeasurementTick();
        };
        currentMeasurement.duration = duration;
        currentMeasurement.start();
}

function onMeasurementTick()
{
    var elapsed = Date.now() - currentMeasurement.timeStarted;
    var progress = elapsed/currentMeasurement.duration;
    var deg = 360 * progress;

    console.log("Measurement: " + (progress * 100) + "%");
    $('.ppc-progress-fill').css('transform','rotate('+ deg +'deg)');

    progress > 0.5 ? $('.progress-pie-chart').addClass('gt-50') : $('.progress-pie-chart').removeClass('gt-50');

    $('.ppc-percents span').html((progress*100).toFixed(0) + '%' + "<br><br>" + (elapsed/1000).toFixed(0) + "/" + currentMeasurement.duration/1000 + "s");
}


//TEMPORARY STUFF
function moreTempStuff() {
  var tempInfo = document.getElementById("user-form");
  var username = tempInfo.elements[0].value;
  var password = tempInfo.elements[1].value;
  alert("username: " + username + "\npassword: " + password);
}
