"use strict";

var isHome = true;
var isWeather = false;
var isMeasure = false;

function setWeatherChecks(home, weather, measure) {
  isHome = home;
  isWeather = weather;
  isMeasure = measure;
}

function weather_main()
{
    console.log("weather_main");

    glbsens.windooObservation = new WindooObservation();
    glbsens.windooObservation.enable();

    glbsens.currentMeasurement = new WindooMeasurement();

    isWeather = true;
    glb.inMeasureView = false;
    //console.log(glb.inMeasureView);
    setWeatherChecks(false, true, false);
    helperInitGraphs();



    // console.log(glbsens);
}
