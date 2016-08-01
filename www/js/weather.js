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
  //glbsens.windooObservation.enablePurge(60000);

  glbsens.currentMeasurement = new WindooMeasurement();
  //glbsens.currentMeasurement.start();

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

    // glbsens.windooObservation = new WindooObservation();
    // glbsens.windooObservation.enable();
    // //glbsens.windooObservation.enablePurge(60000);
    //
    // glbsens.currentMeasurement = new WindooMeasurement();
    // //glbsens.currentMeasurement.start();
}

function onEvent(event)
{
    switch(event.type)
    {
        case 0: //JDCWindooNotAvailable
            windooStatus = 0;
            onWindooStatusChanged();
            console.log("Windoo not available");
            if (isHome) {
              if (document.getElementById("connected-status").style.visibility == "visible") fade(document.getElementById("connected-status"));
              if (document.getElementById("calibrated-status").style.visibility == "visible") fade(document.getElementById("calibrated-status"));
              unfade(document.getElementById("not-connected-status"));
              setTimeout(function() {fade(document.getElementById("not-connected-status"));}, 3000);
            }
            break;

        case 1: //JDCWindooAvailable
            windooStatus = 1;
            onWindooStatusChanged();
            console.log("Windoo available");
            if (isHome) {
              if (document.getElementById("not-connected-status").style.visibility == "visible") fade(document.getElementById("not-connected-status"));
              if (document.getElementById("calibrated-status").style.visibility == "visible") fade(document.getElementById("calibrated-status"));
              unfade(document.getElementById("connected-status"));
              setTimeout(function() {fade(document.getElementById("connected-status"));}, 3000);
            }
            break;

        case 2: //JDCWindooCalibrated
            windooStatus = 2;
            onWindooStatusChanged();
            console.log("Windoo calibrated");
            if (isHome) {
              if (document.getElementById("not-connected-status").style.visibility == "visible") fade(document.getElementById("not-connected-status"));
              if (document.getElementById("connected-status").style.visibility == "visible") fade(document.getElementById("connected-status"));
              unfade(document.getElementById("calibrated-status"));
              setTimeout(function() {fade(document.getElementById("calibrated-status"));}, 3000);
            }
            break;

        case 3: //JDCWindooVolumeNotAtItsMaximum
            console.log("Volume not at maximum");
            alert("Please turn volume up to maximum")
            break;

        case 4: //JDCWindooNewWindValue
            //console.log("New wind:        " + event.data);
            //if (isWeather){
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
            if (glbsens.windooObservation.observing)    glbsens.windooObservation.addWind(event.data);
            if (glbsens.currentMeasurement.observing)   {
              glbsens.currentMeasurement.addWind(event.data);
              plotPtOnGraph(event.type - 4, isWeather);
              initGraphLines();
            }
            break;

        case 5: //JDCWindooNewTemperatureValue
            //console.log("New temperature: " + event.data);
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
            if (glbsens.windooObservation.observing)    glbsens.windooObservation.addTemp(event.data);
            if (glbsens.currentMeasurement.observing)   {
              glbsens.currentMeasurement.addTemp(event.data);
              plotPtOnGraph(event.type - 4, isWeather);
              initGraphLines();
            }
            break;

        case 6: //JDCWindooNewHumidityValue
            //console.log("New humidity:    " + event.data);
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
            if (glbsens.windooObservation.observing)    glbsens.windooObservation.addHumd(event.data);
            if (glbsens.currentMeasurement.observing)   {
              glbsens.currentMeasurement.addHumd(event.data);
              plotPtOnGraph(event.type - 4, isWeather);
              initGraphLines();
            }
            break;

        case 7: //JDCWindooNewPressureValue:
            //console.log("New pressure:    " + event.data);
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
            if (glbsens.windooObservation.observing)    glbsens.windooObservation.addPres(event.data);
            if (glbsens.currentMeasurement.observing)   {
              glbsens.currentMeasurement.addPres(event.data);
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
