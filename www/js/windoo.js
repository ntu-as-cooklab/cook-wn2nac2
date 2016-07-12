"use strict";

var JDCWindooNotAvailable           = 0;
var JDCWindooAvailable              = 1;
var JDCWindooCalibrated             = 2;
var JDCWindooVolumeNotAtItsMaximum  = 3;
var JDCWindooNewWindValue           = 4;
var JDCWindooNewTemperatureValue    = 5;
var JDCWindooNewHumidityValue       = 6;
var JDCWindooNewPressureValue       = 7;
var JDCWindooPublishSuccess         = 8;
var JDCWindooPublishException       = 9;

function onEvent(event)
{
    switch(event.type)
    {
        case JDCWindooNotAvailable:
            console.log("Windoo not available");
            break;
        case JDCWindooAvailable:
            console.log("Windoo available");
            break;
        case JDCWindooCalibrated:
            console.log("Windoo calibrated");
            break;
        case JDCWindooVolumeNotAtItsMaximum:
            console.log("Volume not at maximum");
            break;
        case JDCWindooNewWindValue:
            console.log("New wind:        " + event.data);
            break;
        case JDCWindooNewTemperatureValue:
            console.log("New temperature: " + event.data);
            break;
        case JDCWindooNewHumidityValue:
            console.log("New humidity:    " + event.data);
            break;
        case JDCWindooNewPressureValue:
            console.log("New pressure:    " + event.data);
            break;
        case JDCWindooPublishSuccess:
            console.log("Publish success");
            break;
        case JDCWindooPublishException:
            console.log("Publish exception: " + event.data);
            break;
        default:
            console.log(event.type + ": " + event.data);
    }
}
