"use strict";

// Status

var windooStatus    = 0;
var tempEquilStatus = 0;
var humdEquilStatus = 0;
var equilStatus     = 0;
var duration        = 60;

// DOM elements

var sensor_status;
var sensor_status_icon;
var temp_equil_status;
var humd_equil_status;
var equil_status_icon;

function measure_main()
{
    sensor_status           = document.getElementById("sensor-status");
    sensor_status_icon      = document.getElementById("sensor-status-icon");
    temp_equil_status       = document.getElementById("temp-equil-status");
    humd_equil_status       = document.getElementById("humd-equil-status");
    equil_status_icon       = document.getElementById("equil-status-icon");
    onWindooStatusChanged(windooStatus);
    onTempEquilStatusChanged(tempEquilStatus);
    onHumdEquilStatusChanged(humdEquilStatus);

    // Testing
    $('.ppc-progress-fill').css('transform','rotate('+ 178 +'deg)');
}

function setIconStatus(icon, status)
{
    status ? setIconStatusChecked(icon) : setIconStatusAlert(icon);
}

function setIconStatusAlert(icon)
{
    icon.classList.remove  ("ion-checkmark-circled");
    icon.classList.add     ("ion-alert-circled");
}

function setIconStatusChecked(icon)
{
    icon.classList.remove  ("ion-alert-circled");
    icon.classList.add     ("ion-checkmark-circled");
}

function onWindooStatusChanged()
{
    switch(windooStatus)
    {
        case 0:
            sensor_status.innerHTML = "Sensor not connected";
            sensor_status.style.border = "solid 2px #d00";
            setIconStatusAlert(sensor_status_icon);
            break;
        case 1:
            sensor_status.innerHTML = "Sensor calibrating...";
            sensor_status.style.border = "solid 2px #fb0";
            setIconStatusAlert(sensor_status_icon);
            break;
        case 2:
            sensor_status.innerHTML = "Sensor calibrated";
            sensor_status.style.border = "solid 2px #0c0";
            setIconStatusChecked(sensor_status_icon);
            break;
    }
}

function onTempEquilStatusChanged()
{
    switch(tempEquilStatus)
    {
        case 0:
            temp_equil_status.innerHTML = "Not ready";
            temp_equil_status.style.border = "solid 2px #fb0";
            break;
        case 1:
            temp_equil_status.innerHTML = "Ready";
            temp_equil_status.style.border = "solid 2px #0c0";
            break;
    }
    setIconStatus(sensor_status_icon, tempEquilStatus && humdEquilStatus);
}

function onHumdEquilStatusChanged()
{
    switch(humdEquilStatus)
    {
        case 0:
            humd_equil_status.innerHTML = "Not ready";
            humd_equil_status.style.border = "solid 2px #fb0";
            break;
        case 1:
            humd_equil_status.innerHTML = "Ready";
            humd_equil_status.style.border = "solid 2px #0c0";
            break;
    }
    setIconStatus(sensor_status_icon, tempEquilStatus && humdEquilStatus);
}

var duration;

function chooseDuration(element)
{
    console.log(element.dataset.duration);
    duration = element.dataset.duration;
    $(".measure-time-button").removeClass  ("button-calm");
    element.classList.add     ("button-calm");
}
