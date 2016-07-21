"use strict";

var historyCounter = 0;
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
