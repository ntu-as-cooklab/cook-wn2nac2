"use strict";

var glbmrk = {
  markers : []
};
var gmarkers = [];
var infoWindow = new google.maps.InfoWindow({
  content: ''
});
var mapHolder;

glbmrk.markers = [
  ['0', 'bla', 25.0350836, 121.5343226, 'test1'],
  ['1', 'bla', 25.1050836, 121.5233226, 'test2'],
  ['2', 'bla', 25.0750836, 121.5353445, 'test3'],
  ['3', 'bla', 25.0345836, 121.6353226, 'test1'],
  ['4', 'bla', 25.0350996, 121.5352226, 'test2'],
  ['5', 'bla', 25.0351236, 121.5113226, 'test3'],
  ['6', 'bla', 25.0359836, 121.5399926, 'test3'],
];

function initSensor()
{
  if (typeof Windoo !== 'undefined'){
      Windoo.init(log("Windoo intialized"));
      Windoo.start(log("Windoo started"));
      Windoo.setCallback(onEvent);
  }
}

function passMap(map) {
  mapHolder = map;
}

function addMarker(marker) {
  var category = marker[4];
  var title = marker[1];
  var pos = new google.maps.LatLng(marker[2], marker[3]);
  var content = marker[1];

  var newMarker = new google.maps.Marker({
    title: title,
    position: pos,
    category: category,
    map: mapHolder,
    animation: google.maps.Animation.DROP
  });

  gmarkers.push(newMarker);

  google.maps.event.addListener(newMarker, 'click', (function (newMarker, content) {
    return function() {
      console.log("gmarker gets pushed");
      infoWindow.setContent(content);
      infoWindow.open(mapHolder, newMarker);
      mapHolder.panTo(this.getPosition());
      mapHolder.setZoom(15);
    }
  })(newMarker, content));
}

function filterMarkers(category) {
  for(var x=0;x<glbmrk.markers.length; x++) {
    var marker = gmarkers[x];
    if(marker.category == category || category == 'default') {
      marker.setVisible(true);
    } else marker.setVisible(false);
  }
}

function unfade(element) {
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
      document.body.removeChild(element);
    }
    element.style.opacity = op;
    element.style.filter = 'alpha(opacity=' + op * 100 + ")";
    op -= op * 0.1;
  }, 50);
}
