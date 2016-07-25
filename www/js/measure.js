"use strict";

var newLat, newLong, newDesc;

var takeMeasurement = function()
{
    currentMeasurement = new WindooMeasurement();
    currentMeasurement.onFinish = function()
    {
        newMeasurementDone(currentMeasurement);
    };
    currentMeasurement.duration = 1000;
    currentMeasurement.start();
};



//TEMPORARY STUFF
function moreTempStuff() {
  var tempInfo = document.getElementById("user-form");
  var username = tempInfo.elements[0].value;
  var password = tempInfo.elements[1].value;
  alert("username: " + username + "\npassword: " + password);
}
