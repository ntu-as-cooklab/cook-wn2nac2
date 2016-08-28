// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'controllers', 'services', 'ngCordova','chart.js'])

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
          templateUrl: 'templates/map_view.html',
          controller: 'MapViewController'
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
          templateUrl: 'templates/measure_view.html',
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

    .state('tabs.signUp',{
        url: '/signUp',
        views: {
          'user-view' : {
            templateUrl: 'templates/user_signup.html',
            controller: 'UserSingUpController'
          }
        }
    })

    .state('tabs.signUpCheck',{
        url: '/signUpCheck',
        views: {
          'user-view' : {
            templateUrl: 'templates/user_signupcheck.html',
            controller: 'UserSingUpCheckController'
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
    var testMarkers = [
      ['bla', 25.0350836, 121.5343226, 'test1', 0, 0, 0, 0, 0, 0, 0],
      ['bla', 25.1050836, 121.5233226, 'test2', 0, 0, 0, 0, 0, 0, 0],
      ['bla', 25.0750836, 121.5353445, 'test2', 0, 0, 0, 0, 0, 0, 0],
      ['bla', 25.0345836, 121.6353226, 'test1', 0, 0, 0, 0, 0, 0, 0],
      ['bla', 25.0350996, 121.5352226, 'test3', 0, 0, 0, 0, 0, 0, 0],
      ['bla', 25.0351236, 121.5113226, 'test3', 0, 0, 0, 0, 0, 0, 0],
      ['bla', 25.0359836, 121.5399926, 'test3', 0, 0, 0, 0, 0, 0, 0]
    ];

    for(var x = 0; x < testMarkers.length; x++) {
      addAppMarker(testMarkers[x]);
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

  $scope.$on('$ionicView.enter', function() {
    glb.inMeasureView = false;
    // console.log(glb.inMeasureView);
    setWeatherChecks(true, false, false);
    home_weather_main();
    loadBufferedHistory();
  });
})

.controller('WeatherViewController', function($scope, $ionicLoading, $compile) {

  // //TEST
  // sendSpoofMeasurements(50);

  $scope.$on('$ionicView.enter', function() {

    weather_main();

  });
})

.controller('MeasureViewController', function($scope, $ionicLoading, $compile) {

  measure_main();

  $scope.$on('$ionicView.enter', function() {
    glb.inMeasureView = true;
    // console.log(glb.inMeasureView);
    setWeatherChecks(false, false, true);
    onTempEquilStatusChanged(0);
    onHumdEquilStatusChanged(0);
    checkEqm();
  });
})

.controller('SettingsViewController', function($scope, $ionicLoading, $compile, ConnectivityMonitor) {

  settings_main(ConnectivityMonitor);

  $scope.$on('$ionicView.enter', function() {
    glb.inMeasureView = false;
    // console.log(glb.inMeasureView);
  });
})

.controller('UserViewController', function($scope, $ionicLoading, $compile) {

  $scope.$on('$ionicView.enter', function() {
    glb.inMeasureView = false;
    // console.log(glb.inMeasureView);
  });
})

.controller('MapViewController', function($scope, $ionicLoading, $compile) {

  $scope.$on('$ionicView.enter', function() {

      initMaps();
    //   $.getScript("https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&language=zh-TW",
    //     function () {
    //         $.getScript("http://127.0.0.1:8100/weather/asset/a10aafbd28e4681c288b9743dde5ab36.js");
    //     });

    //   <script src="https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&language=zh-TW" language="javascript" type="text/javascript"></script>
    //   <script src="http://127.0.0.1/weather/asset/a10aafbd28e4681c288b9743dde5ab36.js" language="javascript" type="text/javascript"></script>
  });
})

//Sing Up Page
.controller('UserSingUpController', function($scope, $ionicLoading, $compile) {
  $scope.$on('$ionicView.enter', function() {
    glb.inMeasureView = false;
    // console.log(glb.inMeasureView);
  });
})
//Sign Up Check Page
.controller('UserSingUpCheckController', function($scope, $ionicLoading, $compile) {
  $scope.$on('$ionicView.enter', function() {
    glb.inMeasureView = false;
    // console.log(glb.inMeasureView);
  });
})

// control the page of signing up
.controller('signUpFormCtrl',function($scope){
    $scope.userid='';
    $scope.username='';
    $scope.password='';
    $scope.repassword='';
    $scope.email ='';
    //check the password
    $scope.getPattern = function(){
        return $scope.password && $scope.password.replace(/([.*+?^${}()|\[\]\/\\])/g, '\\$1');
    };

    $scope.submitSignUp= function(){
        var signUpInfo = {
            userid: $scope.userid,
            username: $scope.username,
            password: $scope.password,
            repassword: $scope.repassword,
            email: $scope.email
        };
        checkID(signUpInfo);
    };
    // $scope.testInfo= function(){
    //     $scope.userid='tigercosmos';
    //     $scope.username='Liu An Chi';
    //     $scope.password='!qazxsw2';
    //     $scope.repassword='!qazxsw2';
    //     $scope.email ='b04209032@ntu.edu.tw';
    // }
})

// control the page of logging in
.controller('logInFormCtrl',function($scope){
    $scope.userid='';
    $scope.password='';
    $scope.submitLogIn= function(){
        var logInInfo = {
            userid: $scope.userid,
            password: $scope.password
        };
        sendLogInInfo( logInInfo );
    };
})

;
