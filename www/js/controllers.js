(function() {
  'use strict';

  angular
    .module('starter')
    .controller('CustomerFeedController', CustomerFeedController);

  CustomerFeedController.$inject = [
                              '$scope',
                              'NavigationService',
                              'DataService',
                              'SessionService'
                            ];

  function CustomerFeedController($scope, NavigationService, DataService, SessionService) {

    var vm = this;
    vm.goTo = goTo;

    $scope.uid = SessionService.getJson('uid');

    DataService.getUser($scope.uid).then(function(response){
      $scope.current_user = response;
    });

    $scope.contacts = [];

    DataService.getCustomerFeed($scope.uid).then(function(response){
      //get the contact info
      angular.forEach(response,function(value,key){
        var contact_id;
        //get the user_id that isn't us.
        if(value.recipient_user_id == $scope.uid){
          contact_id = value.from_user_id;
        }else{
          contact_id = value.recipient_user_id;
        }
        response[key].contact_id = contact_id;
        DataService.getUser(contact_id).then(function(response){
          $scope.contacts[contact_id] = response;
        });
      });
      $scope.messages = response;
    }); 

    function goTo(path) {
      NavigationService.setLocation(path);
    }
  }
})();

(function() {
  'use strict';

  angular
    .module('starter')
    .controller('CustomerProfileController', CustomerProfileController);

  CustomerProfileController.$inject = [
                              '$scope',
                              'NavigationService',
                              'DataService',
                              'SessionService'
                            ];

  function CustomerProfileController($scope, NavigationService, DataService, SessionService) {

    var vm = this;
    vm.goTo = goTo;

    $scope.uid = SessionService.getJson('uid');

    DataService.getUser($scope.uid).then(function(response){
      $scope.user = response;
    });

    $scope.update_profile = function update_profile(user) {
      DataService.updateUser(user).then(function(response){
           DataService.getUser($scope.uid).then(function(response){
              $scope.user = response;
           });
      });
    };

    function goTo(path) {
      NavigationService.setLocation(path);
    }
  }
})();

(function() {
  'use strict';

  angular
    .module('starter')
    .controller('CustomerChatController', CustomerChatController);

  CustomerChatController.$inject = [
                              '$scope',
                              'NavigationService',
                              'DataService',
                              'SessionService', 
                              '$stateParams',
                              '$ionicScrollDelegate'
                            ];

  function CustomerChatController($scope, NavigationService, DataService, SessionService, $stateParams, $ionicScrollDelegate) {

    var vm = this;
    vm.goTo = goTo;

    $scope.contact_id = $stateParams.contact_id;

    $scope.uid = SessionService.getJson('uid');

    DataService.getUser($scope.uid).then(function(response){
      $scope.current_user = response;
    });

    DataService.getUser($stateParams.contact_id).then(function(response){
      $scope.user = response;
    });

    DataService.getMessages($stateParams.contact_id).then(function(response){
      $scope.messages = response;
      $ionicScrollDelegate.scrollBottom();
    });

    function goTo(path) {
      NavigationService.setLocation(path);
    }

    $scope.send_chat = function send_chat(chat) {
      DataService.sendMessage(SessionService.getJson('uid'),$scope.contact_id,chat.content).then(function(response){
           DataService.getMessages($stateParams.contact_id).then(function(response){
              $scope.messages = response;
              $ionicScrollDelegate.scrollBottom(true);
           });
      });
      chat.content='';
    };
  }
})();

(function() {
  'use strict';

  angular
    .module('starter')
    .controller('CompanyTabsController', CompanyTabsController);
  CompanyTabsController.$inject = [
                              '$scope',
                              '$ionicPopover', 
                              'SessionService',
                              'DataService',
                              'NavigationService'
                            ];
  function CompanyTabsController($scope, $ionicPopover, SessionService, DataService, NavigationService) {

    var vm = this;
    vm.goTo = goTo;
    
    $scope.NavigationService = NavigationService;

    $scope.role_admin = SessionService.getJson('role_admin');
    $scope.role_employee = SessionService.getJson('role_employee');
    $scope.role_customer = SessionService.getJson('role_customer');

    $scope.selected_company = NavigationService.selected_company;

    $scope.$watch("NavigationService.selected_company",function(newVal, oldVal) {
            $scope.selected_company = NavigationService.selected_company;
            $scope.is_admin = ($scope.role_admin.indexOf(newVal) > -1);
            $scope.is_employee = ($scope.role_employee.indexOf(newVal) > -1);
            $scope.is_customer = ($scope.role_customer.indexOf(newVal) > -1);
    });

    DataService.getCompanies().then(function(response){
      $scope.companies = response;
    }); 

    //selector popup stuff
    //
    $ionicPopover.fromTemplateUrl('templates/company/select-popup.html', {
      scope: $scope,
    }).then(function(popover) {
      $scope.popover = popover;
    });

    $scope.openPopover = function($event) {
      $scope.popover.show($event);
    };
    $scope.closePopover = function() {
      setTimeout($scope.popover.hide(),1000);
    };
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.popover.remove();
    });
    // Execute action on hide popover
    $scope.$on('popover.hidden', function() {
      // Execute action
    });
    // Execute action on remove popover
    $scope.$on('popover.removed', function() {
      // Execute action
    });

    function goTo(path) {
      NavigationService.setLocation(path);
    }

  }
})();

(function() {
  'use strict';

  angular
    .module('starter')
    .controller('CompanyProfileController', CompanyProfileController);
  CompanyProfileController.$inject = [
                              '$scope',
                              'DataService',
                              'NavigationService',
			      'SessionService'
                            ];

  function CompanyProfileController($scope, DataService, NavigationService, SessionService) {

    var vm = this;
    vm.goTo = goTo;

    $scope.NavigationService = NavigationService;
    $scope.role_admin = SessionService.getJson('role_admin');
    $scope.role_employee = SessionService.getJson('role_employee');
    $scope.role_customer = SessionService.getJson('role_customer');
    $scope.selected_company = NavigationService.selected_company;

    $scope.$watch("NavigationService.selected_company",function(newVal, oldVal) {
            $scope.selected_company = NavigationService.selected_company;
            $scope.is_admin = ($scope.role_admin.indexOf(newVal) > -1);
            $scope.is_employee = ($scope.role_employee.indexOf(newVal) > -1);
            $scope.is_customer = ($scope.role_customer.indexOf(newVal) > -1);
    });

    function goTo(path) {
      NavigationService.setLocation(path);
    }
  }
})();

(function() {
  'use strict';

  angular
    .module('starter')
    .controller('CompanyBulletinController', CompanyBulletinController);
  CompanyBulletinController.$inject = [
                              '$scope',
                              'DataService',
                              'NavigationService',
			      'SessionService'
                            ];

  function CompanyBulletinController($scope, DataService, NavigationService, SessionService) {

    var vm = this;
    vm.goTo = goTo;

    $scope.NavigationService = NavigationService;
    $scope.role_admin = SessionService.getJson('role_admin');
    $scope.role_employee = SessionService.getJson('role_employee');
    $scope.role_customer = SessionService.getJson('role_customer');
    $scope.selected_company = NavigationService.selected_company;

    $scope.$watch("NavigationService.selected_company",function(newVal, oldVal) {
            $scope.selected_company = NavigationService.selected_company;
            $scope.is_admin = ($scope.role_admin.indexOf(newVal) > -1);
            $scope.is_employee = ($scope.role_employee.indexOf(newVal) > -1);
            $scope.is_customer = ($scope.role_customer.indexOf(newVal) > -1);
            DataService.getBulletins($scope.selected_company).then(function(response){
              $scope.bulletins = response;
            });
    });




    function goTo(path) {
      NavigationService.setLocation(path);
    }
  }
})();


(function() {
  'use strict';

  angular
    .module('starter')
    .controller('CompanyUserController', CompanyUserController);
  CompanyUserController.$inject = [
                              '$scope',
                              'DataService',
                              'NavigationService',
			      'SessionService'
                            ];

  function CompanyUserController($scope, DataService, NavigationService, SessionService) {

    var vm = this;
    vm.goTo = goTo;

    $scope.NavigationService = NavigationService;
    $scope.role_admin = SessionService.getJson('role_admin');
    $scope.role_employee = SessionService.getJson('role_employee');
    $scope.role_customer = SessionService.getJson('role_customer');
    $scope.selected_company = NavigationService.selected_company;

    $scope.$watch("NavigationService.selected_company",function(newVal, oldVal) {

            $scope.selected_company = NavigationService.selected_company;

            $scope.is_admin = ($scope.role_admin.indexOf(newVal) > -1);
            $scope.is_employee = ($scope.role_employee.indexOf(newVal) > -1);
            $scope.is_customer = ($scope.role_customer.indexOf(newVal) > -1);

            DataService.getEmployees($scope.selected_company).then(function(response){
              $scope.employees = response;
            });

            if($scope.is_employee || $scope.is_admin){
            	DataService.getCustomers($scope.selected_company).then(function(response){
            	  $scope.customers = response;
            	});
            }else{
            	  $scope.customers = {};
            }
    });

    function goTo(path) {
      NavigationService.setLocation(path);
    }
  }
})();

(function() {
  'use strict';

  angular
    .module('starter')
    .controller('CompanyFeedController', CompanyFeedController);
  CompanyFeedController.$inject = [
                              '$scope',
                              'DataService',
                              'NavigationService',
			      'SessionService'
                            ];

  function CompanyFeedController($scope, DataService, NavigationService, SessionService) {

    var vm = this;
    vm.goTo = goTo;

    $scope.NavigationService = NavigationService;
    $scope.role_admin = SessionService.getJson('role_admin');
    $scope.role_employee = SessionService.getJson('role_employee');
    $scope.role_customer = SessionService.getJson('role_customer');
    $scope.selected_company = NavigationService.selected_company;

    $scope.$watch("NavigationService.selected_company",function(newVal, oldVal) {
            $scope.selected_company = NavigationService.selected_company;
            $scope.is_admin = ($scope.role_admin.indexOf(newVal) > -1);
            $scope.is_employee = ($scope.role_employee.indexOf(newVal) > -1);
            $scope.is_customer = ($scope.role_customer.indexOf(newVal) > -1);
    });

    function goTo(path) {
      NavigationService.setLocation(path);
    }
  }
})();


(function() {
  'use strict';

  angular
    .module('starter')
    .controller('CompanyChatController', CompanyChatController);
  CompanyChatController.$inject = [
                              '$scope',
                              'DataService',
                              'NavigationService',
			      'SessionService'
                            ];

  function CompanyChatController($scope, DataService, NavigationService, SessionService) {

    var vm = this;
    vm.goTo = goTo;

    $scope.NavigationService = NavigationService;
    $scope.role_admin = SessionService.getJson('role_admin');
    $scope.role_employee = SessionService.getJson('role_employee');
    $scope.role_customer = SessionService.getJson('role_customer');
    $scope.selected_company = NavigationService.selected_company;

    $scope.$watch("NavigationService.selected_company",function(newVal, oldVal) {
            $scope.selected_company = NavigationService.selected_company;
            $scope.is_admin = ($scope.role_admin.indexOf(newVal) > -1);
            $scope.is_employee = ($scope.role_employee.indexOf(newVal) > -1);
            $scope.is_customer = ($scope.role_customer.indexOf(newVal) > -1);
    });

    function goTo(path) {
      NavigationService.setLocation(path);
    }
  }
})();

(function() {
  'use strict';

  angular
    .module('starter')
    .controller('CompanyBulletinAddController', CompanyBulletinAddController);
  CompanyBulletinAddController.$inject = [
                              '$scope',
                              'DataService',
                              'NavigationService',
			      'SessionService'
                            ];

  function CompanyBulletinAddController($scope, DataService, NavigationService, SessionService) {

    var vm = this;
    vm.goTo = goTo;

    $scope.NavigationService = NavigationService;
    $scope.uid = SessionService.getJson('uid');
    $scope.role_admin = SessionService.getJson('role_admin');
    $scope.role_employee = SessionService.getJson('role_employee');
    $scope.role_customer = SessionService.getJson('role_customer');
    $scope.selected_company = NavigationService.selected_company;

    $scope.$watch("NavigationService.selected_company",function(newVal, oldVal) {
            $scope.selected_company = NavigationService.selected_company;
            $scope.is_admin = ($scope.role_admin.indexOf(newVal) > -1);
            $scope.is_employee = ($scope.role_employee.indexOf(newVal) > -1);
            $scope.is_customer = ($scope.role_customer.indexOf(newVal) > -1);
    });

    $scope.send_bulletin = function send_bulletin(bulletin) {
      bulletin.company_id = $scope.selected_company;
      bulletin.sender_uid = $scope.uid; 
      DataService.sendBulletin(bulletin).then(function(response){
/*           DataService.getMessages($stateParams.contact_id).then(function(response){
              $scope.messages = response;
           });
*/
      });
      bulletin.message_content='';
    };



    function goTo(path) {
      NavigationService.setLocation(path);
    }
  }
})();

(function() {
  'use strict';

  angular
    .module('starter')
    .controller('CompanyUserAddController', CompanyUserAddController);
  CompanyUserAddController.$inject = [
                              '$scope',
                              'DataService',
                              'NavigationService',
			      'SessionService'
                            ];

  function CompanyUserAddController($scope, DataService, NavigationService, SessionService) {

    var vm = this;
    vm.goTo = goTo;

    $scope.NavigationService = NavigationService;
    $scope.role_admin = SessionService.getJson('role_admin');
    $scope.role_employee = SessionService.getJson('role_employee');
    $scope.role_customer = SessionService.getJson('role_customer');
    $scope.selected_company = NavigationService.selected_company;

    $scope.$watch("NavigationService.selected_company",function(newVal, oldVal) {
            $scope.selected_company = NavigationService.selected_company;
            $scope.is_admin = ($scope.role_admin.indexOf(newVal) > -1);
            $scope.is_employee = ($scope.role_employee.indexOf(newVal) > -1);
            $scope.is_customer = ($scope.role_customer.indexOf(newVal) > -1);
    });

    function goTo(path) {
      NavigationService.setLocation(path);
    }
  }
})();

(function() {
  'use strict';

  angular
    .module('starter')
    .controller('RegistrationController', RegistrationController);

  RegistrationController.$inject = ['Config','AuthenticationService', 'SessionService', '$state', 'jwtHelper'];

  function RegistrationController(Config, AuthenticationService, SessionService, $state, jwtHelper) {
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
