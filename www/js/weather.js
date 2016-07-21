"use strict";

var windooObservation;
var currentMeasurement;

var windDisplay, tempDisplay, humdDisplay, presDisplay;
var windGraphIcon, tempGraphIcon, humdGraphIcon, presGraphIcon;
var isWeather = false;
var notConnectedElement = document.getElementById("not-connected-status");
var connectedElement = document.getElementById("connected-status");
var calibratedElement = document.getElementById("calibrated-status");

var log = function(message)
{
    return function() { console.log(message); }
}

function setIsWeather(boolean) {
  if (boolean) {
    isWeather = boolean;
  } else {
    isWeather = boolean;
  }
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

  windooObservation = new WindooObservation();
  windooObservation.enable();
  //windooObservation.enablePurge(60000);

  currentMeasurement = new WindooMeasurement();
  //currentMeasurement.start();
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

    // windooObservation = new WindooObservation();
    // windooObservation.enable();
    // //windooObservation.enablePurge(60000);
    //
    // currentMeasurement = new WindooMeasurement();
    // //currentMeasurement.start();
}

function onEvent(event)
{
    switch(event.type)
    {
        case 0: //JDCWindooNotAvailable
            console.log("Windoo not available");
            if (!isWeather) {
              unfade(document.getElementById("not-connected-status"));
              setTimeout(function() {fade(document.getElementById("not-connected-status"));}, 3000);
            }
            break;

        case 1: //JDCWindooAvailable
            console.log("Windoo available");
            if (!isWeather) {
              unfade(document.getElementById("connected-status"));
              setTimeout(function() {fade(document.getElementById("connected-status"));}, 3000);
            }
            break;

        case 2: //JDCWindooCalibrated
            console.log("Windoo calibrated");
            if (!isWeather) {
              unfade(document.getElementById("calibrated-status"));
              setTimeout(function() {fade(document.getElementById("calibrated-status"));}, 3000);
            }
            break;

        case 3: //JDCWindooVolumeNotAtItsMaximum
            console.log("Volume not at maximum");
            alert("Please turn volume up to maximum")
            break;

        case 4: //JDCWindooNewWindValue
            console.log("New wind:        " + event.data);
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
            //}

            if (windooObservation.observing)    windooObservation.addWind(event.data);
            if (currentMeasurement.observing)   currentMeasurement.addWind(event.data);
            break;

        case 5: //JDCWindooNewTemperatureValue
            //console.log("New temperature: " + event.data);
            //if (isWeather){
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
            //}
            if (windooObservation.observing)    windooObservation.addTemp(event.data);
            if (currentMeasurement.observing)   currentMeasurement.addTemp(event.data);
            break;

        case 6: //JDCWindooNewHumidityValue
            //console.log("New humidity:    " + event.data);
            //if (isWeather) {
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
            //}
            if (windooObservation.observing)    windooObservation.addHumd(event.data);
            if (currentMeasurement.observing)   currentMeasurement.addHumd(event.data);
            break;

        case 7: //JDCWindooNewPressureValue:
            //console.log("New pressure:    " + event.data);
            //if (isWeather) {
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
            //}
            if (windooObservation.observing)    windooObservation.addPres(event.data);
            if (currentMeasurement.observing)   currentMeasurement.addPres(event.data);
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
