// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'chart.js'])

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
          templateUrl: 'templates/measure_view.html',
          controller: 'MeasureViewController'
        }
      }
    })
    .state('tabs.settings', {
      url: '/settings',
      views: {
        'settings-view' : {
          templateUrl: 'templates/settings_view.html'
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

.controller('HomeViewController', function($scope, $ionicLoading, $compile) {
  var LatLng = new google.maps.LatLng(25.015, 121.539);
  navigator.geolocation.getCurrentPosition(function(pos) {
    LatLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
  }, function(error) {
    alert('Unable to get location: ' + error.message);
  });

  var mapOptions = {
    center: LatLng,
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

  google.maps.event.addListenerOnce($scope.map, 'idle', function() {
    var marker = new google.maps.Marker({
      map: $scope.map,
      animation: google.maps.Animation.DROP,
      position: LatLng
    });

    var infoWindow = new google.maps.InfoWindow({
      content: "Current Position"
    });

    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.open($scope.map, marker);
    })
  });

  $scope.centerOnMe = function() {
    if(!$scope.map) {
      return;
    }

    navigator.geolocation.getCurrentPosition(function(pos) {
      $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      $scope.map.setZoom(15);
    }, function(error) {
      alert('Unable to get location: ' + error.message);
    });
  };

  $scope.$on('$ionicView.enter', function() {
    setIsWeather(false);
  });

  glb.markerCluster = new MarkerClusterer($scope.map, glb.clusterOptions);

  setMap($scope.map);

  //TEMPORARY
  for(var x = 0; x < glb.markers.length; x++) {
    addMarker(glb.markers[x]);
  }

  home_weather_main();
})

.controller('WeatherViewController', function($scope, $ionicLoading, $compile) {

  helperInitGraphs();

  weather_main();

  $scope.$on('$ionicView.enter', function() {
    setIsWeather(true);
    setGraphSizes();
    initGraphs();
  });
})

.controller('MeasureViewController', function($scope, $ionicLoading, $compile) {
  measure_main();
})

.controller('UserViewController', function($scope, $ionicLoading, $compile) {
});
