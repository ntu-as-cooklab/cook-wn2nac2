"use strict";

// Status

var tempEquilStatus = 0;
var humdEquilStatus = 0;
var equilStatus     = 0;
var duration        = 60000;

// DOM elements

var temp_equil_status;
var humd_equil_status;
var measureButton, timer_status;

function measure_main()
{
    isHome = false;
    console.log("measure_main")
    temp_equil_status       = document.getElementById("temp-equil-status");
    humd_equil_status       = document.getElementById("humd-equil-status");
    equil_status_icon       = document.getElementById("equil-status-icon");
    measureButton           = document.getElementById("start-button");
    timer_status            = document.getElementById("timer-status");

    glbsens.windooObservation = new WindooObservation();
    glbsens.windooObservation.enable();

    glbsens.currentMeasurement = new WindooMeasurement();

    startCompass();

    $('.ppc-progress-fill').css('transform','rotate('+ 0 +'deg)');
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

function measure_tab_switch(frameName)
{
    $("#measure_view_disp_content").replaceWith(document.importNode(document.querySelector(frameName).content, true));
}
