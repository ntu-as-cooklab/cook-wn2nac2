"use strict";

// Status

var tempEquilStatus = 0;
var humdEquilStatus = 0;
var equilStatus     = 0;
var duration        = 60000;

// DOM elements

var temp_equil_status;
var humd_equil_status;

function startToMeasure(){
    if(windooStatus==2){
        measure_tab_switch('#measure-background','#timer_frame_1')
    }
}

function measure_main()
{
    // TODO: improve this hack
    var height = $("#measure-view-container").height() - $("#measure-view-bars").height() - 49; // 49 is tab height
    $("#measure-view-disp").css({ 'height' : height.toString() });

    isHome = false;
    console.log("measure_main")
    measureButton           = document.getElementById("start-button");
    timer_status            = document.getElementById("timer-status");

    glbsens.windooObservation = new WindooObservation();
    glbsens.windooObservation.enable();

    glbsens.currentMeasurement = new WindooMeasurement();

    startCompass();

    $('.ppc-progress-fill').css('transform','rotate('+ 0 +'deg)');
}

function measure_tab_switch(frameName1, frameName2)
{
    $(frameName1).replaceWith(document.importNode(document.querySelector(frameName2).content, true));
}

var duration;
var weather;

function chooseDuration(element)
{
    duration = element.dataset.duration;
    $(".measure-time-button").removeClass  ("button-calm");
    element.classList.add     ("button-calm");
}

function chooseWeather(element)
{
    weather = element.dataset.weather;
    $(".weather-button").removeClass  ("button-calm");
    element.classList.add     ("button-calm");
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


// Compass
document.addEventListener("DOMContentLoaded", function(event) {

    if (window.DeviceOrientationEvent) {
     window.addEventListener('deviceorientation', function(eventData) {
       // gamma: Tilting the device from left to right. Tilting the device to the right will result in a positive value.
       var tiltLR = eventData.gamma;

       // beta: Tilting the device from the front to the back. Tilting the device to the front will result in a positive value.
       var tiltFB = eventData.beta;

       // alpha: The direction the compass of the device aims to in degrees.
       var dir = eventData.alpha

       // Call the function to use the data on the page.
       deviceOrientationHandler(tiltLR, tiltFB, dir);
     }, false);
    };

   function deviceOrientationHandler(tiltLR, tiltFB, dir) {
    //  document.getElementById("tiltLR").innerHTML = Math.ceil(tiltLR);
    //  document.getElementById("tiltFB").innerHTML = Math.ceil(tiltFB);
    //  document.getElementById("direction").innerHTML = Math.ceil(dir);

     // Rotate the disc of the compass.
     var compassDisc = document.getElementById("compassDiscImg");
     compassDisc.style.webkitTransform = "rotate("+ dir +"deg)";
     compassDisc.style.MozTransform = "rotate("+ dir +"deg)";
     compassDisc.style.transform = "rotate("+ dir +"deg)";
   }

});
