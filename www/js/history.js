"use strict";

var historyCounter = 0;
//NOTE THESE NAMES AND THE IDS OF HISTORY ITEMS SHOULD MATCH
// glb.history_source = [
//   [0, *some windooMeasurement object, false],
//   [1, *some windooMeasurement object, false],
//   [5, *some windooMeasurement object, false]
// ];

var WeatherHistory = [];

function newMeasurementDone(measurement)
{
    WeatherHistory.push(currentMeasurement);
    var newRecordedPt = [historyCounter, measurement, false];
    glb.history_source.push(newRecordedPt);
    recordPt(newRecordedPt);
}

function recordPt(ptInfo) {
  var frag = document.createDocumentFragment(),
      temp = document.createElement("div");
  var ptTitle = ptInfo[1].timeStarted;
  temp.innerHTML = '<div class="history-item"><a href="#" id=' + String(historyCounter) + ' class="history-list-item" onclick="placeOldPt(this.id)">' + ptTitle + '<button id=' + String(historyCounter) + ' class="delete-pt-button" onclick="deletePt(this.id)"><b>Delete</b></button></a></div>';
  historyCounter++;
  frag.appendChild(temp.firstChild);
  var historyList = document.getElementById("history-list");
  historyList.insertBefore(frag, historyList.firstChild);
}

function placeOldPt(ID) {
  if (glb.doPlaceOldPt) {
    for (var x = 0; x < glb.history_source.length; x++) {
      if (glb.history_source[x][0] == ID) {
        var oldPtSrc = glb.history_source[x][1];
        var oldLatLng = new google.maps.LatLng(oldPtSrc.latitute, oldPtSrc.longitude);
        map.panTo(oldLatLng);
        if (!glb.history_source[x][2]) {
          var newMarker = new google.maps.Marker({
            title: oldPtSrc.comment,
            position: oldLatLng,
            category: 'history',
            map: map,
            animation: google.maps.Animation.DROP
          });
          glb.gmarkers.push(newMarker);
          glb.tempMarkers.push(newMarker);
          glb.markerCluster.clearMarkers();
          glb.markerCluster.addMarkers(glb.tempMarkers);
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
      var histLatLng = new google.maps.LatLng(oldPtSrc.latitute, oldPtSrc.longitude);
      for (var y = 0; y < glb.gmarkers.length; y++) {
        if (glb.gmarkers[y].getPosition().equals(histLatLng)) {
          glb.markerCluster.removeMarker(glb.gmarkers[y]);
          glb.gmarkers[y].setMap(null);
          glb.gmarkers.splice(y, 1);
        }
      }
      glb.history_source.splice(x, 1);
    }
  }
  document.getElementById(String(ID)).remove();
  glb.doPlaceOldPt = false;
  closeNav(0);
}
