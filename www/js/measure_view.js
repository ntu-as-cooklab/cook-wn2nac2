"use strict";

// Status

var tempEquilStatus = 0;
var humdEquilStatus = 0;
var equilStatus     = 0;
var duration        = 60000;

// DOM elements

var temp_equil_status;
var humd_equil_status;
function recordWind(){
    glbsens.currentMeasurement.windDirection = glb.winDir;
    measure_tab_switch('.measure-view-disp-content','#timer_frame_1');
}

function startToMeasure(){
    if(window.localStorage.getItem("isLogIn")=='false'){
        if(glb.AB=='A'){
            window.location.href = '#/tab/user';
        }else{
            window.location.href = '#/tab/userB';
        }
    }else if(windooStatus==2 && window.localStorage.getItem("isLogIn")=='true'){
        measure_tab_switch('#measure-background','#wind_frame');
    }
}

function checkData(){
    glbsens.currentMeasurement.userId = window.localStorage.getItem("userid");
    var d = new Date();
    var nowDate = d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes();
    glbsens.currentMeasurement.date = nowDate;
    sendMeasurement();
    measure_tab_switch('.measure-view-disp-content','#send_frame');
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
    $(".measure-time-button").removeClass("button-calm");
    element.classList.add("button-calm");
}

function chooseWeather(element, index){
    $(".weather-button").removeClass("button-calm");
    element.classList.add("button-calm");
    glbsens.currentMeasurement.weatherType = index;
    setTimeout(function(){
        measure_tab_switch('.measure-view-disp-content','#check_frame');
        $("#avgHumd").html("Humid: "+ Math.ceil(glbsens.currentMeasurement.avgHumd)+" %");
        $("#avgPres").html("Pressure: "+ Math.ceil(glbsens.currentMeasurement.avgPres)+" hPa");
        $("#avgTemp").html("Temperature: "+ Math.ceil(glbsens.currentMeasurement.avgTemp)+" °C");
        $("#avgWind").html(
            "Wind: "+ Math.ceil(glbsens.currentMeasurement.avgWind)+" m/s "+
            parseWindDir(glbsens.currentMeasurement.windDirection)
        );
        $("#weather").html('Weather: '+parseWeather(glbsens.currentMeasurement.weatherType));
    },200);
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
