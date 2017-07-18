function getCWBforecast()
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

// Send the measurement data to server 
function sendMeasurement(d){
    $.ajax({
        url: 'http://mospc.cook.as.ntu.edu.tw/post4.php',
        type: 'POST',
        data: JSON.parse(JSON.stringify(d)),
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

function resetSignUp(){
    $.ajax({
        url: 'http://mospc.cook.as.ntu.edu.tw/resetSignUp.php',
        type: 'POST',
        data: {userid: glb.userid},
        success: function(data){
            console.log(data);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("Status: " + textStatus + " Measurement  POST Error: " + errorThrown);
        }
    }).done(function(){
        window.location.href = '#/signUp';
    });
}
