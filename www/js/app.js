// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova','chart.js'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    initSensor();

  });

})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('tabs', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html'
    })
    .state('tabs.home', {
      url: '/home',
      views: {
        'home-view' : {
          templateUrl: 'templates/home_view.html',
          controller: 'HomeViewController'
        }
      }
    })
    .state('tabs.weather', {
      url: '/weather',
      views: {
        'weather-view' : {
          templateUrl: 'templates/weather_view.html',
          controller: 'WeatherViewController'
        }
      }
    })
    .state('tabs.measure', {
      url: '/measure',
      views: {
        'measure-view' : {
          templateUrl: 'templates/measure_view_2.html',
          controller: 'MeasureViewController'
        }
      }
    })
    .state('tabs.settings', {
      url: '/settings',
      views: {
        'settings-view' : {
          templateUrl: 'templates/settings_view.html',
          controller: 'SettingsViewController'
        }
      }
    })
    .state('tabs.user', {
      url: '/user',
      views: {
        'user-view' : {
          templateUrl: 'templates/user_view.html',
          controller: 'UserViewController'
        }
      }
    })
  $urlRouterProvider.otherwise('/tab/home');
})

.factory('ConnectivityMonitor', function($rootScope, $cordovaNetwork){
  return {
    isOnline: function() {
      if (ionic.Platform.isWebView()) {
        return $cordovaNetwork.isOnline();
      } else {
       return navigator.onLine;
     }
    },
    isOffline: function() {
      if (ionic.Platform.isWebView()) {
        return !$cordovaNetwork.isOnline();
      } else {
        return !navigator.onLine;
      }
    }
  }
})

.factory('GoogleMaps', function ($rootScope, $ionicLoading, $cordovaNetwork, ConnectivityMonitor) {
  var baseMap = null;

  function initMap()
  {
    var LatLng = new google.maps.LatLng(25.015, 121.539);
    navigator.geolocation.getCurrentPosition(function(pos) {
      LatLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
    }, function(error) {
      alert('Unable to get location: ' + error.message);
    });

    var mapOptions = {
      center: LatLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoomControl: true,
      streetViewControl: false
    };

    baseMap = new google.maps.Map(document.getElementById("map"), mapOptions);

    google.maps.event.addListenerOnce(baseMap, 'idle', function() {
      var marker = new google.maps.Marker({
        map: baseMap,
        animation: google.maps.Animation.DROP,
        position: LatLng
      });

      var infoWindow = new google.maps.InfoWindow({
        content: "Current Position"
      });

      google.maps.event.addListener(marker, 'click', function() {
        infoWindow.open(baseMap, marker);
      })

      enableMap();
    });
  }

  function enableMap()
  {
    $ionicLoading.hide();
    mapSetup();
  }

  function disableMap()
  {
    $ionicLoading.show({
      template: "You must be connected to the Internet to view the map."
    });
  }

  function loadGoogleMaps()
  {
    $ionicLoading.show({
      template: "Loading Google Maps"
    });

    window.mapInit = function() {
      initMap();
    }

    var script = document.createElement("script");
    script.type = "text/javascript";
    script.id = "googleMaps";
    script.src = "http://maps.google.com/maps/api/js?callback=mapInit";
    document.body.appendChild(script);
  }

  function checkLoaded()
  {
    if (typeof google == "undefined" || typeof google.maps == "undefined") {
      loadGoogleMaps();
    } else {
      enableMap();
    }
  }

  function addConnectivityListeners()
  {
    if (ionic.Platform.isWebView()) {
      $rootScope.$on('$cordovaNetwork:online', function(event, networkState) {
        checkLoaded();
      });
      $rootScope.$on('$cordovaNetwork:offline', function(event, networkState) {
        disableMap();
      });
    } else {
      window.addEventListener('online', function() {
        checkLoaded();
      }, false);
      window.addEventListener('offline', function() {
        disableMap();
      }, false);
    }
  }

  function mapSetup()
  {
    glb.markerCluster = new MarkerClusterer(baseMap, glb.clusterOptions);

    setMap(baseMap);

    //TEMPORARY
    for(var x = 0; x < glb.markers.length; x++) {
      addMarker(glb.markers[x]);
    }
  }

  return {
    init: function() {
      if (typeof google == "undefined" || typeof google.maps == "undefined") {
        console.warn("Google Maps SDK needs to be loaded.");

        disableMap();
      }

      if (window.cordova) {
        document.addEventListener('deviceready', function() {
          if (ConnectivityMonitor.isOnline()) {
            loadGoogleMaps();
          } else {
            if (ConnectivityMonitor.isOnline()) {
              initMap();
              enableMap();
            } else {
              disableMap();
            }
          }
        }, false);
      } else {
        loadGoogleMaps();
      }

      addConnectivityListeners();
    }
  }
})

//ADD NETWORK HANDLING LATER
.controller('HomeViewController', function($rootScope, $scope, $ionicLoading, $cordovaNetwork, $compile, GoogleMaps, ConnectivityMonitor) {

  GoogleMaps.init();

  $scope.centerOnMe = function() {
    if(!glb.mapRef) {
      return;
    }

    navigator.geolocation.getCurrentPosition(function(pos) {
      glb.mapRef.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      glb.mapRef.setZoom(15);
    }, function(error) {
      alert('Unable to get location: ' + error.message);
    });
  };

  if (ionic.Platform.isWebView()) {
    $rootScope.$on('$cordovaNetwork:online', function(event, networkState) {
      glb.loadDataSucc = true;
    });
    $rootScope.$on('$cordovaNetwork:offline', function(event, networkState) {
      glb.loadDataSucc = false;
    });
  } else {
    window.addEventListener('online', function() {
      glb.loadDataSucc = true;
    }, false);
    window.addEventListener('offline', function() {
      glb.loadDataSucc = false;
    }, false);
  }

  try {
    loadServerData(ConnectivityMonitor);
    glb.loadDataSucc = true;
  } catch(err) {
    if (err == "noInternet") {
      alert("Not connected to Internet, data loading failed. Please retry from Settings tab under 'Import Data From:'.");
    } else {
      alert("An error occurred. Data not loaded.");
    }
    glb.loadDataSucc = false;
  }

  home_weather_main();

  $scope.$on('$ionicView.enter', function() {
    setWeatherChecks(true, false, false);
    loadBufferedHistory();
  });
})

.controller('WeatherViewController', function($scope, $ionicLoading, $compile) {

  // //TEST
  // sendSpoofMeasurements(50);

  weather_main();

  $scope.$on('$ionicView.enter', function() {
    setWeatherChecks(false, true, false);
    helperInitGraphs();
  });
})

.controller('MeasureViewController', function($scope, $ionicLoading, $compile) {

  measure_main();

  $scope.$on('$ionicView.enter', function() {
    setWeatherChecks(false, false, true);
  });
})

.controller('SettingsViewController', function($scope, $ionicLoading, $compile, ConnectivityMonitor) {

  settings_main(ConnectivityMonitor);

})

.controller('UserViewController', function($scope, $ionicLoading, $compile) {
});
