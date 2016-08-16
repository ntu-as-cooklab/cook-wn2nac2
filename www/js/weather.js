"use strict";

var glbsens = {
  windooObservation : null,
  currentMeasurement : null
}

var windDisplay, tempDisplay, humdDisplay, presDisplay;
var windGraphIcon, tempGraphIcon, humdGraphIcon, presGraphIcon;
var isHome = true;
var isWeather = false;
var isMeasure = false;
var notConnectedElement = document.getElementById("not-connected-status");
var connectedElement = document.getElementById("connected-status");
var calibratedElement = document.getElementById("calibrated-status");

var log = function(message)
{
    return function() { console.log(message); }
}

function setWeatherChecks(home, weather, measure) {
  isHome = home;
  isWeather = weather;
  isMeasure = measure;
}

function home_weather_main() {
  windDisplay     = document.getElementById("windDisplayHome");
  tempDisplay     = document.getElementById("tempDisplayHome");
  humdDisplay     = document.getElementById("humdDisplayHome");
  presDisplay     = document.getElementById("presDisplayHome");
  windGraphIcon   = document.getElementById("windGraphIconHome");
  tempGraphIcon   = document.getElementById("tempGraphIconHome");
  humdGraphIcon   = document.getElementById("humdGraphIconHome");
  presGraphIcon   = document.getElementById("presGraphIconHome");

  glbsens.windooObservation = new WindooObservation();
  glbsens.windooObservation.enable();

  glbsens.currentMeasurement = new WindooMeasurement();
}

function weather_main()
{
    windDisplay     = document.getElementById("windDisplay");
    tempDisplay     = document.getElementById("tempDisplay");
    humdDisplay     = document.getElementById("humdDisplay");
    presDisplay     = document.getElementById("presDisplay");
    windGraphIcon   = document.getElementById("windGraphIcon");
    tempGraphIcon   = document.getElementById("tempGraphIcon");
    humdGraphIcon   = document.getElementById("humdGraphIcon");
    presGraphIcon   = document.getElementById("presGraphIcon");
    isWeather = true;

    glbsens.windooObservation = new WindooObservation();
    glbsens.windooObservation.enable();

    glbsens.currentMeasurement = new WindooMeasurement();
}
