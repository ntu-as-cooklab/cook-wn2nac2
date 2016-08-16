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

function onEvent(event)
{
    switch(event.type)
    {
        case 0: // Windoo Not Available
            windooStatus = 0;
            document.dispatchEvent(new CustomEvent("windooStatusChanged", { "detail": 0 }));

            isHome = false;

            if (isHome) {
              if (document.getElementById("connected-status").style.visibility == "visible") fade(document.getElementById("connected-status"));
              if (document.getElementById("calibrated-status").style.visibility == "visible") fade(document.getElementById("calibrated-status"));
              unfade(document.getElementById("not-connected-status"));
              setTimeout(function() {fade(document.getElementById("not-connected-status"));}, 3000);
            }
            break;

        case 1: // Windoo Available
            windooStatus = 1;
            document.dispatchEvent(new CustomEvent("windooStatusChanged", { "detail": 1 }));

            isHome = false;

            if (isHome) {
              if (document.getElementById("not-connected-status").style.visibility == "visible") fade(document.getElementById("not-connected-status"));
              if (document.getElementById("calibrated-status").style.visibility == "visible") fade(document.getElementById("calibrated-status"));
              unfade(document.getElementById("connected-status"));
              setTimeout(function() {fade(document.getElementById("connected-status"));}, 3000);
            }
            break;

        case 2: // Windoo Calibrated
            windooStatus = 2;
            document.dispatchEvent(new CustomEvent("windooStatusChanged", { "detail": 2 }));

            isHome = false;

            if (isHome) {
              if (document.getElementById("not-connected-status").style.visibility == "visible") fade(document.getElementById("not-connected-status"));
              if (document.getElementById("connected-status").style.visibility == "visible") fade(document.getElementById("connected-status"));
              unfade(document.getElementById("calibrated-status"));
              setTimeout(function() {fade(document.getElementById("calibrated-status"));}, 3000);
            }
            break;

        case 3: // VolumeNotAtItsMaximum
            // TODO
            break;

        case 4: // Wind
                if      (event.data < windDisplay.innerHTML)
                {
                    windGraphIcon.classList.remove  ("ion-arrow-graph-up-right");
                    windGraphIcon.classList.add     ("ion-arrow-graph-down-right");
                }
                else if (event.data > windDisplay.innerHTML)
                {
                    windGraphIcon.classList.remove  ("ion-arrow-graph-down-right");
                    windGraphIcon.classList.add     ("ion-arrow-graph-up-right");
                }
                windDisplay.innerHTML = event.data.toFixed(2);
            if (glbsens.currentMeasurement.observing)    glbsens.currentMeasurement.addWind(event.data);
            if (glbsens.windooObservation.observing)   {
              glbsens.windooObservation.addWind(event.data);
              plotPtOnGraph(event.type - 4, isWeather);
              initGraphLines();
            }
            break;

        case 5: // Temperature
                if      (event.data < tempDisplay.innerHTML)
                {
                    tempGraphIcon.classList.remove  ("ion-arrow-graph-up-right");
                    tempGraphIcon.classList.add     ("ion-arrow-graph-down-right");
                }
                else if (event.data > tempDisplay.innerHTML)
                {
                    tempGraphIcon.classList.remove  ("ion-arrow-graph-down-right");
                    tempGraphIcon.classList.add     ("ion-arrow-graph-up-right");
                }
                tempDisplay.innerHTML = event.data.toFixed(2);
            if (glbsens.currentMeasurement.observing)    glbsens.currentMeasurement.addTemp(event.data);
            if (glbsens.windooObservation.observing)   {
              glbsens.windooObservation.addTemp(event.data);
              plotPtOnGraph(event.type - 4, isWeather);
              initGraphLines();
            }
            break;

        case 6: // Humidity
                if      (event.data < humdDisplay.innerHTML)
                {
                    humdGraphIcon.classList.remove  ("ion-arrow-graph-up-right");
                    humdGraphIcon.classList.add     ("ion-arrow-graph-down-right");
                }
                else if (event.data > humdDisplay.innerHTML)
                {
                    humdGraphIcon.classList.remove  ("ion-arrow-graph-down-right");
                    humdGraphIcon.classList.add     ("ion-arrow-graph-up-right");
                }
                humdDisplay.innerHTML = event.data.toFixed(2);
            if (glbsens.currentMeasurement.observing)    glbsens.currentMeasurement.addHumd(event.data);
            if (glbsens.windooObservation.observing)   {
              glbsens.windooObservation.addHumd(event.data);
              plotPtOnGraph(event.type - 4, isWeather);
              initGraphLines();
            }
            break;

        case 7: // Pressure:
                if      (event.data < presDisplay.innerHTML)
                {
                    presGraphIcon.classList.remove  ("ion-arrow-graph-up-right");
                    presGraphIcon.classList.add     ("ion-arrow-graph-down-right");
                }
                else if (event.data > presDisplay.innerHTML)
                {
                    presGraphIcon.classList.remove  ("ion-arrow-graph-down-right");
                    presGraphIcon.classList.add     ("ion-arrow-graph-up-right");
                }
                presDisplay.innerHTML = event.data.toFixed(1);
            if (glbsens.currentMeasurement.observing)    glbsens.currentMeasurement.addPres(event.data);
            if (glbsens.windooObservation.observing)   {
              glbsens.windooObservation.addPres(event.data);
              plotPtOnGraph(event.type - 4, isWeather);
              initGraphLines();
            }
            break;

        case 8: //JDCWindooPublishSuccess
            console.log("Publish success");
            break;

        case 9: //JDCWindooPublishException
            console.log("Publish exception: " + event.data);
            break;

        default:
            console.log(event.type + ": " + event.data);
    }
}
