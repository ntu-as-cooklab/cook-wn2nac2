"use strict";

var notConnectedElement = document.getElementById("not-connected-status");
var connectedElement = document.getElementById("connected-status");
var calibratedElement = document.getElementById("calibrated-status");

function home_weather_main()
{
    isHome = true;

    glbsens.windooObservation = new WindooObservation();
    glbsens.windooObservation.enable();

    glbsens.currentMeasurement = new WindooMeasurement();
}

document.addEventListener('windooStatusChanged', showWindooStatusMsg);

function showWindooStatusMsg()
{
    if (isHome)
    {
        switch (windooStatus)
        {
            case 0:
                if (document.getElementById("connected-status").style.visibility == "visible") fade(document.getElementById("connected-status"));
                if (document.getElementById("calibrated-status").style.visibility == "visible") fade(document.getElementById("calibrated-status"));
                unfade(document.getElementById("not-connected-status"));
                setTimeout(function() {fade(document.getElementById("not-connected-status"));}, 3000);
                break;
            case 1:
                if (document.getElementById("not-connected-status").style.visibility == "visible") fade(document.getElementById("not-connected-status"));
                if (document.getElementById("calibrated-status").style.visibility == "visible") fade(document.getElementById("calibrated-status"));
                unfade(document.getElementById("connected-status"));
                setTimeout(function() {fade(document.getElementById("connected-status"));}, 3000);
                break;
            case 2:
                if (document.getElementById("not-connected-status").style.visibility == "visible") fade(document.getElementById("not-connected-status"));
                if (document.getElementById("connected-status").style.visibility == "visible") fade(document.getElementById("connected-status"));
                unfade(document.getElementById("calibrated-status"));
                setTimeout(function() {fade(document.getElementById("calibrated-status"));}, 3000);
                break;
        }
    }
}
