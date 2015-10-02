(function() {
  'use strict';

  angular
    .module('starter')
    .config(Routes);

  Routes.$inject = ['$stateProvider', '$urlRouterProvider'];

  function Routes($stateProvider, $urlRouterProvider, DataService) {

  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    data: {
      authenticate: false
    }
  })
  .state('customer', {
    url: '/customer',
    templateUrl: 'templates/customer/feed.html',
    controller: 'BasicController as vm'
  })
  .state('customer-profile', {
    url: '/customer/profile',
    templateUrl: 'templates/customer/profile.html',
    controller: 'BasicController as vm'
  })
  .state('customer-chat', {
    url: '/customer/chat',
    templateUrl: 'templates/customer/chat.html',
    controller: 'BasicController as vm'
  })
    .state('tab', {
    url: '/company',
    abstract: true,
    templateUrl: 'templates/company/tabs.html',
    controller: 'BasicController as vm'
  })                
  .state('tab.profile', {
    url: '/profile',
    views: {
      'tab-profile' : {
         templateUrl: 'templates/company/profile.html',
         controller: 'BasicController as vm'
      }
    }
  })
  .state('tab.bulletins', {
    url: '/bulletins',
    views: {
      'tab-bulletins' : {
         templateUrl: 'templates/company/bulletins.html',
         controller: 'BasicController as vm'
      }
    }
  })
  .state('tab.users', {
    url: '/users',
    views: {
      'tab-users' : {
         templateUrl: 'templates/company/users.html',
         controller: 'BasicController as vm'
      }
    }
  })
  .state('tab.feed', {
    url: '/feed',
    views: {
      'tab-feed' : {
        templateUrl: 'templates/company/feed.html',
        controller: 'BasicController as vm'
      }
    }
  })
  .state('company-chat', {
    url: '/company/chat',
    templateUrl: 'templates/company/chat.html',
    controller: 'BasicController as vm'
  })
  .state('company-bulletin-add', {
    url: '/company/bulletin/add',
    templateUrl: 'templates/company/bulletin-add.html',
    controller: 'BasicController as vm'
  })
  .state('company-user-add', {
    url: '/company/user/add',
    templateUrl: 'templates/company/user-add.html',
    controller: 'BasicController as vm'
  })
;

  $urlRouterProvider.otherwise('/login');

  }

})();


