"use strict";
var isMeasureDone = false;
var measureButton, timer_status;
var newLat, newLong, newDesc;

var toggleMeasurement = function()
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
    if(!isMeasureDone){
        glbsens.currentMeasurement.start();
        setMeasureButtonStatus(2);
    }
};

function setMeasureButtonStatus(status)
{
    measureButton           = document.getElementById("start-button");
    var measureButtonText   = document.getElementById("start-button-text");
    timer_status            = document.getElementById("timer-status");
    var progress_box        = document.getElementById("progress-box");
    var progress_box        = document.getElementById("timer-box");
    switch (status)
    {
        case 0: // Not ready
            progress_box.style.visibility = "hidden";
            timer_status.innerHTML = "Not ready";
            measureButton.disabled = true;
            measureButton.classList.remove  ("button-assertive");
            measureButton.classList.add     ("button-balanced");
            measureButtonText.innerHTML = "START";
            break;
        case 1: // Ready to start
            progress_box.style.visibility = "hidden";
            timer_status.innerHTML = "Ready to start";
            measureButton.disabled = false;
            measureButton.classList.remove  ("button-assertive");
            measureButton.classList.add     ("button-balanced");
            measureButtonText.innerHTML = "START";
            break;
        case 2: // Measuring
            progress_box.style.visibility = "visible";
            progress_box.style.visibility = "hidden";
            timer_status.innerHTML = "Measuring...";
            measureButton.disabled = false;
            measureButton.classList.remove  ("button-balanced");
            measureButton.classList.add     ("button-assertive");
            measureButtonText.innerHTML = "ABORT";
            break;
        case 3: // Finished
            progress_box.style.visibility = "hidden";
            progress_box.style.visibility = "visible";
            timer_status.innerHTML = "Cancelled";
            measureButton.disabled = false;
            measureButton.classList.remove  ("button-assertive");
            measureButton.classList.add     ("button-balanced");
            measureButtonText.innerHTML = "START";
            break;
        case 4: // Finished Data and Go Next Step
            progress_box.style.visibility = "hidden";
            progress_box.style.visibility = "visible";
            timer_status.innerHTML = "Finished";
            measureButton.disabled = true;
            measureButton.classList.remove  ("button-assertive");
            measureButton.classList.add     ("button-balanced");
            measureButtonText.innerHTML = "Finished";
            break;
    }
}

function onMeasurementFinish()
{
    newMeasurementDone(glbsens.currentMeasurement);
    if(isMeasureDone)
        setMeasureButtonStatus(4); // Measure is done
    else
        setMeasureButtonStatus(3);  // Measure is Aborted
};

function onMeasurementTick()
{
    var elapsed = Date.now() - glbsens.currentMeasurement.timeStarted;
    var progress = elapsed/glbsens.currentMeasurement.duration;
    var deg = 360 * progress;

    $('.ppc-progress-fill').css('transform','rotate('+ deg +'deg)');

    progress > 0.5 ? $('.progress-pie-chart').addClass('gt-50') : $('.progress-pie-chart').removeClass('gt-50');

    $('.ppc-percents span').html((progress*100).toFixed(0) + '%' + "<br><br>" + (elapsed/1000).toFixed(0) + "/" + glbsens.currentMeasurement.duration/1000 + "s");

    // Mean A Data really finished then go to the next step
    if(progress>=1){
        isMeasureDone = true;
        setTimeout(function(){measure_tab_switch('.measure-view-disp-content','#wind_frame');},2000);
    }
}
