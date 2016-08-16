"use strict";

// Status

var windooStatus    = 0;
var tempEquilStatus = 0;
var humdEquilStatus = 0;
var equilStatus     = 0;
var duration        = 60000;

// DOM elements

var sensor_status;
var sensor_status_icon;
var temp_equil_status;
var humd_equil_status;
var equil_status_icon;
var measureButton, timer_status;

function measure_main()
{
    console.log("measure_main")
    sensor_status           = document.getElementById("sensor-status");
    sensor_status_icon      = document.getElementById("sensor-status-icon");
    temp_equil_status       = document.getElementById("temp-equil-status");
    humd_equil_status       = document.getElementById("humd-equil-status");
    equil_status_icon       = document.getElementById("equil-status-icon");
    measureButton           = document.getElementById("start-button");
    timer_status            = document.getElementById("timer-status");

    glbsens.windooObservation = new WindooObservation();
    glbsens.windooObservation.enable();

    glbsens.currentMeasurement = new WindooMeasurement();

    //onWindooStatusChanged(windooStatus);
    //onTempEquilStatusChanged(tempEquilStatus);
    //onHumdEquilStatusChanged(humdEquilStatus);

    startCompass();

    $('.ppc-progress-fill').css('transform','rotate('+ 0 +'deg)');
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

var tDif = 3;
var tReady = false;
var hDif = 20;
var hReady = false;
var initWait = true;
var timeout = false;

function checkEqm()
{
  if (!glb.inMeasureView) {
    console.log("cancelled");
    return;
  }
  console.log("here");
  if (initWait) {
    console.log("in first wait sequence");
    initWait = false;
    setTimeout(function() {checkEqm()}, 3000);
  } else {
    console.log("past first wait sequence");
    if (!tReady) {
      console.log("checking temp");
      var temp = glbsens.currentMeasurement.temp;
      if (temp.length >= 5) {
        if (Math.abs(temp[temp.length - 6] - temp[temp.length - 1]) >= tDif) {
          timeout = true;
        } else {
          tReady = true;
          onTempEquilStatusChanged(1);
        }
      } else {
        timeout = true;
      }
    }
    if (!hReady) {
      console.log("checking humd");
      var humd = glbsens.currentMeasurement.humd;
      if (humd.length >= 5) {
        if (Math.abs(humd[humd.length - 6] - humd[humd.length - 1]) >= hDif) {
          timeout = true;
        } else {
          hReady = true;
          onHumdEquilStatusChanged(1);
        }
      } else {
        timeout = true;
      }
    }
    if (timeout && glb.inMeasureView) {
      console.log("timing out for refresh");
      setTimeout(function() {checkEqm()}, 3000);
    } else {
      console.log("this should only show once per tab switch");
      initWait = true;
    }
  }
}

var duration;
var weather;

function chooseDuration(element)
{
    //console.log(element.dataset.duration);
    duration = element.dataset.duration;
    $(".measure-time-button").removeClass  ("button-calm");
    element.classList.add     ("button-calm");
}

function chooseWeather(element)
{
    //console.log(element.dataset.duration);
    weather = element.dataset.weather;
    $(".weather-button").removeClass  ("button-calm");
    element.classList.add     ("button-calm");
}

function setMeasureButtonStatus(status)
{
    measureButton           = document.getElementById("start-button");
    var measureButtonText   = document.getElementById("start-button-text");
    timer_status            = document.getElementById("timer-status");
    switch (status)
    {
        case 0: // Not ready
            timer_status.innerHTML = "Not ready";
            measureButton.disabled = true;
            measureButton.classList.remove  ("button-assertive");
            measureButton.classList.add     ("button-balanced");
            measureButtonText.innerHTML = "START";
            break;
        case 1: // Ready to start
            timer_status.innerHTML = "Ready to start";
            measureButton.disabled = false;
            measureButton.classList.remove  ("button-assertive");
            measureButton.classList.add     ("button-balanced");
            measureButtonText.innerHTML = "START";
            break;
        case 2: // Measuring
            timer_status.innerHTML = "Measuring...";
            measureButton.disabled = false;
            measureButton.classList.remove  ("button-balanced");
            measureButton.classList.add     ("button-assertive");
            measureButtonText.innerHTML = "ABORT";
            break;
        case 3: // Finished
            timer_status.innerHTML = "Finished";
            measureButton.disabled = false;
            measureButton.classList.remove  ("button-assertive");
            measureButton.classList.add     ("button-balanced");
            measureButtonText.innerHTML = "START";
            break;
    }
}

var measure_view_disp = null;

function measure_tab_switch(frameName)
{
    var t = document.querySelector(frameName);
    var clone = document.importNode(t.content, true);
    $(".measure_view_disp_content").replaceWith(clone);
}
