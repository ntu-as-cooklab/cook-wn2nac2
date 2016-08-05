var lastMeasurement;
var listenersActive = false;

function sendMeasurement()
{
    $.post( "http://mospc.cook.as.ntu.edu.tw/post4.php", JSON.parse(JSON.stringify(glbsens.currentMeasurement)),
        function( data ) {
            console.log(data);
        });
}

var lastMeasurement;

function getLastMeasurement()
{
    $.get( "http://mospc.cook.as.ntu.edu.tw/getlast.php", null, function( data ) {
  lastMeasurement = JSON.parse(data);
  console.log(lastMeasurement);
});
}

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
        // tempData = JSON.parse(data);
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
