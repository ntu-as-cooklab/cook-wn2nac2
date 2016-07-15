"use strict";

var windooObservation;
var currentMeasurement;
var windDisplay, tempDisplay, humdDisplay, presDisplay;
var windGraphIcon, tempGraphIcon, humdGraphIcon, presGraphIcon;

var log = function(message)
{
    return function() { console.log(message); }
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

    if (typeof Windoo !== 'undefined')
    {
        Windoo.init(log("Windoo intialized"));
        Windoo.start(log("Windoo started"));
        Windoo.setCallback(onEvent);
    }

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
            break;

        case 1: //JDCWindooAvailable
            console.log("Windoo available");
            break;

        case 2: //JDCWindooCalibrated
            console.log("Windoo calibrated");
            break;

        case 3: //JDCWindooVolumeNotAtItsMaximum
            console.log("Volume not at maximum");
            alert("Please turn volume up to maximum")
            break;

        case 4: //JDCWindooNewWindValue
            //console.log("New wind:        " + event.data);
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
            if (windooObservation.observing)    windooObservation.addWind(event.data);
            if (currentMeasurement.observing)   currentMeasurement.addWind(event.data);
            break;

        case 5: //JDCWindooNewTemperatureValue
            //console.log("New temperature: " + event.data);
            tempDisplay.innerHTML = event.data.toFixed(2);
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
            if (windooObservation.observing)    windooObservation.addTemp(event.data);
            if (currentMeasurement.observing)   currentMeasurement.addTemp(event.data);
            break;

        case 6: //JDCWindooNewHumidityValue
            //console.log("New humidity:    " + event.data);
            humdDisplay.innerHTML = event.data.toFixed(2);
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
            if (windooObservation.observing)    windooObservation.addHumd(event.data);
            if (currentMeasurement.observing)   currentMeasurement.addHumd(event.data);
            break;

        case 7: //JDCWindooNewPressureValue:
            //console.log("New pressure:    " + event.data);
            presDisplay.innerHTML = event.data.toFixed(1);
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
