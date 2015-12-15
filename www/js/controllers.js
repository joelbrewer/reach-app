(function() {
  'use strict';

  angular
    .module('starter')
    .controller('CustomerFeedController', CustomerFeedController);

  CustomerFeedController.$inject = [
                              '$scope',
                              '$pusher',
                              '$state',
                              'NavigationService',
                              'DataService',
                              'SessionService',
                              '$ionicSlideBoxDelegate',
                              '$ionicHistory',
                              '$ionicViewSwitcher',
                              'API'
                            ];

  function CustomerFeedController($scope, $pusher, $state, NavigationService, DataService, SessionService, $ionicSlideBoxDelegate,
      $ionicHistory,$ionicViewSwitcher, API) {

    var vm = this;
    vm.goTo = goTo;
    vm.api = API.url;

    refresh_data();

    function refresh_data(){
      $scope.uid = SessionService.getJson('uid');
      $scope.contacts = [];
      $scope.companies = [];

      DataService.getUser($scope.uid).then(function(response){
        $scope.current_user = response;
      });
      DataService.getCustomerFeed().then(function(response){
        //get the contact info
        angular.forEach(response,function(value,key){

          DataService.getCompany(value.company_id).then(function(response2){
            $scope.companies[value.company_id] = response2;
          });

          var contact_id;
          //get the user_id that isn't us.
          if(value.type == 'message'){

            if(value.recipient_user_id == $scope.uid){
              contact_id = value.from_user_id;
            }else{
              contact_id = value.recipient_user_id;
            }
            response[key].contact_id = contact_id;
            DataService.getUser(contact_id).then(function(response){
              $scope.contacts[contact_id] = response;
            });
          }else{

          }
        });
        $scope.messages = response;
      });
    }

    var pusher = $pusher(pusher_client);
    var channel = pusher.subscribe('my_channel'+$scope.uid);
    channel.bind('my_event', function(data) {
      refresh_data();
    });

    $scope.doRefresh = function() {
         refresh_data();
         $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.goToBulletin = function(company_id) {
      NavigationService.selected_company = company_id;
      $state.go('tab.bulletins');
    };

    function goTo(path) {
      console.log("goTo(" + path + ")");
      //NavigationService.setLocation(path);
      $ionicViewSwitcher.nextDirection('forward'); // 'forward', 'back', etc.
      $ionicHistory.nextViewOptions({
        disableAnimate: false,
        disableBack: true
      });
      //$state.go("tab.profile");
      $state.go(path);
    }

/*

    $scope.data = {
      numViewableSlides : 0,
      slideIndex : 0,
      initialInstruction : true,
      secondInstruction : false,
      slides : [
        {
          'template' : 'firstSlide.html',
          'viewable' : true
        },

        {
          'template' : 'bonusSlide.html',
          'viewable' : false
        },

        {
          'template' : 'secondSlide.html',
          'viewable' : true
        },

        {
          'template' : 'thirdSlide.html',
          'viewable' : true
        }
      ]
    };

    var countSlides = function() {
      $scope.data.numViewableSlides = 0;

      _.forEach($scope.data.slides, function(slide) {
        if(slide.viewable === true) $scope.data.numViewableSlides++;
      })

      console.log($scope.data.numViewableSlides + " viewable slides");

    }

    countSlides();

    // Called to navigate to the main app

    $scope.startApp = function() {
      console.log('startApp()');
      $state.go('main');
    };

    $scope.next = function() {
      console.log("next");
      $ionicSlideBoxDelegate.next();
    };
    $scope.previous = function() {
      console.log("previous");
      $ionicSlideBoxDelegate.previous();
    };

    $scope.showBonus = function() {
      console.log("showBonus");
      var index = _.findIndex($scope.data.slides, { template : 'bonusSlide.html' });
      $scope.data.slides[index].viewable = true;
      countSlides();
      $scope.data.initialInstruction = false
      $scope.data.secondInstruction = true;

      $ionicSlideBoxDelegate.update();
    };

    // Called each time the slide changes
    $scope.slideChanged = function(index) {
      console.log("slideChanged");
      $scope.data.slideIndex = index;
    };


    //$state.go('main');

*/



  }
})();

(function() {
  'use strict';

  angular
    .module('starter')
    .controller('CustomerProfileController', CustomerProfileController);

  CustomerProfileController.$inject = [
                              '$scope',
                              '$state',
                              '$q',
                              'DataService',
                              'NavigationService',
                              '$cordovaImagePicker',
                              'AuthenticationService',
                              'SessionService',
                              'API'
                            ];

  function CustomerProfileController($scope, $state, $q, DataService, NavigationService, $cordovaImagePicker, AuthenticationService, SessionService, API) {

    var vm = this;
    vm.goTo = goTo;
    vm.pick_photo = pick_photo;

    $scope.pass = {};
    $scope.api = API.url;

    refresh_data();

    function pick_photo() {

      var options = {
        maximumImagesCount: 1,
        width: 512,
        height: 384,
        quality: 80,
        destinationType: Camera.DestinationType.DATA_URL
      };

      $cordovaImagePicker.getPictures(options)
        .then(function (results) {
          for (var i = 0; i < results.length; i++) {
            $scope.user.avatar = results[i];
            console.log(results);
            upload_image(results[i]).then(function() {
              console.log("Uploaded!");
            });
          }
          console.log($scope.user);
        });
    }

    function upload_image(url) {
      var deferred = $q.defer();

      var token = "Bearer " + SessionService.get('jwt');
      var options = new FileUploadOptions();
      options.fileKey = "file";
      options.fileName = url.substr(url.lastIndexOf('/')+1);
      options.mimeType = "image/jpeg";
      options.headers = { 'Authorization': token };

      var params = new Object();
      //params.image_angle = angle;
      params.user_id = $scope.user.id;
      params.image_type = "user_avatar";

      options.params = params;
      console.log(options);

      options.chunkedMode = false;

      var ft = new FileTransfer();

      var win = function(r) {
        console.log("Code = " + r.responseCode);
        console.log("Response = " + r.response);
        console.log("Sent = " + r.bytesSent);
        deferred.resolve();
      }

      var fail = function(error) {
        alert("An error has occurred: Code = " + error.code);
        console.log("upload error source " + error.source);
        console.log("upload error target " + error.target);
        deferred.reject();
      }

      ft.upload(url, API.url + '/upload_image', win, fail, options);
      return deferred.promise;
    }


    function refresh_data(){
      $scope.uid = SessionService.getJson('uid');
      DataService.getUser($scope.uid).then(function(response){
        $scope.user = response;
        if ($scope.user.avatar) {
          $scope.user.avatar = API.url + $scope.user.avatar;
        }
      });
    }

    $scope.update_profile = function update_profile(user,pass) {
      if(pass.pass1 != '' && pass.pass1 == pass.pass2){
        user.update_pass = pass.pass1;
      }else{
        user.update_pass = '0';
      }
      pass.pass1 = '';
      pass.pass2 = '';
      DataService.updateUser(user).then(function(response){
              goTo('/customer');
      });
    };

    $scope.logout = function logout() {
      SessionService.reset();
      $state.go('login');
    };

    $scope.doRefresh = function() {
         refresh_data();
         $scope.$broadcast('scroll.refreshComplete');
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
                              '$pusher',
                              '$ionicScrollDelegate',
                              'API'
                            ];

  function CustomerChatController($scope, NavigationService, DataService, SessionService, $stateParams, $pusher, $ionicScrollDelegate, API) {

    var vm = this;
    vm.goTo = goTo;
    vm.api = API.url;

    refresh_data();

    function refresh_data(){

      $scope.contact_id = $stateParams.contact_id;
      $scope.company_id = $stateParams.company_id;
      $scope.uid = SessionService.getJson('uid');

      DataService.getUser($scope.uid).then(function(response){
        $scope.current_user = response;
      });

      DataService.getUser($stateParams.contact_id).then(function(response){
        $scope.user = response;
      });

      DataService.getCompanies().then(function(response){
        $scope.companies = response;
      });

      DataService.getMessages($stateParams.contact_id,$stateParams.company_id).then(function(response){
        $scope.messages = response;
        $ionicScrollDelegate.scrollBottom();
      });
    }

    var pusher = $pusher(pusher_client);
    var channel = pusher.subscribe('my_channel'+$scope.uid);
    channel.bind('my_event', function(data) {
      DataService.getMessages($stateParams.contact_id,$stateParams.company_id).then(function(response){
        $scope.messages = response;
        $ionicScrollDelegate.scrollBottom();
      });
    });

    $scope.send_chat = function send_chat(chat) {
      DataService.sendMessage(SessionService.getJson('uid'),$scope.company_id,$scope.contact_id,chat.content).then(function(response){
           DataService.getMessages($stateParams.contact_id,$stateParams.company_id).then(function(response){
              $scope.messages = response;
              $ionicScrollDelegate.scrollBottom(true);
           });
      });
      chat.content='';
    };

    $scope.doRefresh = function() {
         refresh_data();
         $scope.$broadcast('scroll.refreshComplete');
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
    $scope.role_super = SessionService.getJson('role_super');

    $scope.selected_company = NavigationService.selected_company;

    $scope.$watch("NavigationService.selected_company",function(newVal, oldVal) {
            $scope.selected_company = NavigationService.selected_company;
            $scope.is_admin = ($scope.role_admin.indexOf(newVal) > -1);
            $scope.is_employee = ($scope.role_employee.indexOf(newVal) > -1);
            $scope.is_customer = ($scope.role_customer.indexOf(newVal) > -1);
            $scope.is_super = ($scope.role_super == 1);
            $scope.role = ($scope.is_admin) ? "Admin" : ($scope.is_employee) ? "Employee" : "Customer";
            if($scope.is_super){
              $scope.role = 'Super Admin';
            }
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

    $scope.doRefresh = function() {
         refresh_data();
         $scope.$broadcast('scroll.refreshComplete');
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
    .controller('CompanyProfileController', CompanyProfileController);
  CompanyProfileController.$inject = [
                              '$scope',
                              '$state',
                              'DataService',
                              'NavigationService',
			                        'SessionService',
                              '$ionicHistory',
                              '$ionicViewSwitcher',
                              'API',
                            ];

  function CompanyProfileController($scope, $state, DataService, 
      NavigationService, SessionService, $ionicHistory, $ionicViewSwitcher,
      API) {


    var vm = this;
    vm.goTo = goTo;

    refresh_data();


    function refresh_data(){

      $scope.NavigationService = NavigationService;
      $scope.selected_company = NavigationService.selected_company;
      $scope.role_admin = SessionService.getJson('role_admin');
      $scope.role_employee = SessionService.getJson('role_employee');
      $scope.role_customer = SessionService.getJson('role_customer');
      $scope.role_super = SessionService.getJson('role_super');
      DataService.getCompanies().then(function(response){
        $scope.companies = response;
        if ($scope.companies[$scope.selected_company].logo) {
          $scope.companies[$scope.selected_company].logo = API.url + $scope.companies[$scope.selected_company].logo;
        }
      });
    }

    $scope.$watch("NavigationService.selected_company",function(newVal, oldVal) {
      refresh_data();
    });

    $scope.doRefresh = function() {
         refresh_data();
         $scope.$broadcast('scroll.refreshComplete');
    };

    function goTo(path) {
      //NavigationService.setLocation(path);
      console.log("CompanyProfileController : goTo(" + path + ")");
      //NavigationService.setLocation(path);
      $ionicViewSwitcher.nextDirection('back'); // 'forward', 'back', etc.
      $ionicHistory.nextViewOptions({
        disableAnimate: false,
        disableBack: true
      });
      $state.go(path);
    }
  }
})();

(function() {
  'use strict';

  angular
    .module('starter')
    .controller('CompanyProfileEditController', CompanyProfileEditController);
  
  CompanyProfileEditController.$inject = [
                              '$scope',
                              '$q',
                              'DataService',
                              'NavigationService',
                              '$cordovaImagePicker',
                              'AuthenticationService',
                              'SessionService',
                              'API'
                            ];

  function CompanyProfileEditController($scope, $q, DataService, NavigationService,
      $cordovaImagePicker, AuthenticationService, SessionService, API) {

    var vm = this;
    vm.goTo = goTo;
    vm.pick_photo = pick_photo;

    refresh_data();

    function pick_photo() {

      var options = {
        maximumImagesCount: 1,
        width: 512,
        height: 384,
        quality: 80,
        destinationType: Camera.DestinationType.DATA_URL
      };

      $cordovaImagePicker.getPictures(options)
        .then(function (results) {
          for (var i = 0; i < results.length; i++) {
            $scope.company.logo = results[i];
            console.log(results);
            upload_image(results[i]).then(function() {
              console.log("Uploaded!");
            });
          }
          console.log($scope.user);
        });
    }

    function upload_image(url) {
      var deferred = $q.defer();

      var token = "Bearer " + SessionService.get('jwt');
      var options = new FileUploadOptions();
      options.fileKey = "file";
      options.fileName = url.substr(url.lastIndexOf('/')+1);
      options.mimeType = "image/jpeg";
      options.headers = { 'Authorization': token };

      var params = new Object();
      params.company_id = $scope.selected_company;
      params.image_type = "company_logo";

      options.params = params;
      console.log(options);

      options.chunkedMode = false;

      var ft = new FileTransfer();

      var win = function(r) {
        console.log("Code = " + r.responseCode);
        console.log("Response = " + r.response);
        console.log("Sent = " + r.bytesSent);
        deferred.resolve();
      }

      var fail = function(error) {
        alert("An error has occurred: Code = " + error.code);
        console.log("upload error source " + error.source);
        console.log("upload error target " + error.target);
        deferred.reject();
      }

      ft.upload(url, API.url + '/upload_image', win, fail, options);
      return deferred.promise;
    }

    function refresh_data(){

      $scope.NavigationService = NavigationService;
      $scope.role_admin = SessionService.getJson('role_admin');
      $scope.role_employee = SessionService.getJson('role_employee');
      $scope.role_customer = SessionService.getJson('role_customer');
      $scope.role_super = SessionService.getJson('role_super');
      $scope.selected_company = NavigationService.selected_company;
      DataService.getCompanies().then(function(response){
        $scope.companies = response;
        $scope.company = $scope.companies[$scope.selected_company];
        if ($scope.company.logo) {
          $scope.company.logo = API.url + $scope.company.logo;
        }
      });
    }

    $scope.$watch("NavigationService.selected_company",function(newVal, oldVal) {
            $scope.selected_company = NavigationService.selected_company;
            $scope.is_admin = ($scope.role_admin.indexOf(newVal) > -1);
            $scope.is_employee = ($scope.role_employee.indexOf(newVal) > -1);
            $scope.is_customer = ($scope.role_customer.indexOf(newVal) > -1);
    });

    $scope.update_profile = function update_profile(company) {
      DataService.updateCompany(company).then(function(response){
            goTo('company/profile');
      });
    };

    $scope.doRefresh = function() {
         refresh_data();
         $scope.$broadcast('scroll.refreshComplete');
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
    .controller('CompanyAddController', CompanyAddController);
  CompanyAddController.$inject = [
                              '$scope',
                              'DataService',
                              'NavigationService',
			      'SessionService'
                            ];

  function CompanyAddController($scope, DataService, NavigationService, SessionService) {

    var vm = this;
    vm.goTo = goTo;

    refresh_data();

    function refresh_data(){

      $scope.NavigationService = NavigationService;
      $scope.role_super = SessionService.getJson('role_super');
//bounce if not super @todo
      $scope.selected_company = NavigationService.selected_company;
    }

    $scope.$watch("NavigationService.selected_company",function(newVal, oldVal) {
            $scope.selected_company = NavigationService.selected_company;
    });

    $scope.add_company = function add_company(company) {
      DataService.addCompany(company).then(function(response){
//should probably get the new ID and redirect...
            goTo('company/profile');
      });
    };

    $scope.doRefresh = function() {
         refresh_data();
         $scope.$broadcast('scroll.refreshComplete');
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

    refresh_data();

    function refresh_data(){

      $scope.NavigationService = NavigationService;
      $scope.role_admin = SessionService.getJson('role_admin');
      $scope.role_employee = SessionService.getJson('role_employee');
      $scope.role_customer = SessionService.getJson('role_customer');
      $scope.role_super = SessionService.getJson('role_super');
      $scope.selected_company = NavigationService.selected_company;
      DataService.getBulletins($scope.selected_company).then(function(response){
        $scope.bulletins = response;
      });

    }

    $scope.$watch("NavigationService.selected_company",function(newVal, oldVal) {
            $scope.selected_company = NavigationService.selected_company;
            $scope.is_admin = ($scope.role_admin.indexOf(newVal) > -1);
            $scope.is_employee = ($scope.role_employee.indexOf(newVal) > -1);
            $scope.is_customer = ($scope.role_customer.indexOf(newVal) > -1);
            DataService.getBulletins($scope.selected_company).then(function(response){
              $scope.bulletins = response;
            });
    });

    $scope.doRefresh = function() {
         refresh_data();
         $scope.$broadcast('scroll.refreshComplete');
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
    .controller('CompanyUserController', CompanyUserController);
  CompanyUserController.$inject = [
                              '$scope',
                              'DataService',
                              'NavigationService',
                              'SessionService',
                              'API'

                            ];

  function CompanyUserController($scope, DataService, NavigationService, SessionService, API) {

    var vm = this;
    vm.goTo = goTo;
    vm.api = API.url;

    refresh_data();

    function refresh_data(){

      $scope.uid = SessionService.getJson('uid');
      $scope.NavigationService = NavigationService;
      $scope.role_admin = SessionService.getJson('role_admin');
      $scope.role_employee = SessionService.getJson('role_employee');
      $scope.role_customer = SessionService.getJson('role_customer');
      $scope.role_super = SessionService.getJson('role_super');
      $scope.selected_company = NavigationService.selected_company;

      $scope.is_admin = ($scope.role_admin.indexOf($scope.selected_company) > -1);
      $scope.is_employee = ($scope.role_employee.indexOf($scope.selected_company) > -1);
      $scope.is_customer = ($scope.role_customer.indexOf($scope.selected_company) > -1);

      DataService.getEmployees($scope.selected_company).then(function(response){
        $scope.employees = response;
      });

      if($scope.is_employee || $scope.is_admin || $scope.is_super){
        DataService.getCustomers($scope.selected_company).then(function(response){
          $scope.customers = response;
        });
      }else{
          $scope.customers = {};
      }

    }
    $scope.$watch("NavigationService.selected_company",function(newVal, oldVal) {
      refresh_data();
    });

    $scope.doRefresh = function() {
         refresh_data();
         $scope.$broadcast('scroll.refreshComplete');
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
    .controller('CompanyPermsController', CompanyPermsController);
  CompanyPermsController.$inject = [
                              '$scope',
                              '$stateParams',
                              'DataService',
                              'NavigationService',
            'SessionService'
                            ];

  function CompanyPermsController($scope, $stateParams, DataService, NavigationService, SessionService) {

    var vm = this;
    vm.goTo = goTo;

    refresh_data();

    function refresh_data(){

      $scope.NavigationService = NavigationService;
      $scope.role_admin = SessionService.getJson('role_admin');
      $scope.role_employee = SessionService.getJson('role_employee');
      $scope.role_customer = SessionService.getJson('role_customer');
      $scope.role_super = SessionService.getJson('role_super');
      $scope.role = ($scope.is_admin) ? "Admin" : ($scope.is_employee) ? "Employee" : "Customer";
      $scope.selected_company = NavigationService.selected_company;

      DataService.getUser($stateParams.contact_id).then(function(response){
        $scope.user = response;
        DataService.getPerms($stateParams.contact_id,$scope.selected_company).then(function(response){
          $scope.perms = response[0];
        });
      });
    }

    $scope.update_perms = (function update_perms(perms){
      DataService.updatePerms(perms).then(function(response){
        goTo('/company/users');
      });
    });

    $scope.doRefresh = function() {
         refresh_data();
         $scope.$broadcast('scroll.refreshComplete');
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
    .controller('CompanyFeedController', CompanyFeedController);
  CompanyFeedController.$inject = [
                              '$scope',
                              '$pusher',
                              'DataService',
                              'NavigationService',
            'SessionService',
            'API'
                            ];

  function CompanyFeedController($scope, $pusher, DataService, NavigationService, SessionService, API) {

    var vm = this;
    vm.goTo = goTo;
    vm.api = API.url;

    $scope.contacts = [];

    refresh_data();

    function refresh_data(){
      $scope.uid = SessionService.getJson('uid');
      $scope.NavigationService = NavigationService;
      $scope.role_admin = SessionService.getJson('role_admin');
      $scope.role_employee = SessionService.getJson('role_employee');
      $scope.role_customer = SessionService.getJson('role_customer');
      $scope.role_super = SessionService.getJson('role_super');
      $scope.selected_company = NavigationService.selected_company;
      $scope.is_admin = ($scope.role_admin.indexOf($scope.selected_company) > -1);
      $scope.is_employee = ($scope.role_employee.indexOf($scope.selected_company) > -1);
      $scope.is_customer = ($scope.role_customer.indexOf($scope.selected_company) > -1);

      DataService.getCompanyFeed($scope.selected_company).then(function(response){
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
    }


    $scope.$watch("NavigationService.selected_company",function(newVal, oldVal) {
      refresh_data();
    });

    var pusher = $pusher(pusher_client);
    var channel = pusher.subscribe('my_channel'+$scope.uid);
    channel.bind('my_event', function(data) {

        DataService.getCompanyFeed($scope.selected_company).then(function(response){
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
    });



    $scope.doRefresh = function() {
         refresh_data();
         $scope.$broadcast('scroll.refreshComplete');
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
    .controller('CompanyChatController', CompanyChatController);
  CompanyChatController.$inject = [
                              '$scope',
                              '$stateParams',
                              '$pusher',
                              '$ionicScrollDelegate',
                              'DataService',
                              'NavigationService',
                              'SessionService',
                              'API'
                            ];

  function CompanyChatController($scope, $stateParams, $pusher, $ionicScrollDelegate, DataService, NavigationService, SessionService, API) {

    var vm = this;
    vm.goTo = goTo;
    vm.api = API.url;

    refresh_data();

    function refresh_data(){
      $scope.uid = SessionService.getJson('uid');
      $scope.contact_id = $stateParams.contact_id;
      $scope.company_id = $stateParams.company_id;
      $scope.NavigationService = NavigationService;
      $scope.role_admin = SessionService.getJson('role_admin');
      $scope.role_employee = SessionService.getJson('role_employee');
      $scope.role_customer = SessionService.getJson('role_customer');
      $scope.role_super = SessionService.getJson('role_super');
      $scope.selected_company = NavigationService.selected_company;
      DataService.getCompanies().then(function(response){
        $scope.companies = response;
      });

      DataService.getUser($stateParams.contact_id).then(function(response){
        $scope.user = response;
      });

      DataService.getUser($scope.uid).then(function(response){
        $scope.current_user = response;
      });

      DataService.getMessages($stateParams.contact_id,$stateParams.company_id).then(function(response){
        $scope.messages = response;
        $ionicScrollDelegate.scrollBottom();
      });
    }

    $scope.$watch("NavigationService.selected_company",function(newVal, oldVal) {
            $scope.selected_company = NavigationService.selected_company;
            $scope.is_admin = ($scope.role_admin.indexOf(newVal) > -1);
            $scope.is_employee = ($scope.role_employee.indexOf(newVal) > -1);
            $scope.is_customer = ($scope.role_customer.indexOf(newVal) > -1);
    });

    var pusher = $pusher(pusher_client);
    var channel = pusher.subscribe('my_channel'+$scope.uid);
    channel.bind('my_event', function(data) {
      DataService.getMessages($stateParams.contact_id,$stateParams.company_id).then(function(response){
        $scope.messages = response;
        $ionicScrollDelegate.scrollBottom();
      });
    });

    $scope.send_chat = function send_chat(chat) {
      DataService.sendMessage(SessionService.getJson('uid'),$scope.company_id,$scope.contact_id,chat.content).then(function(response){
           DataService.getMessages($stateParams.contact_id,$stateParams.company_id).then(function(response){
              $scope.messages = response;
              $ionicScrollDelegate.scrollBottom(true);
           });
      });
      chat.content='';
    };

    $scope.doRefresh = function() {
         refresh_data();
         $scope.$broadcast('scroll.refreshComplete');
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

    refresh_data();

    function refresh_data(){
      $scope.NavigationService = NavigationService;
      $scope.uid = SessionService.getJson('uid');
      $scope.role_admin = SessionService.getJson('role_admin');
      $scope.role_employee = SessionService.getJson('role_employee');
      $scope.role_customer = SessionService.getJson('role_customer');
      $scope.role_super = SessionService.getJson('role_super');
      $scope.selected_company = NavigationService.selected_company;
      DataService.getCompanies().then(function(response){
        $scope.companies = response;
      });
    }

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
      goTo('/company/bulletins');
    };


    $scope.doRefresh = function() {
         refresh_data();
         $scope.$broadcast('scroll.refreshComplete');
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

    refresh_data();

    function refresh_data(){
      $scope.NavigationService = NavigationService;
      $scope.role_admin = SessionService.getJson('role_admin');
      $scope.role_employee = SessionService.getJson('role_employee');
      $scope.role_customer = SessionService.getJson('role_customer');
      $scope.role_super = SessionService.getJson('role_super');
      $scope.selected_company = NavigationService.selected_company;

      DataService.getCompanies().then(function(response){
        $scope.companies = response;
      });
    }

    $scope.invite_user = (function invite_user(invite) {
      invite.company_id = $scope.selected_company;
      DataService.inviteUser(invite).then(function(response){
        goTo('/company/users');
      });
    });


    $scope.doRefresh = function() {
         refresh_data();
         $scope.$broadcast('scroll.refreshComplete');
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

(function() {
  'use strict';

  angular
    .module('starter')
    .controller('PushNotificationLandingController', PushNotificationLandingController);

  PushNotificationLandingController.$inject = [];
  function PushNotificationLandingController() {
    var vm = this;
  }
})();

