"use strict";

var glb = {
  markers : [],
  gmarkers : [],
  history_source : [],
  tempMarkers : [],
  doPlaceOldPt : true,
  clusterOptions : {
    imagePath: 'images/m'
  },
  markerCluster : null
};

//NOTE ARRAYS MARKERS AND GMARKERS SHOULD ALWAYS HAVE THE SAME CONTENTS AND THE SAME ORDER
//TODO: REFILL WITH RELEASE PLACEHOLDER MARKERS AND ACTUAL DATA MARKERS
glb.markers = [
  ['0', 'bla', 25.0350836, 121.5343226, 'cwb'],
  ['1', 'bla', 25.1050836, 121.5233226, 'test3'],
  ['2', 'bla', 25.0750836, 121.5353445, 'test3'],
  ['3', 'bla', 25.0345836, 121.6353226, 'cwb'],
  ['4', 'bla', 25.0350996, 121.5352226, 'test3'],
  ['5', 'bla', 25.0351236, 121.5113226, 'test3'],
  ['6', 'bla', 25.0359836, 121.5399926, 'test3'],
];
//NOTE THESE NAMES AND THE IDS OF HISTORY ITEMS SHOULD MATCH
// glb.history_source = [
//   [0, 43.0735848, -89.4112561, 'random info/title', false],
//   [1, 45.4323528, -122.4187675, 'random info/title', false],
//   [5, 42.4347181, -84.0025096, 'random info/title', false]
// ];

var infoWindow = new google.maps.InfoWindow({
  content: ''
});
var map;
var measureScreenIndex = 0;

function initSensor()
{
  if (typeof Windoo !== 'undefined'){
      Windoo.init(log("Windoo intialized"));
      Windoo.start(log("Windoo started"));
      Windoo.setCallback(onEvent);
  }
}

function setMap(use) {
  map = use;
}

//BUTTON/OTHER LISTENERS


function addMarker(marker) {
  var category = marker[4];
  var title = marker[1];
  var pos = new google.maps.LatLng(marker[2], marker[3]);
  var content = marker[1];

  var newMarker = new google.maps.Marker({
    title: title,
    position: pos,
    category: category,
    map: map,
    animation: google.maps.Animation.DROP
  });

  glb.gmarkers.push(newMarker);

  google.maps.event.addListener(newMarker, 'click', (function (newMarker, content) {
    return function() {
      infoWindow.setContent(content);
      infoWindow.open(map, newMarker);
      map.panTo(this.getPosition());
      map.setZoom(15);
    }
  })(newMarker, content));

  newMarker.setVisible(false);
}

function filterMarkers(category) {
  glb.tempMarkers = [];
  for(var x = 0; x < glb.markers.length; x++) {
    var marker = glb.gmarkers[x];
    if(marker.category == category || category == 'all') {
      glb.tempMarkers.push(marker);
      marker.setVisible(true);
    } else marker.setVisible(false);
  }

  //FOR EMPTY CATEGORY CASE, PERHAPS SEND PLACEHOLDER PT (USER LOCATION) TO FORCE NO DISPLAY
  glb.markerCluster.clearMarkers();
  if (category != 'default') glb.markerCluster.addMarkers(glb.tempMarkers);
}

function unfade(element) {
  element.style.visibility = "visible";
  var op = 0.1;
  var timer = setInterval(function() {
    if(op >= 1) {
      clearInterval(timer);
    }
    element.style.opacity = op;
    element.style.filter = 'alpha(opacity=' + op * 100 + ")";
    op += op * 0.1;
  }, 10);
}

function fade(element) {
  var op = 0.9;
  var timer = setInterval(function() {
    if(op <= 0.1) {
      clearInterval(timer);
      element.style.opacity = 0.001;
    }
    element.style.opacity = op;
    element.style.filter = 'alpha(opacity=' + op * 100 + ")";
    op -= op * 0.1;
  }, 50);
  element.style.visibility = "hidden";
}

function openNav(menuID) {
  switch (menuID) {
    case 0:
      document.getElementById("info-list-history").style.width = "250px";
      document.getElementById("list-mask").addEventListener('click', function(e) {
          e.preventDefault();
          closeNav(menuID);
      });
      document.getElementById("list-mask").classList.add('is-active');
      break;
    case 1:
      document.getElementById("info-list-measurement").style.width = "250px";
      document.getElementById("list-mask").addEventListener('click', function(e) {
          e.preventDefault();
          closeNav(menuID);
      });
      document.getElementById("list-mask").classList.add('is-active');
      break;
  }
}
function closeNav(menuID) {
  switch (menuID) {
    case 0:
      document.getElementById("info-list-history").style.width = "0";
      document.getElementById("list-mask").classList.remove('is-active');
      break;
    case 1:
      document.getElementById("info-list-measurement").style.width = "0";
      document.getElementById("list-mask").classList.remove('is-active');
      break;
  }
}

function placeOldPt(ID) {
  if (glb.doPlaceOldPt) {
    for (var x = 0; x < glb.history_source.length; x++) {
      if (glb.history_source[x][0] == ID) {
        var oldLatLng = new google.maps.LatLng(glb.history_source[x][1], glb.history_source[x][2]);
        map.panTo(oldLatLng);
        if (!glb.history_source[x][4]) {
          var newMarker = new google.maps.Marker({
            title: glb.history_source[x][3],
            position: oldLatLng,
            category: 'history',
            map: map,
            animation: google.maps.Animation.DROP
          });
          glb.gmarkers.push(newMarker);
          glb.tempMarkers.push(newMarker);
          glb.markerCluster.clearMarkers();
          glb.markerCluster.addMarkers(glb.tempMarkers);
          glb.history_source[x][4] = true;
        }
        closeNav(0);
        break;
      }
    }
  }
  glb.doPlaceOldPt = true;
}


//TODO: FIX FOR DELETING MARKER FROM TEMP ARRAY AND RECREATING MARKERCLUSTER
function deletePt(ID) {
  for (var x = 0; x < glb.history_source.length; x++) {
    if (glb.history_source[x][0] == ID) {
      var histLatLng = new google.maps.LatLng(glb.history_source[x][1], glb.history_source[x][2]);
      for (var y = 0; y < glb.gmarkers.length; y++) {
        if (glb.gmarkers[y].getPosition().equals(histLatLng)) {
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
