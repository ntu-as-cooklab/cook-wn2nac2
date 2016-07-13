"use strict";

var windooObservation;
var currentMeasurement;

var log = function(message)
{
    return function() { console.log(message); }
}

function weather_main()
{
    createUI();

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
            windDisplay.innerHTML = event.data.toFixed(2);
            if (windooObservation.observing)    windooObservation.addWind(event.data);
            if (currentMeasurement.observing)   currentMeasurement.addWind(event.data);
            break;

        case 5: //JDCWindooNewTemperatureValue
            //console.log("New temperature: " + event.data);
            tempDisplay.innerHTML = event.data.toFixed(2);
            if (windooObservation.observing)    windooObservation.addTemp(event.data);
            if (currentMeasurement.observing)   currentMeasurement.addTemp(event.data);
            break;

        case 6: //JDCWindooNewHumidityValue
            //console.log("New humidity:    " + event.data);
            humidityDisplay.innerHTML = event.data.toFixed(2);
            if (windooObservation.observing)    windooObservation.addHumd(event.data);
            if (currentMeasurement.observing)   currentMeasurement.addHumd(event.data);
            break;

        case 7: //JDCWindooNewPressureValue:
            //console.log("New pressure:    " + event.data);
            pressureDisplay.innerHTML = event.data.toFixed(1);
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
