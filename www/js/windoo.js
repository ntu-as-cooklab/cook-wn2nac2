"use strict"

var glbsens =
{
    windooObservation : null,
    currentMeasurement : null
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
            document.dispatchEvent(new CustomEvent("newWind", { "detail": event.data }));

            if (glbsens.currentMeasurement.observing)    glbsens.currentMeasurement.addWind(event.data);
            if (glbsens.windooObservation.observing)   {
              glbsens.windooObservation.addWind(event.data);
              plotPtOnGraph(event.type - 4, isWeather);
              initGraphLines();
            }
            break;

        case 5: // Temperature

            document.dispatchEvent(new CustomEvent("newTemp", { "detail": event.data }));

            if (glbsens.currentMeasurement.observing)    glbsens.currentMeasurement.addTemp(event.data);
            if (glbsens.windooObservation.observing)   {
              glbsens.windooObservation.addTemp(event.data);
              plotPtOnGraph(event.type - 4, isWeather);
              initGraphLines();
            }
            break;

        case 6: // Humidity

            document.dispatchEvent(new CustomEvent("newHumd", { "detail": event.data }));

            if (glbsens.currentMeasurement.observing)    glbsens.currentMeasurement.addHumd(event.data);
            if (glbsens.windooObservation.observing)   {
              glbsens.windooObservation.addHumd(event.data);
              plotPtOnGraph(event.type - 4, isWeather);
              initGraphLines();
            }
            break;

        case 7: // Pressure:

            document.dispatchEvent(new CustomEvent("newPres", { "detail": event.data }));

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
