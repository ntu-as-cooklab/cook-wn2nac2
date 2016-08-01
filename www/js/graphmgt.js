"use strict";

//NOTE 0 = WIND SPEED, 1 = TEMPERATURE, 2 = HUMIDITY, 3 = PRESSURE
var glbgraph = {
  graphLabels : [],
  graphs : [],
  graphData : []
}

var ctx;
var measureRef;
var alreadyInit = false;
var activated = false;
var showMax = [false, false, false, false];
var showMin = [false, false, false, false];
var showAvg = [false, false, false, false];

function helperInitGraphs()
{
  if (!alreadyInit) {
    glbgraph.graphLabels = [
      [], //WIND SPEED LABELS
      [], //TEMPERATURE LABELS
      [], //HUMIDITY LABELS
      []  //PRESSURE LABELS
    ];
    glbgraph.graphs = [null, null, null, null];
    glbgraph.graphData = [
      [], //WIND SPEED MEASUREMENT
      [], //TEMPERATURE MEASUREMENT
      [], //HUMIDITY MEASUREMENT
      []  //PRESSURE MEASUREMENT
    ];
    var origLineDraw = Chart.controllers.line.prototype.draw;
    //RUNS 172 TIMES FOR SOME REASON...
    //TODO: FIX ABOVE PROBLEM (IF NECESSARY)
    Chart.helpers.extend(Chart.controllers.line.prototype, {
      draw: function() {
        origLineDraw.apply(this, arguments);

        var graph = this.chart;
        var ctx = graph.chart.ctx;
        var index = graph.config.data.datasets[0].data.lastIndexOf(graph.config.data.datasets[0].lineAtIndex);

        if (graph.config.data.datasets[0].data.length > 0) {
          var y = graph.config.data.datasets[0].metaData[index]._model.y;
          if (y) {
            ctx.save();
            ctx.strokeStyle = "#ff0000";
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(graph.chart.width, y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    });
    alreadyInit = true;
  }

  initGraphs();
  setGraphSizes();
}

function setGraphSizes()
{
  var c;
  for (var x = 0; x < glbgraph.graphs.length; x++) {
    switch (x) {
        case 0: c = document.getElementById("wind-graph");
                c.width = c.parentElement.offsetWidth;
                c.height = c.parentElement.offsetHeight;
                break;
        case 1: c = document.getElementById("temp-graph");
                c.width = c.parentElement.offsetWidth;
                c.height = c.parentElement.offsetHeight;
                break;
        case 2: c = document.getElementById("humd-graph");
                c.width = c.parentElement.offsetWidth;
                c.height = c.parentElement.offsetHeight;
                break;
        case 3: c = document.getElementById("pres-graph");
                c.width = c.parentElement.offsetWidth;
                c.height = c.parentElement.offsetHeight;
                break;
    }
  }
}

function initGraphs()
{
  measureRef = glbsens.currentMeasurement;
  for (var x = 0; x < glbgraph.graphs.length; x++) {
    switch (x) {
      case 0: ctx = document.getElementById("wind-graph").getContext("2d");
              break;
      case 1: ctx = document.getElementById("temp-graph").getContext("2d");
              break;
      case 2: ctx = document.getElementById("humd-graph").getContext("2d");
              break;
      case 3: ctx = document.getElementById("pres-graph").getContext("2d");
              break;
    }
    var data = {
      labels: glbgraph.graphLabels[x],
      datasets: [{
        data: glbgraph.graphData[x]
      }]
    };
    glbgraph.graphs[x] = new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
  initGraphLines();
}

function plotPtOnGraph(graphType, check)
{
  if (check || activated) {
    switch (graphType) {
      case 0: var graphRef = glbgraph.graphs[graphType];
              glbgraph.graphLabels[graphType].push(measureRef.windTime[--measureRef.windTime.length]);
              graphRef.labels = glbgraph.graphLabels[graphType];
              glbgraph.graphData[graphType].push(measureRef.wind[--measureRef.wind.length]);
              graphRef.data.datasets[0].data = glbgraph.graphData[graphType];
              graphRef.update();
              break;
      case 1: var graphRef = glbgraph.graphs[graphType];
              glbgraph.graphLabels[graphType].push(measureRef.tempTime[--measureRef.tempTime.length]);
              graphRef.labels = glbgraph.graphLabels[graphType];
              glbgraph.graphData[graphType].push(measureRef.temp[--measureRef.temp.length]);
              graphRef.data.datasets[0].data = glbgraph.graphData[graphType];
              graphRef.update();
              break;
      case 2: var graphRef = glbgraph.graphs[graphType];
              glbgraph.graphLabels[graphType].push(measureRef.humdTime[--measureRef.humdTime.length]);
              graphRef.labels = glbgraph.graphLabels[graphType];
              glbgraph.graphData[graphType].push(measureRef.humd[--measureRef.humd.length]);
              graphRef.data.datasets[0].data = glbgraph.graphData[graphType];
              graphRef.update();
              break;
      case 3: var graphRef = glbgraph.graphs[graphType];
              glbgraph.graphLabels[graphType].push(measureRef.presTime[--measureRef.presTime.length]);
              graphRef.labels = glbgraph.graphLabels[graphType];
              glbgraph.graphData[graphType].push(measureRef.pres[--measureRef.pres.length]);
              graphRef.data.datasets[0].data = glbgraph.graphData[graphType];
              graphRef.update();
              break;
    }
    activated = true;
  }
}

//FIND OUT IF NEED TO SEND DATA BEFORE CLEARING
function clearGraphs()
{
  for (var x = 0; x < glbgraph.graphs.length; x++) {
    var graphRef = glbgraph.graphs[x];
    glbgraph.graphLabels[x] = [];
    graphRef.labels = glbgraph.graphLabels[x];
    glbgraph.graphData[x] = [];
    graphRef.data.datasets[0].data = glbgraph.graphData[x];
    graphRef.update();
  }
}

function toggleMax(graphNum, show)
{
  if (show !== undefined) {
    showMax[graphNum] = show;
  } else {
    showMax[graphNum] = !showMax[graphNum];
  }
}

function toggleMin(graphNum, show)
{
  if (show !== undefined) {
    showMin[graphNum] = show;
  } else {
    showMin[graphNum] = !showMin[graphNum];
  }
}

function toggleAvg(graphNum, show)
{
  if (show !== undefined) {
    showAvg[graphNum] = show;
  } else {
    showAvg[graphNum] = !showAvg[graphNum];
  }
}

function initGraphLines() {
  for (var x = 0; x < 4; x++) {
    if (showMax[x]) drawSigPts(x, "max");
  }
  for (var y = 0; y < 4; y++) {
    if (showMin[y]) drawSigPts(y, "min");
  }
  for (var z = 0; z < 4; z++) {
    if (showAvg[z]) drawSigPts(z, "avg");
  }
}

function drawSigPts(graphNum, sigPt)
{
  switch (graphNum) {
    case 0: ctx = document.getElementById("wind-graph").getContext("2d");
            break;
    case 1: ctx = document.getElementById("temp-graph").getContext("2d");
            break;
    case 2: ctx = document.getElementById("humd-graph").getContext("2d");
            break;
    case 3: ctx = document.getElementById("pres-graph").getContext("2d");
            break;
  }
  var lineVal;
  switch (sigPt) {
    case "max":
      switch (graphNum) {
        case 0: lineVal = measureRef.maxWind;
                break;
        case 1: lineVal = measureRef.maxTemp;
                break;
        case 2: lineVal = measureRef.maxHumd;
                break;
        case 3: lineVal = measureRef.maxPres;
                break;
      }
      break;
    case "min":
      switch (graphNum) {
        case 0: lineVal = measureRef.minWind;
                break;
        case 1: lineVal = measureRef.minTemp;
                break;
        case 2: lineVal = measureRef.minHumd;
                break;
        case 3: lineVal = measureRef.minPres;
                break;
      }
      break;
    case "avg":
      var tempVal;
      switch (graphNum) {
        case 0: if (glbgraph.graphData[graphNum].length > 0) {
                  lineVal = getClosest(glbgraph.graphData(graphNum), measureRef.avgWind);
                } else {
                  lineVal = 0;
                }
                break;
        case 1: if (glbgraph.graphData[graphNum].length > 0) {
                  lineVal = getClosest(glbgraph.graphData(graphNum), measureRef.avgTemp);
                } else {
                  lineVal = 0;
                }
                break;
        case 2: if (glbgraph.graphData[graphNum].length > 0) {
                  lineVal = getClosest(glbgraph.graphData(graphNum), measureRef.avgHumd);
                } else {
                  lineVal = 0;
                }
                break;
        case 3: if (glbgraph.graphData[graphNum].length > 0) {
                  lineVal = getClosest(glbgraph.graphData(graphNum), measureRef.avgPres);
                } else {
                  lineVal = 0;
                }
                break;
      }
      break;
  }
  var data = {
    labels: glbgraph.graphLabels[graphNum],
    datasets: [{
      data: glbgraph.graphData[graphNum],
      lineAtIndex: lineVal
    }]
  };
  glbgraph.graphs[graphNum] = new Chart(ctx, {
    type: 'line',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

function getClosest(arr, num)
{
  var curr = arr[0];
  var diff = Math.abs(num - curr);
  for (var x = 0; x < arr.length; x++) {
    var newDiff = Math.abs(num - arr[x]);
    if (newDiff < diff) {
      diff = newDiff;
      curr = arr[x];
    }
  }
  return curr;
}

// //FOR TESTING
// var SpoofMeasurement = function(data) {
//   this.type = 1;
//   this.data = data;
//   this.timeStarted = 123123;
//   this.wind = data;
// }
//
// function sendSpoofMeasurements(x) {
//   if (x == 0) return;
//   console.log("sent spoof measurement");
//   onEvent(new SpoofMeasurement(x));
//   setTimeout(function() {sendSpoofMeasurements(--x);}, 3000);
// }
