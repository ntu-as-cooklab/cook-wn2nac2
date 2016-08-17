"use strict";

function weather_main()
{
    console.log("weather_main");
    isHome = false;
    isWeather = true;
    glb.inMeasureView = false;

    glbsens.windooObservation = new WindooObservation();
    glbsens.windooObservation.enable();

    glbsens.currentMeasurement = new WindooMeasurement();

    setWeatherChecks(false, true, false);
    helperInitGraphs();
}
