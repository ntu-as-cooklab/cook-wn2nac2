// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic', 'controllers', 'services', 'ngCordova','pascalprecht.translate']);

app
.run(function($ionicPlatform, $translate) {
  $ionicPlatform.ready(function() {
    if(window.localStorage.getItem("LANG")==null){
        if(typeof navigator.globalization !== "undefined") {
            navigator.globalization.getPreferredLanguage(function(language) {
                $translate.use((language.value).split("-")[0]).then(function(data) {
                    window.localStorage.setItem("LANG",data);
                    console.log("SUCCESS -> " + data);
                }, function(error) {
                    console.log("ERROR -> " + error);
                });
            }, null);
        }
    }

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

    if(typeof window.ga !== undefined) {
        window.ga.startTrackerWithId('UA-84804118-2');
        window.ga.trackView('Open APP');
        console.log("Google Analytics Launch!");
    } else {
        console.log("Google Analytics Unavailable");
    }

  });

})
.config(function($ionicConfigProvider) {
    $ionicConfigProvider.scrolling.jsScrolling(true);
})

.config(function($stateProvider, $urlRouterProvider, $translateProvider) {
    //language part
    $translateProvider.translations('en', _lang_en);
    $translateProvider.translations('zh', _lang_zh);
    if(window.localStorage.getItem("LANG")){
        $translateProvider.preferredLanguage(window.localStorage.getItem("LANG"));
    }else{
        $translateProvider.preferredLanguage('zh')
    }
    $translateProvider.fallbackLanguage("en");

    //let tutorial default on
    window.localStorage.setItem("tutorialCB",'on');
    //See If Logged In?
    if(window.localStorage.getItem("isLogIn") == null){
        window.localStorage.setItem("isLogIn", false);
    };
    var thisPageA = window.localStorage.getItem("isLogIn")=='false'?'templates/user_view.html':'templates/user_info.html';
    var thisPageB = window.localStorage.getItem("isLogIn")=='true'?'templates/user_view.html':'templates/user_info.html';

    //For choose user page. A=> user_view in #/tab/user; b=> user_view in #/tab/userB
    glb.AB =  window.localStorage.getItem("isLogIn")=='false'? 'A':'B';

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
      url: '/windoo',
      views: {
        'windoo-view' : {
          templateUrl: 'templates/windoo_view.html',
          controller: 'WindooViewController'
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
          templateUrl: thisPageA,
          controller: 'UserViewController'
        }
      }
    })

    .state('signUp',{
        url: '/signUp',
        templateUrl: 'templates/user_signup.html',
        controller: 'UserSingUpController'
    })

    .state('signUpCheck',{
        url: '/signUpCheck',
        templateUrl: 'templates/user_signupcheck.html',
        controller: 'UserSingUpCheckController'
    })

    .state('tabs.userInfo',{
        url: '/userB',
        views: {
          'user-view' : {
            templateUrl: thisPageB,
            controller: 'UserInfoController'
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

//ADD NETWORK HANDLING LATER
.controller('MapViewController', function($scope, $ionicLoading, $compile) {

  $scope.$on('$ionicView.enter', function() {
    glb.inMeasureView = false;
    window.ga.trackView('Map View', '', true);
  });

})

.controller('WindooViewController', function($scope, $ionicLoading, $compile) {

  $scope.$on('$ionicView.enter', function() {
      glb.inMeasureView = false;
      glbsens.windooObservation = new WindooObservation();
      glbsens.windooObservation.enable();
      glbsens.currentMeasurement = new WindooMeasurement();
      drawAllChart();
      window.ga.trackView('Windoo View', '', true);
  });
})

.controller('MeasureViewController', function($scope, $ionicLoading, $compile) {

  measure_main();

  $scope.$on('$ionicView.enter', function() {
    glb.inMeasureView = true;
    setWeatherChecks(false, false, true);
    onTempEquilStatusChanged(0);
    onHumdEquilStatusChanged(0);
    checkEqm();
    window.ga.trackView('Measure View', '', true);
  });
})

.controller('SettingsViewController', function($scope, $ionicLoading, $compile, ConnectivityMonitor) {

  $scope.$on('$ionicView.enter', function() {
    glb.inMeasureView = false;
    window.ga.trackView('Setting View', '', true);
  });
})

.controller('UserViewController', function($scope, $ionicLoading, $compile) {

  $scope.$on('$ionicView.enter', function() {
    glb.inMeasureView = false;
    window.ga.trackView('User View', '', true);
  });
})

//Sing Up Page
.controller('UserSingUpController', function($scope, $ionicLoading, $compile) {
    glb.inMeasureView = false;
})
//Sign Up Check Page
.controller('UserSingUpCheckController', function($scope, $ionicLoading, $compile) {
    glb.inMeasureView = false;
})

//After Log In -- User Info Page
.controller('UserInfoController', function($scope, $ionicLoading, $compile) {
  $scope.$on('$ionicView.enter', function() {
    glb.inMeasureView = false;
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
        glb.userid = $scope.userid;
        checkID(signUpInfo);  // check if the ID and email are used, and do the next step
    };
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

// control the page of information
.controller('infoCtrl',function($scope, $interval){
    // dirty update NEED FIXED
    $scope.userid= window.localStorage.getItem("userid");
    $scope.username= window.localStorage.getItem("username");
    $scope.email= window.localStorage.getItem("email");
    $scope.record=  window.localStorage.getItem("record");
    $interval(function() {
        $scope.userid= window.localStorage.getItem("userid");
        $scope.username= window.localStorage.getItem("username");
        $scope.email= window.localStorage.getItem("email");
        $scope.record=  window.localStorage.getItem("record");
    }, 1000);
})

.controller('MainCtrl',function($scope, $ionicScrollDelegate){
    $scope.$ionicScrollDelegate.freezeAllScrolls(true);
    $scope.$ionicScrollDelegate.getScrollView().__enableScrollY = false;
})

.controller('MapCtrl',function($scope, $state, $cordovaGeolocation){
    getCWBforecast();
})

.controller('setCtrl', function($scope, $ionicModal, $translate) {
    // tutorial checkbox
    $scope.tutorialCB = {
        checked: true
    };
    $scope.tutorialCBChange = function() {
        console.log('tutorialCB Change', $scope.tutorialCB.checked);
        if($scope.tutorialCB.checked)
            window.localStorage.setItem("tutorialCB",'on');
        else
            window.localStorage.setItem("tutorialCB",'off');
    };
    //language
    $scope.langs = [{name: "中文", val: "zh", info: "請關閉程式重新開啟"}, {name: "English", val: "en", info: "Please shut down the app and restart it."}];
    $scope.update = function(e) {
        window.localStorage.setItem("LANG", e.val);
        $translate.use(e.val);
        alert(e.info);
    }
    //modals
    $ionicModal.fromTemplateUrl('templates/contactUsModal.html', {
        scope: $scope
    }).then(function(contact_modal) {
        $scope.contact_modal = contact_modal;
    });
    $ionicModal.fromTemplateUrl('templates/AboutModal.html', {
        scope: $scope
    }).then(function(about_modal) {
        $scope.about_modal = about_modal;
    });
})
;
