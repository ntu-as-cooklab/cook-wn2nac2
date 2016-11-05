"use strict";

// Status

var tempEquilStatus = 0;
var humdEquilStatus = 0;
var equilStatus     = 0;
var duration        = 60000;

// DOM elements

var temp_equil_status;
var humd_equil_status;

function getGeo(){
    $("#geobtn").disabled = true;
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition, showError,{maximumAge: 100, timeout: 5000, enableHighAccuracy: true});
    }else{
        $("#geoInfo").html("Geolocation is not supported by this device. The measurement is aborded.");
        setTimeout(function(){
            measure_tab_switch('.measure-view-disp-content','#origin_frame');
        }, 2000);
    }
    function showPosition(position){
        $("#geoInfo").html('( '+position.coords.latitude.toFixed(2)+ ", " +
        + position.coords.longitude.toFixed(2) + ')');
        glb.latitude = position.coords.latitude;
        glb.longitude = position.coords.longitude;
        setTimeout(function(){
            measure_tab_switch('.measure-view-disp-content','#wind_frame');
            // Tutorial
            if(window.localStorage.getItem("tutorialCB")=='on'){
                var modal = document.getElementById('windModal');
                modal.style.display = "block";
                $(".close").click(function(){
                    modal.style.display = "none";
                });
            }
        }, 800);
    }
    function showError(error){
        switch(error.code){
            case error.PERMISSION_DENIED:
                $("#geoInfo").html("User denied the request for Geolocation. The measurement is aborded.");
                setTimeout(function(){measure_tab_switch('.measure-view-disp-content','#origin_frame');}, 2000);
                break;
            case error.POSITION_UNAVAILABLE:
                $("#geoInfo").html("Location information is unavailable. The measurement is aborded.");
                setTimeout(function(){measure_tab_switch('.measure-view-disp-content','#origin_frame');}, 2000);
                break;
            case error.TIMEOUT:
                $("#geoInfo").html("The request to get user location timed out. The measurement is aborded.");
                setTimeout(function(){measure_tab_switch('.measure-view-disp-content','#origin_frame');}, 2000);
                break;
            case error.UNKNOWN_ERROR:
                $("#geoInfo").html("An unknown error occurred. The measurement is aborded.");
                setTimeout(function(){measure_tab_switch('.measure-view-disp-content','#origin_frame');}, 2000);
                break;
          }
    }
}

function recordWind(){
    measure_tab_switch('.measure-view-disp-content','#timer_frame_1');
    //tutorial
    if(window.localStorage.getItem("tutorialCB")=='on'){
        var modal2 = document.getElementById('timeModal');
        modal2.style.display = "block";
        $(".close").click(function(){
            modal2.style.display = "none";
        });
    }
}

function startToMeasure(){
    if(window.localStorage.getItem("isLogIn")=='false'||window.localStorage.getItem("userid")=='N/A'){
        if(glb.AB=='A'){
            window.location.href = '#/tab/user';
        }else{
            window.location.href = '#/tab/userB';
        }
    }else if(windooStatus==2 && window.localStorage.getItem("isLogIn")=='true'){
        measure_tab_switch('#origin_frame','#geo_frame');
    }
}

function checkData(){
    glbsens.currentMeasurement.latitude = glb.latitude;
    glbsens.currentMeasurement.longitude = glb.longitude;
    glbsens.currentMeasurement.userId = window.localStorage.getItem("userid");
    var d = new Date();
    var nowDate = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes();
    glbsens.currentMeasurement.date = nowDate;
    sendMeasurement();
    measure_tab_switch('.measure-view-disp-content','#send_frame');
}

function measure_main()
{
    // TODO: improve this hack
    var height = $("#measure-view-container").height() - $("#measure-view-bars").height() - 49; // 49 is tab height
    $("#measure-view-disp").css({ 'height' : height.toString() });

    isHome = false;
    console.log("measure_main")
    measureButton = document.getElementById("start-button");
    timer_status = document.getElementById("timer-status");

    glbsens.windooObservation = new WindooObservation();
    glbsens.windooObservation.enable();

    glbsens.currentMeasurement = new WindooMeasurement();

    $('.ppc-progress-fill').css('transform','rotate('+ 0 +'deg)');
}

function measure_tab_switch(frameName1, frameName2)
{
    var modal = document.getElementById('windModal');
    $(frameName1).css("display","none");
    $(frameName2).css("display","block");
}

var duration;
var weather;

function chooseDuration(element)
{
    duration = element.dataset.duration;
    $(".measure-time-button").removeClass("button-calm");
    element.classList.add("button-calm");
}

function chooseWeather(element, index){
    $(".weather-button").removeClass("button-calm");
    element.classList.add("button-calm");
    glbsens.currentMeasurement.weatherType = index;
    glbsens.currentMeasurement.windDirection = glb.winDir;
    setTimeout(function(){
        measure_tab_switch('#wind_frame','#check_frame');
        $("#avgHumd").html(Math.ceil(glbsens.currentMeasurement.avgHumd)+" %");
        $("#avgPres").html(Math.ceil(glbsens.currentMeasurement.avgPres)+" hPa");
        $("#avgTemp").html(Math.ceil(glbsens.currentMeasurement.avgTemp)+" °C");
        $("#avgWind").html(
            Math.ceil(glbsens.currentMeasurement.avgWind)+" m/s "+
            parseWindDir(glbsens.currentMeasurement.windDirection)
        );
        $("#weather").html(parseWeather(glbsens.currentMeasurement.weatherType));
    },200);
}
