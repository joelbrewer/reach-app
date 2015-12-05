(function() {
  'use strict';

  angular
    .module('starter')
    .constant('API', {
      //url: 'http://52.27.2.199/reach'
      //url: 'https://reachapp.ngrok.io'
      //url: 'http://dev1.reachplatform.io'
      url: 'http://dev1.reachplatform.io/reach'
    })
    .constant('Config', {
      environment: 'test'
    });

})();

