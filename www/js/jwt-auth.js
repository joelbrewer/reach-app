(function() {
  'use strict';

  angular
    .module('starter')
    .config(function Config($httpProvider, jwtInterceptorProvider) {
      // Please note we're annotating the function so that the $injector works when the file is minified
      jwtInterceptorProvider.tokenGetter = ['SessionService', function(SessionService) {
        return SessionService.get('jwt');
      }];

      $httpProvider.interceptors.push('jwtInterceptor');
    })
})();
