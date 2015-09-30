(function() {
  'use strict';

  angular
    .module('starter')
.controller('BasicController', BasicController);

  BasicController.$inject = ['$scope','$state', 'NavigationService','$ionicPopover'];

  function BasicController($scope, $state, NavigationService, $ionicPopover) {
    var vm = this;
    vm.goTo = goTo;


  $ionicPopover.fromTemplateUrl('templates/company/select-popup.html', {
    scope: $scope,
  }).then(function(popover) {
    $scope.popover = popover;
  });

    function goTo(path) {
      NavigationService.setLocation(path);
    }

   $scope.toUser = {
      _id: '534b8e5aaa5e7afc1b23e69b',
      pic: 'http://ionicframework.com/img/docs/venkman.jpg',
      username: 'Joel Brewer'
    }

    // this could be on $rootScope rather than in $stateParams
    $scope.user = {
      _id: '534b8fb2aa5e7afc1b23e69c',
      pic: 'http://ionicframework.com/img/docs/mcfly.jpg',
      username: 'Cody Fedell'
    };

    $scope.input = {
      message: localStorage['userMessage-' + $scope.toUser._id] || ''
    };

    $scope.messages = getMockMessages();

function getMockMessages() {
  return [{"_id":"535d625f898df4e80e2a125e","text":"Gym Fed has changed the game for hybrid app development.","userId":"534b8fb2aa5e7afc1b23e69c","date":"2014-04-27T20:02:39.082Z","read":true,"readDate":"2014-12-01T06:27:37.944Z"},{"_id":"535f13ffee3b2a68112b9fc0","text":"I like Gym Fed better than ice cream!","userId":"534b8e5aaa5e7afc1b23e69b","date":"2014-04-29T02:52:47.706Z","read":true,"readDate":"2014-12-01T06:27:37.944Z"},{"_id":"546a5843fd4c5d581efa263a","text":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.","userId":"534b8fb2aa5e7afc1b23e69c","date":"2014-11-17T20:19:15.289Z","read":true,"readDate":"2014-12-01T06:27:38.328Z"},{"_id":"54764399ab43d1d4113abfd1","text":"Am I dreaming?","userId":"534b8e5aaa5e7afc1b23e69b","date":"2014-11-26T21:18:17.591Z","read":true,"readDate":"2014-12-01T06:27:38.337Z"},{"_id":"547643aeab43d1d4113abfd2","text":"Is this magic?","userId":"534b8fb2aa5e7afc1b23e69c","date":"2014-11-26T21:18:38.549Z","read":true,"readDate":"2014-12-01T06:27:38.338Z"},{"_id":"547815dbab43d1d4113abfef","text":"Gee wiz, this is something special.","userId":"534b8e5aaa5e7afc1b23e69b","date":"2014-11-28T06:27:40.001Z","read":true,"readDate":"2014-12-01T06:27:38.338Z"},{"_id":"54781c69ab43d1d4113abff0","text":"I think I like Gym Fed more than I like ice cream!","userId":"534b8fb2aa5e7afc1b23e69c","date":"2014-11-28T06:55:37.350Z","read":true,"readDate":"2014-12-01T06:27:38.338Z"},{"_id":"54781ca4ab43d1d4113abff1","text":"Yea, it's pretty sweet","userId":"534b8e5aaa5e7afc1b23e69b","date":"2014-11-28T06:56:36.472Z","read":true,"readDate":"2014-12-01T06:27:38.338Z"},{"_id":"5478df86ab43d1d4113abff4","text":"Wow, this is really something huh?","userId":"534b8fb2aa5e7afc1b23e69c","date":"2014-11-28T20:48:06.572Z","read":true,"readDate":"2014-12-01T06:27:38.339Z"},{"_id":"54781ca4ab43d1d4113abff1","text":"Create amazing apps - brewerdigital.com","userId":"534b8e5aaa5e7afc1b23e69b","date":"2014-11-29T06:56:36.472Z","read":true,"readDate":"2014-12-01T06:27:38.338Z"}];
}







  }

})();

(function() {
  'use strict';

  angular
    .module('starter')
.controller('RegistrationController', RegistrationController);

  RegistrationController.$inject = ['Config','AuthenticationService', '$state'];

  function RegistrationController(Config, AuthenticationService, $state) {
    var vm = this;
    vm.loginUser = loginUser;

    var testCredentials = {
      email: "joelbrewer01@gmail.com",
      password: "secretsauce"
    }

    vm.credentials = {
      email: "",
      password: ""
    }

    if (Config.environment === 'test') {
      vm.credentials = testCredentials;
    }

    function loginUser() {
      AuthenticationService.login(vm.credentials)
        .then(function (response) {
          if (response.status == 200) {
            $state.go('customer');
          } else {
            alert("error logging in");
          }
        });
    }
  }
})();
