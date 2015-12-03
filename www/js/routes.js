(function() {
  'use strict';

  angular
    .module('starter')
    .config(Routes);

  Routes.$inject = ['$stateProvider', '$urlRouterProvider'];

  function Routes($stateProvider, $urlRouterProvider) {

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
    cache: false,
    templateUrl: 'templates/customer/feed.html',
    controller: 'CustomerFeedController as vm'
  })
  .state('customer-profile', {
    url: '/customer/profile',
    templateUrl: 'templates/customer/profile.html',
    controller: 'CustomerProfileController as vm'
  })
  .state('customer-chat', {
    url: '/customer/chat/:contact_id/:company_id',
    cache: false,
    templateUrl: 'templates/customer/chat.html',
    controller: 'CustomerChatController as vm'
  })
    .state('tab', {
    url: '/company',
    abstract: true,
    templateUrl: 'templates/company/tabs.html',
    controller: 'CompanyTabsController as vm'
  })                
  .state('tab.profile', {
    url: '/profile',
    cache: false,
    views: {
      'tab-profile' : {
         templateUrl: 'templates/company/profile.html',
         controller: 'CompanyProfileController as vm'
      }
    }
  })
  .state('tab.bulletins', {
    url: '/bulletins',
    cache: false,
    views: {
      'tab-bulletins' : {
         templateUrl: 'templates/company/bulletins.html',
         controller: 'CompanyBulletinController as vm'
      }
    }
  })
  .state('tab.users', {
    url: '/users',
    cache: false,
    views: {
      'tab-users' : {
         templateUrl: 'templates/company/users.html',
         controller: 'CompanyUserController as vm'
      }
    }
  })
  .state('tab.feed', {
    url: '/feed',
    cache: false,
    views: {
      'tab-feed' : {
        templateUrl: 'templates/company/feed.html',
        controller: 'CompanyFeedController as vm'
      }
    }
  })
  .state('company-chat', {
    url: '/company/chat/:contact_id/:company_id',
    templateUrl: 'templates/company/chat.html',
    controller: 'CompanyChatController as vm'
  })
  .state('company-bulletin-add', {
    url: '/company/bulletin/add',
    templateUrl: 'templates/company/bulletin-add.html',
    controller: 'CompanyBulletinAddController as vm'
  })
  .state('company-user-add', {
    url: '/company/user/add',
    templateUrl: 'templates/company/user-add.html',
    controller: 'CompanyUserAddController as vm'
  })
  .state('company-perms', {
    url: '/company/perms/:contact_id/:company_id',
    templateUrl: 'templates/company/perms.html',
    controller: 'CompanyPermsController as vm'
  })
  .state('company-profile-edit', {
    url: '/company/profile/edit',
    templateUrl: 'templates/company/profile-edit.html',
    controller: 'CompanyProfileEditController as vm'
  })
  .state('push-notification', {
    url: '/push-notification',
    templateUrl: 'templates/push-notification-landing.html',
    controller: 'PushNotificationLandingController as vm'
  })
;

  $urlRouterProvider.otherwise('/login');

  }

})();

