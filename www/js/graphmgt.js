"use strict";

//NOTE 0 = WIND SPEED, 1 = TEMPERATURE, 2 = HUMIDITY, 3 = PRESSURE
var glbgraph = {
  graphLabels : [],
  graphs : [],
  graphData : []
}

//--- IMPORTANT ---
//STORAGE ARRAYS AFTER CLEARING OF GRAPHS (AND RESPECTIVE DATA)
var storeLabels = [
  [], //WIND SPEED LABELS
  [], //TEMPERATURE LABELS
  [], //HUMIDITY LABELS
  []  //PRESSURE LABELS
];
var storeData = [
  [], //WIND SPEED DATA
  [], //TEMPERATURE DATA
  [], //HUMIDITY DATA
  []  //PRESSURE DATA
];

var ctx;
var measureRef = {};
var alreadyInit = false;
var alreadyInitGraphs = false;
var activated = false;
var showMax = [false, false, false, false];
var showMin = [false, false, false, false];
var showAvg = [false, false, false, false];
var clearedDataReady = false;

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
    //RUNS 172 OR SO TIMES FOR SOME REASON...
    Chart.helpers.extend(Chart.controllers.line.prototype, {
      draw: function() {
        origLineDraw.apply(this, arguments);

        var graph = this.chart;
        var ctx = graph.chart.ctx;
        for (var i = 0; i < 3; i++) {
          var origVal = graph.config.data.datasets[0].lineAtIndex[i];
          var index = graph.scales["y-axis-0"].getPixelForValue(origVal);
          origVal = Math.round(origVal * 100) / 100;

          if (graph.config.data.datasets[0].data.length > 0) {
            var y;
            if (index < 0) {
              y = 0;
            } else {
              //y = graph.config.data.datasets[0].metaData[index]._model.y;
              y = index;
            }
            if (typeof y !== "undefined") {
              ctx.save();
              ctx.strokeStyle = "#ff0000";
              ctx.beginPath();
              ctx.moveTo(0, y);
              ctx.lineTo(graph.chart.width, y);
              ctx.stroke();
              ctx.textAlign = "center";
              ctx.font = "bold 10pt Courier";
              ctx.fillStyle = "black";
              if (i == 0) {
                ctx.fillText("Max:" + origVal, graph.chart.width - 37, y - 2);
              } else if (i == 1) {
                ctx.fillText("Min:" + origVal, graph.chart.width - 37, y - 2);
              } else if (i == 2) {
                ctx.fillText("Avg:" + origVal, graph.chart.width - 37, y - 2);
              }
              ctx.restore();
            }
          }
        }
      }
    });
    alreadyInit = true;
  }

  setGraphSizes();
  initGraphs();
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
  if (!alreadyInitGraphs) {
    measureRef = glbsens.windooObservation;
    alreadyInitGraphs = true;
  } else {
    updateMeasureRef();
  }
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
        data: glbgraph.graphData[x],
        lineAtIndex: [0, 0, 0]
      }]
    };
    //TEST
    // var data = {
    //   labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    //   datasets: [{
    //     data: [5, 4, 11, 11, 2, 30, 11, 12, 9, 1, 23],
    //     lineAtIndex: [2, 4, 12]
    //   }]
    // };
    glbgraph.graphs[x] = new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            display: true,
            ticks: {
              suggestedMin: 0,
              beginAtZero: true
            }
          }],
          xAxes: [{
            display: true,
            ticks: {
              suggestedMin: 0,
              beginAtZero: true
            }
          }]
        }
      }
    });
    //TODO: FIX THIS (IF NECESSARY)
    // glbgraph.graphs[x].data.datasets[0].lineAtIndex = glbgraph.graphs[x].chart.height;
    // glbgraph.graphs[x].update();
  }
  initGraphLines();
}

function plotPtOnGraph(graphType, check)
{
  updateMeasureRef();
  if (check || activated) {
    switch (graphType) {
      case 0: var graphRef = glbgraph.graphs[graphType];
              limitGraph(graphType);
              glbgraph.graphLabels[graphType].push(parseDate(measureRef.windTime[measureRef.windTime.length - 1]));
              graphRef.labels = glbgraph.graphLabels[graphType];
              glbgraph.graphData[graphType].push(measureRef.wind[measureRef.wind.length - 1]);
              graphRef.data.datasets[0].data = glbgraph.graphData[graphType];
              graphRef.update();
              break;
      case 1: var graphRef = glbgraph.graphs[graphType];
              limitGraph(graphType);
              glbgraph.graphLabels[graphType].push(parseDate(measureRef.tempTime[measureRef.tempTime.length - 1]));
              graphRef.labels = glbgraph.graphLabels[graphType];
              glbgraph.graphData[graphType].push(measureRef.temp[measureRef.temp.length - 1]);
              graphRef.data.datasets[0].data = glbgraph.graphData[graphType];
              graphRef.update();
              break;
      case 2: var graphRef = glbgraph.graphs[graphType];
              limitGraph(graphType);
              glbgraph.graphLabels[graphType].push(parseDate(measureRef.humdTime[measureRef.humdTime.length - 1]));
              graphRef.labels = glbgraph.graphLabels[graphType];
              glbgraph.graphData[graphType].push(measureRef.humd[measureRef.humd.length - 1]);
              graphRef.data.datasets[0].data = glbgraph.graphData[graphType];
              graphRef.update();
              break;
      case 3: var graphRef = glbgraph.graphs[graphType];
              limitGraph(graphType);
              glbgraph.graphLabels[graphType].push(parseDate(measureRef.presTime[measureRef.presTime.length - 1]));
              graphRef.labels = glbgraph.graphLabels[graphType];
              glbgraph.graphData[graphType].push(measureRef.pres[measureRef.pres.length - 1]);
              graphRef.data.datasets[0].data = glbgraph.graphData[graphType];
              graphRef.update();
              break;
    }
    activated = true;
  }
}

function limitGraph(graphType)
{
  switch (graphType) {
    case 0: if (glbgraph.graphLabels[graphType].length >= 10 || glbgraph.graphData[graphType].length >= 10) {
              var tempLabels = [];
              var tempData = [];
              for (var x = 9; x > 0; x--) {
                tempLabels.push(parseDate(measureRef.windTime[measureRef.windTime.length - x]));
                tempData.push(measureRef.wind[measureRef.wind.length - x]);
              }
              glbgraph.graphLabels[graphType] = tempLabels;
              glbgraph.graphData[graphType] = tempData;
            }
            break;
    case 1: if (glbgraph.graphLabels[graphType].length >= 10 || glbgraph.graphData[graphType].length >= 10) {
              var tempLabels = [];
              var tempData = [];
              for (var x = 9; x > 0; x--) {
                tempLabels.push(parseDate(measureRef.tempTime[measureRef.tempTime.length - x]));
                tempData.push(measureRef.temp[measureRef.temp.length - x]);
              }
              glbgraph.graphLabels[graphType] = tempLabels;
              glbgraph.graphData[graphType] = tempData;
            }
            break;
    case 2: if (glbgraph.graphLabels[graphType].length >= 10 || glbgraph.graphData[graphType].length >= 10) {
              var tempLabels = [];
              var tempData = [];
              for (var x = 9; x > 0; x--) {
                tempLabels.push(parseDate(measureRef.humdTime[measureRef.humdTime.length - x]));
                tempData.push(measureRef.humd[measureRef.humd.length - x]);
              }
              glbgraph.graphLabels[graphType] = tempLabels;
              glbgraph.graphData[graphType] = tempData;
            }
            break;
    case 3: if (glbgraph.graphLabels[graphType].length >= 10 || glbgraph.graphData[graphType].length >= 10) {
              var tempLabels = [];
              var tempData = [];
              for (var x = 9; x > 0; x--) {
                tempLabels.push(parseDate(measureRef.presTime[measureRef.presTime.length - x]));
                tempData.push(measureRef.pres[measureRef.pres.length - x]);
              }
              glbgraph.graphLabels[graphType] = tempLabels;
              glbgraph.graphData[graphType] = tempData;
            }
            break;
  }
}

function parseDate(dateString)
{
  var date = new Date(dateString);
  var readableDate = null;

  readableDate = date.getUTCHours() + ":" + date.getUTCMinutes() + ":" + date.getUTCSeconds();
  return readableDate;
}

//FIND OUT IF NEED TO SEND DATA BEFORE CLEARING
function clearGraphs()
{
  for (var x = 0; x < glbgraph.graphs.length; x++) {
    var graphRef = glbgraph.graphs[x];
    storeLabels[x] = glbgraph.graphLabels[x];
    glbgraph.graphLabels[x] = [];
    graphRef.labels = glbgraph.graphLabels[x];
    storeData[x] = glbgraph.graphData[x];
    glbgraph.graphData[x] = [];
    graphRef.data.datasets[0].data = glbgraph.graphData[x];
    graphRef.update();
  }
  clearedDataReady = true;
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
  measureRef.finalize();
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
                  lineVal = measureRef.avgWind;
                } else {
                  lineVal = 0;
                }
                break;
        case 1: if (glbgraph.graphData[graphNum].length > 0) {
                  lineVal = measureRef.avgTemp;
                } else {
                  lineVal = 0;
                }
                break;
        case 2: if (glbgraph.graphData[graphNum].length > 0) {
                  lineVal = measureRef.avgHumd;
                } else {
                  lineVal = 0;
                }
                break;
        case 3: if (glbgraph.graphData[graphNum].length > 0) {
                  lineVal = measureRef.avgPres;
                } else {
                  lineVal = 0;
                }
                break;
      }
      break;
  }
  // var data = {
  //   labels: glbgraph.graphLabels[graphNum],
  //   datasets: [{
  //     data: glbgraph.graphData[graphNum],
  //     lineAtIndex: lineVal
  //   }]
  // };
  // glbgraph.graphs[graphNum] = new Chart(ctx, {
  //   type: 'line',
  //   data: data,
  //   options: {
  //     responsive: true,
  //     maintainAspectRatio: false,
  //     scales: {
  //       yAxes: [{
  //         display: true,
  //         ticks: {
  //           suggestedMin: 0,
  //           beginAtZero: true
  //         }
  //       }],
  //       xAxes: [{
  //         display: true,
  //         ticks: {
  //           suggestedMin: 0,
  //           beginAtZero: true
  //         }
  //       }]
  //     }
  //   }
  // });
  switch (sigPt) {
    case "max": glbgraph.graphs[graphNum].data.datasets[0].lineAtIndex[0] = lineVal;
                break;
    case "min": glbgraph.graphs[graphNum].data.datasets[0].lineAtIndex[1] = lineVal;
                break;
    case "avg": glbgraph.graphs[graphNum].data.datasets[0].lineAtIndex[2] = lineVal;
                break;
  }
  glbgraph.graphs[graphNum].update();
}

function updateMeasureRef()
{
    console.log(measureRef);
  measureRef.wind = measureRef.wind.concat(glbsens.windooObservation.wind);
  measureRef.temp = measureRef.temp.concat(glbsens.windooObservation.temp);
  measureRef.humd = measureRef.humd.concat(glbsens.windooObservation.humd);
  measureRef.pres = measureRef.pres.concat(glbsens.windooObservation.pres);
  measureRef.windTime = measureRef.windTime.concat(glbsens.windooObservation.windTime);
  measureRef.tempTime = measureRef.tempTime.concat(glbsens.windooObservation.tempTime);
  measureRef.humdTime = measureRef.humdTime.concat(glbsens.windooObservation.humdTime);
  measureRef.presTime = measureRef.presTime.concat(glbsens.windooObservation.presTime);
}

//TEST WITH fakeWindoo.start()
