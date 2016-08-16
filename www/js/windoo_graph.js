"use strict"

var WindooGraph = function ()
{
    this.alreadyInit    = false;
    this.graph          = null;
    this.graphLabels    = [];
    this.graphData      = [];
};

WindooGraph.prototype.helperInitGraphs = function ()
{
    if (!this.alreadyInit)
    {
        this.graph          = null;
        this.graphLabels    = [];
        this.graphData      = [];
    }

    // var origLineDraw = Chart.controllers.line.prototype.draw;
    // //RUNS 172 OR SO TIMES FOR SOME REASON...
    // Chart.helpers.extend(Chart.controllers.line.prototype, {
    //   draw: function() {
    //     origLineDraw.apply(this, arguments);
    //
    //     var graph = this.chart;
    //     var ctx = graph.chart.ctx;
    //     for (var i = 0; i < 3; i++) {
    //       var origVal = graph.config.data.datasets[0].lineAtIndex[i];
    //       var index = graph.scales["y-axis-0"].getPixelForValue(origVal);
    //       origVal = Math.round(origVal * 100) / 100;
    //
    //       if (graph.config.data.datasets[0].data.length > 0) {
    //         var y;
    //         if (index < 0) {
    //           y = 0;
    //         } else {
    //           //y = graph.config.data.datasets[0].metaData[index]._model.y;
    //           y = index;
    //         }
    //         if (typeof y !== "undefined") {
    //           ctx.save();
    //           ctx.strokeStyle = "#ff0000";
    //           ctx.beginPath();
    //           ctx.moveTo(0, y);
    //           ctx.lineTo(graph.chart.width, y);
    //           ctx.stroke();
    //           ctx.textAlign = "center";
    //           ctx.font = "bold 10pt Courier";
    //           ctx.fillStyle = "black";
    //           if (i == 0) {
    //             ctx.fillText("Max:" + origVal, graph.chart.width - 37, y - 2);
    //           } else if (i == 1) {
    //             ctx.fillText("Min:" + origVal, graph.chart.width - 37, y - 2);
    //           } else if (i == 2) {
    //             ctx.fillText("Avg:" + origVal, graph.chart.width - 37, y - 2);
    //           }
    //           ctx.restore();
    //         }
    //       }
    //     }
    //   }
    // });

    alreadyInit = true;
}

WindooGraph.prototype = Object.create(HTMLElement.prototype);

WindooGraph.prototype.createdCallback = function() {

    // document.addEventListener('windooStatusChanged',
    //     (function (instance) { return function (e) { instance.setStatus(e.detail); } })(this)
    // )
};

WindooGraph = document.registerElement('windoo-graph', { prototype: WindooGraph.prototype });
