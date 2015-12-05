 Pusher.log = function(message) {
       if (window.console && window.console.log) {
         window.console.log(message);
       }
     };

 //window.pusher_client = new Pusher('95129dfbfbc16ec4a811');
 var pusher_client = new Pusher('95129dfbfbc16ec4a811',{
     authTransport: 'jsonp',
     authEndpoint: 'https://52.27.2.199/reach/pusher/auth'
     //authEndpoint: 'http://192.168.1.2:5000/pusher/auth'
   });

var ReachApp = angular.module('starter',
  ['ionic',
    'ionic.service.core',
    'pusher-angular',
    'angular-jwt'
  ]);

//var ReachApp = angular.module('starter', ['ionic','pusher-angular', 'angularMoment'])

 ReachApp.service('APIInterceptor', function($rootScope, SessionService) {
   var service = this;

   service.request = function(config) {
     return config;
   };

   service.responseError = function(response) {
     if (response.status === 401) {
       $rootScope.$broadcast('unauthorized');
     }
     return response;
   };
 });


ReachApp.run(function($ionicPlatform,$rootScope,$state, SessionService) {

  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });

  $rootScope.$on('unauthorized', function() {
    SessionService.reset();
    $state.go('login');
  });
});

