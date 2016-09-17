"use strict"

var windooStatus = 0;

var glbsens =
{
    windooObservation : null,
    currentMeasurement : null
}

function initSensor()
{
      if (typeof Windoo !== 'undefined')
      {
          Windoo.init(console.log("Windoo intialized"));
          Windoo.start(console.log("Windoo started"));
          Windoo.setCallback(onEvent);
      }
}

function onEvent(event)
{
    switch(event.type)
    {
        case 0: // Windoo Not Available
        case 1: // Windoo Available
        case 2: // Windoo Calibrated
            windooStatus = event.type;
            document.dispatchEvent(new CustomEvent("windooStatusChanged", { "detail": windooStatus }));
            break;

        case 3: // VolumeNotAtItsMaximum
            // TODO
            break;

        case 4: // Wind
            document.dispatchEvent(new CustomEvent("newWind", { "detail": event.data }));

            if (glbsens.currentMeasurement.observing){
                glbsens.currentMeasurement.addWind(event.data);
            }
            if (glbsens.windooObservation.observing){
                $("#w_wind").html(event.data.toFixed(1));
                chartWind = event.data;
                glbsens.windooObservation.addWind(event.data);
            }
            break;

        case 5: // Temperature

            document.dispatchEvent(new CustomEvent("newTemp", { "detail": event.data }));

            if (glbsens.currentMeasurement.observing){
                glbsens.currentMeasurement.addTemp(event.data);
            }
            if (glbsens.windooObservation.observing){
                $("#w_temp").html(event.data.toFixed(1));
                chartTemp = event.data;
                glbsens.windooObservation.addTemp(event.data);
            }
            break;

        case 6: // Humidity

            document.dispatchEvent(new CustomEvent("newHumd", { "detail": event.data }));

            if (glbsens.currentMeasurement.observing){
                glbsens.currentMeasurement.addHumd(event.data);
            }
            if (glbsens.windooObservation.observing){
                $("#w_rh").html(event.data.toFixed(1));
                chartHumd = event.data;
                glbsens.windooObservation.addHumd(event.data);
            }
            break;

        case 7: // Pressure:

            document.dispatchEvent(new CustomEvent("newPres", { "detail": event.data }));

            if (glbsens.currentMeasurement.observing){
                glbsens.currentMeasurement.addPres(event.data);
            }
            if (glbsens.windooObservation.observing){
                $("#w_pres").html(event.data.toFixed(0));
                chartPres = event.data;
                glbsens.windooObservation.addPres(event.data);
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
