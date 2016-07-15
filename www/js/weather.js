"use strict";

var windooObservation;
var currentMeasurement;
var windDisplay, tempDisplay, humidityDisplay, pressureDisplay;
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

function weather_main()
{
    windDisplay         = document.getElementById("windDisplay");
    tempDisplay         = document.getElementById("tempDisplay");
    humidityDisplay     = document.getElementById("humidityDisplay");
    pressureDisplay     = document.getElementById("pressureDisplay");

    windooObservation = new WindooObservation();
    windooObservation.enable();
    //windooObservation.enablePurge(60000);

    currentMeasurement = new WindooMeasurement();
    currentMeasurement.start();
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
            //console.log("New wind:        " + event.data);
            if (isWeather){
              windDisplay.innerHTML = event.data.toFixed(2);
            }
            if (windooObservation.observing)    windooObservation.addWind(event.data);
            if (currentMeasurement.observing)   currentMeasurement.addWind(event.data);
            break;

        case 5: //JDCWindooNewTemperatureValue
            //console.log("New temperature: " + event.data);
            if (isWeather){
              tempDisplay.innerHTML = event.data.toFixed(2);
            }
            if (windooObservation.observing)    windooObservation.addTemp(event.data);
            if (currentMeasurement.observing)   currentMeasurement.addTemp(event.data);
            break;

        case 6: //JDCWindooNewHumidityValue
            //console.log("New humidity:    " + event.data);
            if (isWeather) {
              humidityDisplay.innerHTML = event.data.toFixed(2);
            }
            if (windooObservation.observing)    windooObservation.addHumd(event.data);
            if (currentMeasurement.observing)   currentMeasurement.addHumd(event.data);
            break;

        case 7: //JDCWindooNewPressureValue:
            //console.log("New pressure:    " + event.data);
            if (isWeather) {
              pressureDisplay.innerHTML = event.data.toFixed(1);
            }
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
