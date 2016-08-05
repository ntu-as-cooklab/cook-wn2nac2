"use strict";

var glb = {
  //TODO: CHANGE THIS TO CORRESPONDING NUMBER REGARDING glb.markers ARRAY
  markerCounter : 7,
  markers : [],
  gmarkers : [],
  history_source : [],
  history_buff : [],
  tempMarkers : [],
  doPlaceOldPt : true,
  clusterOptions : {
    imagePath: '../images/m'
  },
  markerCluster : null,
  mapRef : null,
  loadDataSucc : false
};

//--- IMPORTANT ---
//STORAGE ARRAYS AND OTHER REFERENCES FOR GETTING DATA FROM SERVER
//NOTE KEEP ALL OLD DATA LISTS IN CASE OF ERRORS, ETC.
var cwbDataLocations = [
  ["C0G740", 23.8542, 120.3128],
  ["C0X240", 23.3331, 120.4995],
  ["C0X250", 23.3124, 120.3086],
  ["C0F9M0", 24.2563, 120.7123],
  ["C0G850", 23.8587, 120.5804],
  ["C0E750", 24.5667, 120.8164],
  ["C0E830", 24.4415, 120.6449],
  ["C0V490", 22.6291, 120.2906],
  ["C0AD00", 25.2596, 121.4934],
  ["C0R430", 22.4667, 120.4333],
  ["C0C630", 24.8847, 121.2569],
  ["C0D570", 24.7487, 120.8973],
  ["C0C520", 24.9695, 121.1771],
  ["C0D550", 24.5287, 121.1079],
  ["C0U770", 24.4512, 121.8020],
  ["C0T9I0", 23.5803, 121.5058],
  ["C0A530", 24.9400, 121.7015],
  ["C0R400", 22.1917, 120.6847],
  ["C0R380", 22.3712, 120.5816],
  ["C0R270", 22.3340, 120.3542],
  ["C0Z060", 23.3233, 121.3316],
  ["C0T870", 23.9374, 121.5008],
  ["C0T820", 24.1814, 121.4875],
  ["C0U710", 24.5072, 121.5175],
  ["C0U600", 24.8193, 121.7574],
  ["C0A970", 25.0094, 121.9939],
  ["C0X080", 23.1750, 120.1367],
  ["C0K290", 23.5374, 120.1610],
  ["C0K280", 23.6311, 120.2172],
  ["C0K330", 23.7214, 120.4325],
  ["C0I010", 24.0350, 121.1733],
  ["C0G650", 23.9483, 120.5775],
  ["C0G640", 24.0769, 120.4222],
  ["C0K240", 23.5956, 120.6933],
  ["C0I110", 23.7647, 120.6778],
  ["C0G660", 23.9518, 120.4711],
  ["C0H960", 23.9754, 120.6722],
  ["C0R220", 22.5361, 120.5320],
  ["C0V250", 23.0817, 120.5825],
  ["C0R150", 22.7117, 120.6319],
  ["C0V310", 22.9006, 120.5111],
  ["C0V370", 22.8950, 120.3939],
  ["C0O900", 23.1144, 120.2894],
  ["C0M410", 23.3264, 120.5736],
  ["C0H9C0", 24.1448, 121.2641],
  ["C0F860", 24.2450, 121.2377],
  ["C0F850", 24.2482, 120.8249],
  ["C0F930", 24.3499, 120.6324],
  ["C0E530", 24.4128, 120.7578],
  ["C0E420", 24.7108, 120.8808],
  ["C0D390", 24.8001, 121.1657],
  ["C0C480", 24.9943, 121.3150]
];
var cwbServerData = [];
var oldCwbServerData = [];

//NOTE ARRAYS MARKERS AND GMARKERS SHOULD ALWAYS HAVE THE SAME CONTENTS AND THE SAME ORDER
//TODO: REFILL WITH RELEASE PLACEHOLDER MARKERS AND ACTUAL DATA MARKERS
glb.markers = [
  ['0', 'bla', 25.0350836, 121.5343226, 'test1'],
  ['1', 'bla', 25.1050836, 121.5233226, 'test2'],
  ['2', 'bla', 25.0750836, 121.5353445, 'test2'],
  ['3', 'bla', 25.0345836, 121.6353226, 'test1'],
  ['4', 'bla', 25.0350996, 121.5352226, 'test3'],
  ['5', 'bla', 25.0351236, 121.5113226, 'test3'],
  ['6', 'bla', 25.0359836, 121.5399926, 'test3'],
];

var infoWindow;
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

function setMap(a_map_moron) {
  map = a_map_moron;
  glb.mapRef = map;
}

/*
NOTE ONLY ADDS TO glb.gmarkers
param: array for glb.markers
*/
function addMarker(marker) {
  infoWindow = new google.maps.InfoWindow({
    content: ''
  });
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
/*
NOTE REMOVES FROM BOTH glb.markers AND glb.gmarkers
param: identifier for element to be removed
*/
function removeMarker(selectValue)
{
  switch (selectValue) {
    case 'cwb': for (var x = 0; x < glb.markers.length; x++) {
                  if (glb.markers[x][4] == selectValue) {
                    var pos = new google.maps.LatLng(glb.markers[x][2], glb.markers[x][3]);
                    for (var y = 0; y < glb.gmarkers.length; y++) {
                      if (glb.gmarkers[y].getPosition().equals(pos)) {
                        glb.gmarkers[y].setMap(null);
                        glb.gmarkers.splice(y, 1);
                        break;
                      }
                    }
                    glb.markers.splice(x, 1);
                    break;
                  }
                }
                break;
  }
}

function filterMarkers(category)
{
  glb.tempMarkers = [];
  for(var x = 0; x < glb.gmarkers.length; x++) {
    var marker = glb.gmarkers[x];
    if(marker.category == category || category == 'all' || marker.category == 'history') {
      glb.tempMarkers.push(marker);
      marker.setVisible(true);
    } else marker.setVisible(false);
  }

  glb.markerCluster.clearMarkers();
  if (category != 'default') glb.markerCluster.addMarkers(glb.tempMarkers);
}

function unfade(element)
{
  element.style.visibility = "visible";
  var op = 0.1;
  var timer = setInterval(function() {
    if (op >= 1) {
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
    if (op <= 0.1) {
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
