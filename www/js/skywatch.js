"use strict";
//This part is for SkyWatch
//Using function from setting.js
function initSkywatch(){
    showSkywatch_wind();//*0.01
    showSkywatch_temp();//*0.01
    showSkywatch_humd();//*0.01
    showSkywatch_pres();//*0.001
}

function showSkywatch_wind(){
    ble.startNotification(skywatchID, skywatch.characteristics[5].service, skywatch.characteristics[5].characteristic, onData, function() { console.warn("Failed to start data notifications"); } );
    function onData(buffer){
        var sw_w = (new Uint16Array(buffer))*0.01;
        $("#w_wind").html(sw_w.toFixed(1));
        chartWind = sw_w;
        console.log(sw_w);
    }
}

function showSkywatch_temp(){
    ble.startNotification(skywatchID, skywatch.characteristics[6].service, skywatch.characteristics[6].characteristic, onData, function() { console.warn("Failed to start data notifications"); } );
    function onData(buffer){
        var sw_t = (new Uint16Array(buffer))*0.01;
        $("#w_temp").html(sw_t.toFixed(1));
        chartTemp = sw_t;
        console.log(sw_t);
    }
}

function showSkywatch_humd(){
    ble.startNotification(skywatchID, skywatch.characteristics[7].service, skywatch.characteristics[7].characteristic, onData, function() { console.warn("Failed to start data notifications"); } );
    function onData(buffer){
        var sw_h = (new Uint16Array(buffer))*0.01;
        $("#w_rh").html(sw_h.toFixed(1));
        chartHumd = sw_h;
        console.log(sw_h);
    }
}

function showSkywatch_pres(){
    ble.startNotification(skywatchID, skywatch.characteristics[8].service, skywatch.characteristics[8].characteristic, onData, function() { console.warn("Failed to start data notifications"); } );
    function onData(buffer){
        var sw_p = (new Uint32Array(buffer))*0.001;
        $("#w_pres").html(sw_p.toFixed(0));
        chartPres = sw_p;
        console.log(sw_p);
    }
}

function hideSkywatch(i){
    ble.stopNotification(skywatchID, skywatch.characteristics[i].service, skywatch.characteristics[i].characteristic,function(){}, function() { console.warn("Failed to start data notifications"); } );
}

ble.startNotification("00:A0:50:08:58:DC", "181a", "2a6d",
function(buffer){
    var sw_p = (new Uint32Array(buffer))*0.001;
    $("#w_pres").html(sw_p.toFixed(0));
    chartPres = sw_p;
    console.log('111');
}, function() { console.warn("Failed to start data notifications"); } );
