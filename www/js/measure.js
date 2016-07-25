"use strict";

var historyCounter = 0;
var newLat, newLong, newDesc;

var takeMeasurement = function()
{
    if ('undefined' !== typeof currentMeasurement) if (currentMeasurement.observing) currentMeasurement.stop();
    currentMeasurement = new WindooMeasurement();
    currentMeasurement.onFinish = function()
    {
        setIconStatusChecked(document.getElementById("measure-status-icon"));
        newMeasurementDone(currentMeasurement);
    };
    currentMeasurement.onTick = function()
    {
        onMeasurementTick();
    };
    currentMeasurement.duration = duration;
    currentMeasurement.start();
};

function onMeasurementTick()
{
    var elapsed = Date.now() - currentMeasurement.timeStarted;
    var progress = elapsed/currentMeasurement.duration;
    var deg = 360 * progress;

    console.log("Measurement: " + (progress * 100) + "%");
    $('.ppc-progress-fill').css('transform','rotate('+ deg +'deg)');

    progress > 0.5 ? $('.progress-pie-chart').addClass('gt-50') : $('.progress-pie-chart').removeClass('gt-50');

    $('.ppc-percents span').html((progress*100).toFixed(0) + '%' + "<br><br>" + (elapsed/1000).toFixed(0) + "/" + currentMeasurement.duration/1000 + "s");
}

function recordPt(lat, lng, desc) {
  var newRecord = [historyCounter, lat, lng, desc, false];
  glb.history_source.push(newRecord);

  var frag = document.createDocumentFragment(),
      temp = document.createElement("div");
  temp.innerHTML = '<div class="history-item"><a href="#" id=' + String(historyCounter) + ' class="history-list-item" onclick="placeOldPt(this.id)">' + desc + '<button id=' + String(historyCounter) + ' class="delete-pt-button" onclick="deletePt(this.id)"><b>Delete</b></button></a></div>';
  historyCounter++;
  frag.appendChild(temp.firstChild);
  var historyList = document.getElementById("history-list");
  historyList.insertBefore(frag, historyList.firstChild);
}

//TEMPORARY STUFF
function tempStuff() {
  var tempInfo = document.getElementById("measure-form");
  newLat = tempInfo.elements[0].value;
  newLong = tempInfo.elements[1].value;
  newDesc = tempInfo.elements[2].value;
  var tempCheck = document.getElementById("user-lat");
  if (tempCheck) tempCheck.value = '';
  tempCheck = document.getElementById("user-long");
  if (tempCheck) tempCheck.value = '';
  tempCheck = document.getElementById("user-desc");
  if (tempCheck) tempCheck.value = '';
  recordPt(newLat, newLong, newDesc);
}

function moreTempStuff() {
  var tempInfo = document.getElementById("user-form");
  var username = tempInfo.elements[0].value;
  var password = tempInfo.elements[1].value;
  alert("username: " + username + "\npassword: " + password);
}
