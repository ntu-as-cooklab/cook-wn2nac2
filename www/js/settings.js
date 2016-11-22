'use strict';
var skywatchID = "00:A0:50:08:58:DC";//; //Skywatch ID
var ScanTime = 5000; //5s
var skywatch = null;

function scanBLE(){

    ble.isEnabled(
      function(){
        // Bluetooth is enabled
      },
      function(){
        // Bluetooth not yet enabled so we try to enable it
        ble.enable(
          function(){
            // bluetooth now enabled
          },
          function(err){
            alert('Cannot enable bluetooth');
          }
        );
      }
    );
    console.log("Scanning for devices");
    $("#deviceList").html('');
    ble.startScan(
        [],
        function(device)
        {
            console.log(device);
            if(device.name){
                document.getElementById('deviceList').innerHTML += (
                    '<li class="item item-button-right">'+device.name+'<button class="button button-balanced" onClick="postScan(\''+device.id+'\')">Connect</button></li>'
                );
            }
            if(device.id = skywatchID)
                connectSkywatch();
        },
        function() { console.warn("ERROR: Failed to start scan"); }
    );
    setTimeout(
        ble.stopScan,
        ScanTime,
        function() {
            console.log("Scan timed out");
        },
        function() { console.warn("ERROR: Failed to stop scan"); }
    );
}
function postScan(id){
    ble.stopScan;
    skywatchID = id;
    if (skywatchID) connectSkywatch();
    else console.warn("WARNING: skywatch NOT found.");
}

function connectSkywatch(){
    console.log("Connecting to skywatch...");
    ble.connect(skywatchID, function(device) { skywatchConnected(device) }, function() { console.warn("Failed to connect to skywatch."); } );
}

// function skywatchConnected(device){
//     document.getElementById('deviceList').innerHTML += (
//         '<li class="item">Device Connected!</li>'
//     );
//     // $('#deviceList>button').attr('disabled', true);
//     console.warn("Connected to Skywatch.");
//     skywatch = device;
//     console.log(skywatch);
//     initSkywatch();
// }
function skywatchConnected(device){
    document.getElementById('deviceList').innerHTML += (
        '<li class="item">Device Connected!</li>'
    );
    // $('#deviceList>button').attr('disabled', true);
    console.warn("Connected to Skywatch.");
    skywatch = device;
    console.log(device);
    showSkywatch_16(5);
    showSkywatch_16(6);
    showSkywatch_16(7);
    showSkywatch_32(8);
}

function showSkywatch_16(i){
    ble.startNotification(skywatchID, skywatch.characteristics[i].service, skywatch.characteristics[i].characteristic, onData, function() { console.warn("Failed to start data notifications"); } );
    function onData(buffer){
        // Decode the ArrayBuffer into a typed Array based on the data you expect
        console.log(i+' Unit16Array: '+ ( new Uint16Array(buffer)));

    }
}

function showSkywatch_32(i){
    ble.startNotification(skywatchID, skywatch.characteristics[i].service, skywatch.characteristics[i].characteristic, onData, function() { console.warn("Failed to start data notifications"); } );
    function onData(buffer){
        // Decode the ArrayBuffer into a typed Array based on the data you expect
        console.log(i+' Unit32Array: '+ ( new Uint32Array(buffer)));

    }
}
