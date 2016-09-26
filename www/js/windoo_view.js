"use strict";
var chartTemp=0, chartHumd=0, chartWind=0, chartPres=0;
function drawAllChart(){
    new drawChart2('tempChart', 'chartTemp');
    new drawChart2('humdChart', 'chartHumd');
    new drawChart('windChart', 'chartWind');
    new drawChart2('presChart', 'chartPres');
}
function drawChart(target, val){
    var chartTarget = "#" + target;
    var margin = {top: 10, right: 10, bottom: 20, left: 40},
    width = 160 - margin.left - margin.right,
    height = 140 - margin.top - margin.bottom,
    dataLen = 16;
    $(chartTarget).empty();
    var svg = d3.select(chartTarget).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var data = [];
    var idx = 0;
    function makeData(){
        if(data.length<dataLen){
            data.push({x: idx, y: eval(val) });
        }
        else{
            data.shift();
            data.forEach(function(d){
                d.x -= 1;
            });
            data.push({x: dataLen-1, y: eval(val) });
        }
        idx++;
    }

    makeData();

    var min = 0;
    var max = d3.max(data, function(d){ return d.y; })*1.2;
    var xScale = d3.scale.linear()
        .domain([0, dataLen-1])
        .range([0, width]);

    var yScale = d3.scale.linear()
        .domain([ min, max])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .innerTickSize(-height)
        .outerTickSize(0)
        .tickPadding(10)
        .tickValues([-10,60]);;

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .innerTickSize(-width)
        .outerTickSize(0)
        .tickPadding(10);

    var line = d3.svg.line().interpolate('monotone')
        .x(function(d) { return xScale(d.x); })
        .y(function(d) { return yScale(d.y); });

    var lineArea = d3.svg.area()
		.x(function(d){ return xScale(d.x); })
		.y0(yScale(min))
        .y1(function(d){ return yScale(d.y); })
		.interpolate('monotone');

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)

    svg.append("g")
        .attr("class","y axis")
        .call(yAxis);

    var lines = svg.append("path")
               .data([data])
               .attr("class", "line")
               .attr("d", line);

    var area = svg.append("path")
                 .data([data])
                 .attr("class", "area")
                 .attr("d", lineArea);


    function update(){
        makeData();

        var min = 0;
        var max = d3.max(data, function(d){ return d.y; })*1.2;

        var yScale = d3.scale.linear()
            .domain([ min, max])
            .range([height, 0]);

        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .innerTickSize(-width)
            .outerTickSize(0)
            .tickPadding(10);
        var lineArea = d3.svg.area()
    		.x(function(d){ return xScale(d.x); })
    		.y0(yScale(min))
            .y1(function(d){ return yScale(d.y); })
    		.interpolate('monotone');
        var line = d3.svg.line().interpolate('monotone')
            .x(function(d) { return xScale(d.x); })
            .y(function(d) { return yScale(d.y); });
        // Select the section we want to apply our changes to
        var svg = d3.select(chartTarget).transition();

        // Make the changes
        svg.select(".line")  // change the line
            .duration(0)
            .attr("d", line);

        svg.select(".area")  // change the line
            .duration(0)
            .attr("d", lineArea);

        svg.select(".y.axis") // change the y axis
            .duration(750)
            .call(yAxis);
    }

    // continuous page render
    setInterval(update, 1000);
}
function drawChart2(target, val){
    var chartTarget = "#" + target;
    var margin = {top: 10, right: 10, bottom: 20, left: 40},
    width = 160 - margin.left - margin.right,
    height = 140 - margin.top - margin.bottom,
    dataLen = 16;
    $(chartTarget).empty();
    var svg = d3.select(chartTarget).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var data = [];
    var idx = 0;
    function makeData(){
        if(data.length<dataLen){
            data.push({x: idx, y: eval(val) });
        }
        else{
            data.shift();
            data.forEach(function(d){
                d.x -= 1;
            });
            data.push({x: dataLen-1, y: eval(val) });
        }
        idx++;
    }

    makeData();

    var max = d3.max(data, function(d){ return d.y; })*1.01;
    var min = d3.min(data, function(d){ return d.y; })*0.98;
    var xScale = d3.scale.linear()
        .domain([0, dataLen-1])
        .range([0, width]);

    var yScale = d3.scale.linear()
        .domain([ min, max])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .innerTickSize(-height)
        .outerTickSize(0)
        .tickPadding(10)
        .tickValues([-10,60]);;

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .innerTickSize(-width)
        .outerTickSize(0)
        .tickPadding(10);

    var line = d3.svg.line().interpolate('monotone')
        .x(function(d) { return xScale(d.x); })
        .y(function(d) { return yScale(d.y); });

    var lineArea = d3.svg.area()
		.x(function(d){ return xScale(d.x); })
		.y0(yScale(min))
        .y1(function(d){ return yScale(d.y); })
		.interpolate('monotone');

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)

    svg.append("g")
        .attr("class","y axis")
        .call(yAxis);

    var lines = svg.append("path")
               .data([data])
               .attr("class", "line")
               .attr("d", line);

    var area = svg.append("path")
                 .data([data])
                 .attr("class", "area")
                 .attr("d", lineArea);


    function update(){
        makeData();

        var max = d3.max(data, function(d){ return d.y; })*1.01;
        var min = d3.min(data, function(d){ return d.y; })*0.98;

        var yScale = d3.scale.linear()
            .domain([ min, max])
            .range([height, 0]);

        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .innerTickSize(-width)
            .outerTickSize(0)
            .tickPadding(10);
        var lineArea = d3.svg.area()
    		.x(function(d){ return xScale(d.x); })
    		.y0(yScale(min))
            .y1(function(d){ return yScale(d.y); })
    		.interpolate('monotone');
        var line = d3.svg.line().interpolate('monotone')
            .x(function(d) { return xScale(d.x); })
            .y(function(d) { return yScale(d.y); });
        // Select the section we want to apply our changes to
        var svg = d3.select(chartTarget).transition();

        // Make the changes
        svg.select(".line")  // change the line
            .duration(0)
            .attr("d", line);

        svg.select(".area")  // change the line
            .duration(0)
            .attr("d", lineArea);

        svg.select(".y.axis") // change the y axis
            .duration(750)
            .call(yAxis);
    }

    // continuous page render
    setInterval(update, 1000);
}
