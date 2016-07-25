document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    console.log(navigator.compass);
}

var watchID;

function startCompass()
{
    watchID = navigator.compass.watchHeading(onCompassSuccess, onCompassError);
}

function onCompassSuccess(heading)
{
    //console.log("TrueHeading: " + heading.trueHeading);
    document.getElementById("degrees-display").innerHTML = heading.trueHeading.toFixed(0) + "°";
    document.getElementById("compass-arrow").style.transform = "rotate("+(heading.trueHeading+180)+"deg)";
}

function onCompassError()
{
    console.log("Compass error.");
}
