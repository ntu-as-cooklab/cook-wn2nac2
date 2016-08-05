"use strict";

var connectivityMonitor;
//VARS FOR INCLUDED DATA SETS
var settDataSource;
var settDataSourceIsOpen = false;
var settSourceCwb;
var settSourceCwbUse = false;
//VARS FOR DATA VIEWS
var settShowMax;
var settShowMaxIsOpen = false;
var settMaxWind;
var settMaxTemp;
var settMaxHumd;
var settMaxPres;
var settShowMin;
var settShowMinIsOpen = false;
var settMinWind;
var settMinTemp;
var settMinHumd;
var settMinPres;
var settShowAvg;
var settShowAvgIsOpen = false;
var settAvgWind;
var settAvgTemp;
var settAvgHumd;
var settAvgPres;
var settReloadData;
var settClearGraphs;
var allMaxCheck = false;
var allMinCheck = false;
var allAvgCheck = false;
var toggleSwitches;
var sliderBefores;

function settings_main(ConnectivityMonitor) {
  connectivityMonitor = ConnectivityMonitor;
  //VARS FOR INCLUDED DATA SETS
  settDataSource = document.getElementById("import-data-sett");
  settSourceCwb = document.getElementById("data-source-cwb");
  //VARS FOR DATA VIEWS
  settShowMax = document.getElementById("show-max-sett");
  settMaxWind = document.getElementById("max-wind-check");
  settMaxTemp = document.getElementById("max-temp-check");
  settMaxHumd = document.getElementById("max-humd-check");
  settMaxPres = document.getElementById("max-pres-check");
  settShowMin = document.getElementById("show-min-sett");
  settMinWind = document.getElementById("min-wind-check");
  settMinTemp = document.getElementById("min-temp-check");
  settMinHumd = document.getElementById("min-humd-check");
  settMinPres = document.getElementById("min-pres-check");
  settShowAvg = document.getElementById("show-avg-sett");
  settAvgWind = document.getElementById("avg-wind-check");
  settAvgTemp = document.getElementById("avg-temp-check");
  settAvgHumd = document.getElementById("avg-humd-check");
  settAvgPres = document.getElementById("avg-pres-check");
  settReloadData = document.getElementById("reload-data-sett");
  settClearGraphs = document.getElementById("clear-graphs-sett");
  toggleSwitches = document.getElementsByClassName("toggle-switch");
  sliderBefores = document.getElementsByClassName("slider-before");

  settDataSource.addEventListener('click', function()
  {
    if (settDataSourceIsOpen) {
      document.getElementById("import-data-sett-icon").className = 'sett-button button button-icon icon ion-chevron-left closed';
      settDataSourceIsOpen = false;
    } else {
      document.getElementById("import-data-sett-icon").className = 'sett-button button button-icon icon ion-chevron-left open';
      settDataSourceIsOpen = true;
    }

    document.getElementById("data-source-dropdown").classList.toggle("show-dropdown");
  });

  settShowMax.addEventListener('click', function()
  {
    if (settShowMaxIsOpen) {
      document.getElementById("show-max-sett-icon").className = 'sett-button button button-icon icon ion-chevron-left closed';
      settShowMaxIsOpen = false;
    } else {
      document.getElementById("show-max-sett-icon").className = 'sett-button button button-icon icon ion-chevron-left open';
      settShowMaxIsOpen = true;
    }

    document.getElementById("show-max-dropdown").classList.toggle("show-dropdown");
  });

  settShowMin.addEventListener('click', function()
  {
    if (settShowMinIsOpen) {
      document.getElementById("show-min-sett-icon").className = 'sett-button button button-icon icon ion-chevron-left closed';
      settShowMinIsOpen = false;
    } else {
      document.getElementById("show-min-sett-icon").className = 'sett-button button button-icon icon ion-chevron-left open';
      settShowMinIsOpen = true;
    }

    document.getElementById("show-min-dropdown").classList.toggle("show-dropdown");
  });

  settShowAvg.addEventListener('click', function()
  {
    if (settShowAvgIsOpen) {
      document.getElementById("show-avg-sett-icon").className = 'sett-button button button-icon icon ion-chevron-left closed';
      settShowAvgIsOpen = false;
    } else {
      document.getElementById("show-avg-sett-icon").className = 'sett-button button button-icon icon ion-chevron-left open';
      settShowAvgIsOpen = true;
    }

    document.getElementById("show-avg-dropdown").classList.toggle("show-dropdown");
  });

  settReloadData.addEventListener('click', function()
  {
    try {
      loadServerData(connectivityMonitor);
      glb.loadDataSucc = true;
    } catch(err) {
      if (err == "noInternet") {
        alert("Not connected to Internet, data loading failed.");
      } else {
        alert("An error occurred. Data not loaded.");
      }
      glb.loadDataSucc = false;
    }
  });

  settClearGraphs.addEventListener('click', function()
  {
    clearGraphs();
  });

  manageToggleSwitches();
}

function manageToggleSwitches()
{
  for (var x = 0; x < toggleSwitches.length; x++) {
    (function() {
      var idx = x;
      toggleSwitches[x].addEventListener('click', function() {
        sliderBefores[idx].classList.toggle("slider-after");
      });
    }());
  }

  //LOADING OLD DATA POINTS (IN PLACE OF INCOMPLETE/NULL/ETC. NEW ONES) FUNCTIONALITY POSSIBLY HERE
  settSourceCwb.addEventListener('click', function()
  {
    if (!glb.loadDataSucc) {
      try {
        loadServerData(connectivityMonitor);
        glb.loadDataSucc = true;
      } catch(err) {
        if (err == "noInternet") {
          alert("Not connected to Internet, data loading failed.");
        } else {
          alert("An error occurred. Data not loaded.");
        }
        glb.loadDataSucc = false;
        document.getElementById("source-cwb-check").checked = false;
        document.getElementById("source-cwb-before").classList.remove("slider-after");
        return;
      }
    }

    settSourceCwbUse = !settSourceCwbUse;
    if (settSourceCwbUse) {
      for (var x = 0; x < cwbDataLocations.length; x++) {
        //NOTE USE cwbDataLocations FOR LOCATIONS AND cmbServerData FOR DATA VALUES
        var newMarkerInfo = [glb.markerCounter, cwbDataLocations[x][0], cwbDataLocations[x][1], cwbDataLocations[x][2], 'cwb'];
        glb.markerCounter++;
        glb.markers.push(newMarkerInfo);
        addMarker(newMarkerInfo);
      }
      var selectElem = document.getElementById("map-overlay-select");
      var newOption = document.createElement("option");
      newOption.class = "select-data-option";
      newOption.value = "cwb";
      newOption.text = "Central Weather Bureau";
      selectElem.add(newOption);
    } else {
      for (var x = 0; x < cwbDataLocations.length; x++) {
        removeMarker('cwb');
      }
      var selectElem = document.getElementById("map-overlay-select");
      selectElem.selectedIndex = 0;
      filterMarkers('default');
      for (var y = 0; y < selectElem.length; y++) {
        if (selectElem.options[y].value == "cwb") {
          selectElem.remove(y);
          break;
        }
      }
    }
  });

  //NOTE 0 = WIND SPEED, 1 = TEMPERATURE, 2 = HUMIDITY, 3 = PRESSURE
  document.getElementById("show-max-all-check").addEventListener('click', function()
  {
    allMaxCheck = !allMaxCheck;
    if (allMaxCheck) {
      document.getElementById("max-wind-graph-check").checked = true;
      document.getElementById("max-temp-graph-check").checked = true;
      document.getElementById("max-humd-graph-check").checked = true;
      document.getElementById("max-pres-graph-check").checked = true;
      document.getElementById("max-wind-before").classList.add("slider-after");
      document.getElementById("max-temp-before").classList.add("slider-after");
      document.getElementById("max-humd-before").classList.add("slider-after");
      document.getElementById("max-pres-before").classList.add("slider-after");
      toggleMax(0, true);
      toggleMax(1, true);
      toggleMax(2, true);
      toggleMax(3, true);
    } else {
      document.getElementById("max-wind-graph-check").checked = false;
      document.getElementById("max-temp-graph-check").checked = false;
      document.getElementById("max-humd-graph-check").checked = false;
      document.getElementById("max-pres-graph-check").checked = false;
      document.getElementById("max-wind-before").classList.remove("slider-after");
      document.getElementById("max-temp-before").classList.remove("slider-after");
      document.getElementById("max-humd-before").classList.remove("slider-after");
      document.getElementById("max-pres-before").classList.remove("slider-after");
      toggleMax(0, false);
      toggleMax(1, false);
      toggleMax(2, false);
      toggleMax(3, false);
    }
  });

  document.getElementById("show-min-all-check").addEventListener('click', function()
  {
    allMinCheck = !allMinCheck;
    if (allMinCheck) {
      document.getElementById("min-wind-graph-check").checked = true;
      document.getElementById("min-temp-graph-check").checked = true;
      document.getElementById("min-humd-graph-check").checked = true;
      document.getElementById("min-pres-graph-check").checked = true;
      document.getElementById("min-wind-before").classList.add("slider-after");
      document.getElementById("min-temp-before").classList.add("slider-after");
      document.getElementById("min-humd-before").classList.add("slider-after");
      document.getElementById("min-pres-before").classList.add("slider-after");
      toggleMin(0, true);
      toggleMin(1, true);
      toggleMin(2, true);
      toggleMin(3, true);
    } else {
      document.getElementById("min-wind-graph-check").checked = false;
      document.getElementById("min-temp-graph-check").checked = false;
      document.getElementById("min-humd-graph-check").checked = false;
      document.getElementById("min-pres-graph-check").checked = false;
      document.getElementById("min-wind-before").classList.remove("slider-after");
      document.getElementById("min-temp-before").classList.remove("slider-after");
      document.getElementById("min-humd-before").classList.remove("slider-after");
      document.getElementById("min-pres-before").classList.remove("slider-after");
      toggleMin(0, false);
      toggleMin(1, false);
      toggleMin(2, false);
      toggleMin(3, false);
    }
  });

  document.getElementById("show-avg-all-check").addEventListener('click', function()
  {
    allAvgCheck = !allAvgCheck;
    if (allAvgCheck) {
      document.getElementById("avg-wind-graph-check").checked = true;
      document.getElementById("avg-temp-graph-check").checked = true;
      document.getElementById("avg-humd-graph-check").checked = true;
      document.getElementById("avg-pres-graph-check").checked = true;
      document.getElementById("avg-wind-before").classList.add("slider-after");
      document.getElementById("avg-temp-before").classList.add("slider-after");
      document.getElementById("avg-humd-before").classList.add("slider-after");
      document.getElementById("avg-pres-before").classList.add("slider-after");
      toggleAvg(0, true);
      toggleAvg(1, true);
      toggleAvg(2, true);
      toggleAvg(3, true);
    } else {
      document.getElementById("avg-wind-graph-check").checked = false;
      document.getElementById("avg-temp-graph-check").checked = false;
      document.getElementById("avg-humd-graph-check").checked = false;
      document.getElementById("avg-pres-graph-check").checked = false;
      document.getElementById("avg-wind-before").classList.remove("slider-after");
      document.getElementById("avg-temp-before").classList.remove("slider-after");
      document.getElementById("avg-humd-before").classList.remove("slider-after");
      document.getElementById("avg-pres-before").classList.remove("slider-after");
      toggleAvg(0, false);
      toggleAvg(1, false);
      toggleAvg(2, false);
      toggleAvg(3, false);
    }
  });

  //NOTE 0 = WIND SPEED, 1 = TEMPERATURE, 2 = HUMIDITY, 3 = PRESSURE
  settMaxWind.addEventListener('click', function()
  {
    toggleMax(0);
  });
  settMaxTemp.addEventListener('click', function()
  {
    toggleMax(1);
  });
  settMaxHumd.addEventListener('click', function()
  {
    toggleMax(2);
  });
  settMaxPres.addEventListener('click', function()
  {
    toggleMax(3);
  });

  settMinWind.addEventListener('click', function()
  {
    toggleMin(0);
  });
  settMinTemp.addEventListener('click', function()
  {
    toggleMin(1);
  });
  settMinHumd.addEventListener('click', function()
  {
    toggleMin(2);
  });
  settMinPres.addEventListener('click', function()
  {
    toggleMin(3);
  });

  settAvgWind.addEventListener('click', function()
  {
    toggleAvg(0);
  });
  settAvgTemp.addEventListener('click', function()
  {
    toggleAvg(1);
  });
  settAvgHumd.addEventListener('click', function()
  {
    toggleAvg(2);
  });
  settAvgPres.addEventListener('click', function()
  {
    toggleAvg(3);
  });

}
