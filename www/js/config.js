(function() {
  'use strict';

  angular
    .module('starter')
    .constant('API', {
      //url: 'http://52.27.2.199/reach'
      url: 'https://reachapp.ngrok.io'
    })
    .constant('Config', {
      environment: 'test'
    });

})();

