var lastMeasurement;
var listenersActive = false;

function getCWBforcast()
{
    glb.CWBDATA;
    $.ajax({
        url: 'http://mospc.cook.as.ntu.edu.tw/getCWBdata.php',
        type: 'POST',
        success: function(data){
            glb.CWBDATA = JSON.parse(data);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log("Status: " + textStatus + " getCWBDATA POST Error: " + errorThrown);
        }
    }).done(function(){
        initMaps(glb.CWBDATA);
    });
}

function getInfo()
{
    $.ajax({
        url: 'http://mospc.cook.as.ntu.edu.tw/getInfo.php',
        type: 'POST',
        data: {userid: window.localStorage.getItem("userid")},
        success: function(res){
            var info = JSON.parse(res);
            //console.log(info);
            window.localStorage.setItem("username", info.username);
            window.localStorage.setItem("email", info.email);
            window.localStorage.setItem("record", info.record);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log("Status: " + textStatus + " GetInfo POST Error: " + errorThrown);
        }
    }).done(function(){
        if(glb.AB=='A'){
            window.location.href = '#/tab/userB';
        }else{
            window.location.href = '#/tab/user';
        }
    });
}

function checkID( res )
{
    var condition = 0; //record the sign up condition
    $.ajax({
        url: 'http://mospc.cook.as.ntu.edu.tw/checkID.php',
        type: 'POST',
        data: {signUpInfo: res}, // signUpInfo
        success: function(data){
            console.log(data);
            condition =  parseInt(data);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log("Status: " + textStatus + " signUpInfo POST Error: " + errorThrown);
        }
    }).done(function(){
        if(condition == 0 ){
            sendSignUpInfo( res );
            window.location.href = '#/signUpCheck';
        }else if(condition == 1){
            $("#showStatus2").html('<p>UserID is Used!</p>');
        }else if(condition == 2){
            $("#showStatus2").html('<p>Email is Used!</p>');
        }else if(condition == 3){
            $("#showStatus2").html('<p>UserID and Email are Used!</p>');
        }
    });
}

function sendLogInInfo( res )
{
    var isLogIn = false;
    $.ajax({
        url: 'http://mospc.cook.as.ntu.edu.tw/logIn.php',
        type: 'POST',
        data: {logInInfo: res}, // signUpInfo
        success: function(data){
            console.log(data);
            var result = parseInt(data);
            if(result){
                 isLogIn = true;
                 console.log('Log In Success');
            }else{
                isLogIn = false;
                console.log('Log In Failed');
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log("Status: " + textStatus + " Log In POST Error: " + errorThrown);
        }
    }).done(function(){
        if(isLogIn){
            window.localStorage.setItem("isLogIn", true);
            window.localStorage.setItem("userid", res.userid);
            getInfo();
        }else{
            $("#showStatus").html('<p>Wrong UserID or Password!</p>');
        }
    });
}

function sendSignUpInfo( res )
{
    // console.log(res);
    $.ajax({
        url: 'http://mospc.cook.as.ntu.edu.tw/signUp.php',
        type: 'POST',
        data: {signUpInfo: res}, // signUpInfo
        success: function(data){
            // console.log( 'Send Sign-Up-Info Post Success');
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log("Status: " + textStatus + " signUpInfo POST Error: " + errorThrown);
        }
    }).done(function(){
        //todo
    });
}

function sendMeasurement(){
    $.ajax({
        url: 'http://mospc.cook.as.ntu.edu.tw/post4.php',
        type: 'POST',
        data: JSON.parse(JSON.stringify(glbsens.currentMeasurement)),
        success: function(data){
            console.log(data);
            window.localStorage.setItem("record", Number(window.localStorage.getItem("record"))+1);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("Status: " + textStatus + " Measurement  POST Error: " + errorThrown);
        }
    }).done(function(){

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
      //alert("at right before post");
      $.post( "http://mospc.cook.as.ntu.edu.tw/getspecdata.php", {label : dataSet}, function( data ) {
        //alert(data);
        tempData = JSON.parse(data);

        //alert(tempData);

        tempData = filterCwbData(tempData);
        //alert(tempData[0]);

        if (cwbServerData != []) {
          oldCwbServerData = cwbServerData;
        }
        cwbServerData = tempData;
      });
      //alert("at right after post");

      //NOTE REPLACE null WITH NEXT DATA SET NAME
      //dataSet = null;

      //*OTHER DATA

    } else {
      throw "noInternet";
    }
  }, false);

  //NOTE FOR BROWSER TESTING
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
