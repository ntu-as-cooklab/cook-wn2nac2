"use strict";

var historyCounter = 0;
//NOTE THESE NAMES AND THE IDS OF HISTORY ITEMS SHOULD MATCH
// glb.history_source = [
//   [0, *some windooMeasurement object, false],
//   [1, *some windooMeasurement object, false],
//   [5, *some windooMeasurement object, false]
// ];

var weatherHistory = [];

function newMeasurementDone(measurement)
{
    weatherHistory.push(glbsens.currentMeasurement);
    var newRecordedPt = [historyCounter, measurement, false];
    glb.history_source.push(newRecordedPt);
    recordPt(newRecordedPt);
}

function recordPt(ptInfo) {
  var frag = document.createDocumentFragment(),
      temp = document.createElement("div");
  var ptTitle = ptInfo[1].timeStarted;
  temp.innerHTML = '<div class="history-item">'
  + '<a href="#" id=' + String(historyCounter) + ' class="history-list-item" onclick="placeOldPt(this.id)">' + ptTitle
  + '<button id=' + String(historyCounter) + ' class="delete-pt-button" onclick="deletePt(this.id)"><b>Delete</b></button>'
  + '</a></div>';
  historyCounter++;
  frag.appendChild(temp.firstChild);
  var historyList = document.getElementById("history-list");
  if (historyList == null) {
    glb.history_buff.push(frag);
  } else {
    historyList.insertBefore(frag, historyList.firstChild);
  }
}

function loadBufferedHistory() {
  var historyList = document.getElementById("history-list");
  var length = glb.history_buff.length;
  for (var x = 0; x < length; x++) {
    var frag = glb.history_buff.splice(0,1)[0];
    historyList.insertBefore(frag, historyList.firstChild);
  }
  glb.history_buff = [];
}

//TODO: CHANGE/FIX THIS (USE addAppMarker)
function placeOldPt(ID) {
  if (glb.doPlaceOldPt) {
    for (var x = 0; x < glb.history_source.length; x++) {
      if (glb.history_source[x][0] == ID) {
        var oldPtSrc = glb.history_source[x][1];
        var oldLat = oldPtSrc.latitude;
        var oldLng = oldPtSrc.longitude;
        var oldLatLng = new google.maps.LatLng(oldLat, oldLng);
        map.panTo(oldLatLng);
        if (!glb.history_source[x][2]) {
          var newHistMarkData = [oldPtSrc.timeStarted.toString(), oldLat, oldLng, 'history',
            oldPtSrc.wind[oldPtSrc.wind.length - 1], oldPtSrc.temp[oldPtSrc.temp.length - 1],
            oldPtSrc.humd[oldPtSrc.humd.length - 1], oldPtSrc.pres[oldPtSrc.pres.length - 1],
            parseWindDir(oldPtSrc.windDirection), parseWeather(oldPtSrc.weatherType), oldPtSrc.timeStarted];
          var newMarker = addAppMarker(newHistMarkData, true);
          // var newMarker = new google.maps.Marker({
          //   title: oldPtSrc.comment,
          //   position: oldLatLng,
          //   category: 'history',
          //   map: map,
          //   animation: google.maps.Animation.DROP
          // });
          glb.tempMarkers.push(newMarker);
          glb.markerCluster.addMarker(newMarker);
          glb.history_source[x][2] = true;
        }
        closeNav(0);
        break;
      }
    }
  }
  glb.doPlaceOldPt = true;
}

function deletePt(ID) {
  for (var x = 0; x < glb.history_source.length; x++) {
    if (glb.history_source[x][0] == ID) {
      var oldPtSrc = glb.history_source[x][1];
      var oldLat = oldPtSrc.latitude;
      var oldLng = oldPtSrc.longitude;
      var oldLatLng = new google.maps.LatLng(oldLat, oldLng);
      for (var y = 0; y < glb.gmarkers.length; y++) {
        if (glb.gmarkers[y].getPosition().equals(oldLatLng)) {
          glb.markerCluster.removeMarker(glb.gmarkers[y]);
          glb.gmarkers[y].setMap(null);
          glb.gmarkers.splice(y, 1);
          break;
        }
      }
      glb.history_source.splice(x, 1);
      break;
    }
  }
  document.getElementById(String(ID)).remove();
  glb.doPlaceOldPt = false;
  closeNav(0);
}
