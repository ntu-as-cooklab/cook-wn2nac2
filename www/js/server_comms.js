var lastMeasurement;
var listenersActive = false;

function sendMeasurement()
{
    $.post( "http://mospc.cook.as.ntu.edu.tw/post4.php", JSON.parse(JSON.stringify(glbsens.currentMeasurement)),
        function( data ) {
            console.log(data);
        });
}

function getMeasurement(begin, end)
{
    $.get( "http://mospc.cook.as.ntu.edu.tw/get4.php", { begin: begin, end: end },
        function( data ) {
            var measurement = JSON.parse(data);
            console.log(measurement);
        });
}

var lastMeasurement;
function getLastMeasurement()
{
    $.get( "http://mospc.cook.as.ntu.edu.tw/getlast.php", null,
        function( data ) {
            lastMeasurement = JSON.parse(data);
            console.log(lastMeasurement);
        });
}

//TODO: FURTHER TESTING WITH SERVER DATA AND CHANGE TO FINAL VERSION
function loadServerData(ConnectivityMonitor)
{
  document.addEventListener('deviceready', function() {
    if (ConnectivityMonitor.isOnline()) {

      //LOAD DATA FROM EACH SOURCE
      var dataSet = null;
      var tempData = [];

      //CENTRAL WEATHER BUREAU DATA
      dataSet = 'cwb';
      alert("at right before post");
      $.post( "http://mospc.cook.as.ntu.edu.tw/getspecdata.php", {label : dataSet}, function( data ) {
        alert(data);
        tempData = JSON.parse(data);

        alert(tempData);

        tempData = filterCwbData(tempData);
        alert(tempData[0]);

        if (cwbServerData != []) {
          oldCwbServerData = cwbServerData;
        }
        cwbServerData = tempData;
      });
      alert("at right after post");

      //TODO: REPLACE null WITH NEXT DATA SET NAME
      //dataSet = null;

      //*OTHER DATA

    } else {
      throw "noInternet";
    }
  }, false);

  //NOTE FOR BROWSER TESTING
  //TODO: REMOVE THIS
  // dataSet = 'cwb';
  // $.post( "http://mospc.cook.as.ntu.edu.tw/getspecdata.php", {label : dataSet}, function( data ) {
  //   console.log(data);
  //   tempData = JSON.parse(data);
  //   console.log(tempData);
  // });

}

function filterCwbData(directData)
{
  var arr = [];
  var pointer = 0;
  var lap = 0;
  var name;
  for (var x = 0; x < cwbDataLocations.length; x++) {
    var currPointer = pointer;
    name = cwbDataLocations[x][0];
    var cont = true;
    while (cont) {
      if (pointer == currPointer) lap++;
      if (lap == 2) {
        arr.push([name, cwbDataLocations[x][1], cwbDataLocations[x][2], 'cwb', -1, -1, -1, -1, -1, -1, -1]);
        lap = 0;
        break;
      }
      if (directData[pointer][1] == name) {
        var combinedInfo = [name, cwbDataLocations[x][1], cwbDataLocations[x][2], 'cwb',
          directData[pointer][5], directData[pointer][3], directData[pointer][4], directData[pointer][2],
          directData[pointer][6], -1, directData[pointer][0]];
        arr.push(combinedInfo);
        pointer = currPointer;
        lap = 0;
        cont = false;
      }
      if (pointer == (directData.length - 1)) {
        pointer = 0;
      } else {
        pointer++;
      }
    }
  }
  return arr;
}
