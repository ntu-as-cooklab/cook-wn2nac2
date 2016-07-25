"use strict";

//NOTE 0 = WIND SPEED, 1 = TEMPERATURE, 2 = HUMIDITY, 3 = PRESSURE
var glbgraph = {
  graphLabels : [],
  graphs : [],
  graphData : []
}

var ctx;
var alreadyInit = false;

function helperInitGraphs()
{
  setGraphSizes();
  if (!alreadyInit) {
    glbgraph.graphLabels = [
      [], //WIND SPEED LABELS
      [], //TEMPERATURE LABELS
      [], //HUMIDITY LABELS
      []  //PRESSURE LABELS
    ];
    glbgraph.graphs = [null, null, null, null];
    glbgraph.graphData = [
      [], //WIND SPEED DATA
      [], //TEMPERATURE DATA
      [], //HUMIDITY DATA
      []  //PRESSURE DATA
    ];
    alreadyInit = true;
  }

  initGraphs();
}

function setGraphSizes()
{
  var c;
  for (var x = 0; x < 4; x++) {
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
  for (var x = 0; x < 4; x++) {
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
        responsive: true
      }
    });
    //FIX GRAPH SIZES
  }
}

function plotPtOnGraph(dataPt, graphType)
{
  switch (graphType) {
    case 0: var graphRef = glbgraph.graphs[graphType];
            glbgraph.graphLabels[graphType].push(dataPt.timeStarted);
            graphRef.labels = glbgraph.graphLabels[graphType];
            glbgraph.graphData[graphType].push(dataPt.wind);
            graphRef.data.datasets[0].data = glbgraph.graphData[graphType];
            graphRef.update();
            break;
    case 1: var graphRef = glbgraph.graphs[graphType];
            glbgraph.graphLabels[graphType].push(dataPt.timeStarted);
            graphRef.labels = glbgraph.graphLabels[graphType];
            glbgraph.graphData[graphType].push(dataPt.temp);
            graphRef.data.datasets[0].data = glbgraph.graphData[graphType];
            graphRef.update();
            break;
    case 2: var graphRef = glbgraph.graphs[graphType];
            glbgraph.graphLabels[graphType].push(dataPt.timeStarted);
            graphRef.labels = glbgraph.graphLabels[graphType];
            glbgraph.graphData[graphType].push(dataPt.humd);
            graphRef.data.datasets[0].data = glbgraph.graphData[graphType];
            graphRef.update();
            break;
    case 3: var graphRef = glbgraph.graphs[graphType];
            glbgraph.graphLabels[graphType].push(dataPt.timeStarted);
            graphRef.labels = glbgraph.graphLabels[graphType];
            glbgraph.graphData[graphType].push(dataPt.pres);
            graphRef.data.datasets[0].data = glbgraph.graphData[graphType];
            graphRef.update();
            break;
  }
}

// function addData(count)
// {
//   if (count == 0) return;
//   templabels.push(String(count));
//   tempchart.labels = templabels;
//   var random = Math.floor(Math.random() * (100 - 1 + 1)) + 1;
//   data1.push(random);
//   tempchart.data.datasets[0].data = data1;
//   count--;
//   tempchart.update();
//   setTimeout(function() {addData(count)}, 500);
// }
