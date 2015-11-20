
(function() {
  'use strict';

  angular
    .module('starter')
    .factory('AuthenticationService', AuthenticationService);

  AuthenticationService.$inject = ['SessionService', '$http', 'API', 'DataService','NavigationService', 'jwtHelper'];

  function AuthenticationService(SessionService, $http, API, DataService, NavigationService, jwtHelper) {
    var service = {};
    service.login = login;
    service.cacheSession = cacheSession;

    return service;

    function login(credentials) {

      SessionService.reset();

      $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

      return $http({ 
        method: 'POST', 
        url: API.url + '/login',
        skipAuthorization: true, 
        data: "email=" + credentials.email + "&password=" + credentials.password, 
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).success(function(data) { 
        cacheSession(data);
      });  
    }

    function cacheSession(data) {
      SessionService.set('authenticated', true);
      SessionService.set('jwt', data.jwt);
      var decoded = jwtHelper.decodeToken(data.jwt);
      SessionService.setJson('uid', decoded['data']['userId']);
      SessionService.setJson('role_admin', decoded['role_admin']);
      SessionService.setJson('role_employee', decoded['role_employee']);
      SessionService.setJson('role_customer', decoded['role_customer']);
      console.log('Session cached.');
      SessionService.set('auth_token', data.auth_token);
    }
  }
})();

(function() {
  'use strict';

  angular
    .module('starter')
    .factory('DataService', DataService);

  DataService.$inject = ['SessionService', '$http', 'API', '$q'];

  function DataService(SessionService, $http, API, $q) {

    var service = {
        getCurrentUserId : getCurrentUserId,
        getEmployees : getEmployees,
        getCustomers : getCustomers,
        getCompanies : getCompanies,
        getCustomerFeed : getCustomerFeed,
        getMessages: getMessages,
        getBulletins: getBulletins,
        getCompany : getCompany,
        getUser : getUser,
        sendMessage : sendMessage,
        sendBulletin : sendBulletin,
        updateUser : updateUser
    };

    function getCurrentUserId(){

      return 1; 

    }

    function getUser(uid){

      return $http({method:'GET', url:API.url + '/user/'+uid})
        .then(function(resulty) {
//alert(angular.toJson(resulty.data));
            return resulty.data;
        });
    }

    function getEmployees(cid){

      return $http({method:'GET', url:API.url + '/employee/'+cid})
        .then(function(resulty) {
            SessionService.setJson('employees-'+cid,resulty.data);
//alert(angular.toJson(resulty.data));
            return resulty.data;
        });
    }

    function getCustomers(cid){

      return $http({method:'GET', url:API.url + '/customer/'+cid})
        .then(function(resulty) {
            SessionService.setJson('customer_list',resulty.data);
//alert(angular.toJson(resulty.data));
            return resulty.data;
        });
    }

    function getCompanies(){

//      var companies = SessionService.getJson('companies');
//      if(companies !== null){
//        return companies;
//      }
      return $http({method:'GET', url:API.url + '/company'})
        .then(function(resulty) {
            SessionService.setJson('companies',resulty);
            return resulty.data;
        });
    }

    function getCompany(cid){
      return $http({method:'GET', url:API.url + '/company/'+cid})
        .success(function(resulty) {
//alert(angular.toJson(resulty.data));
            return resulty.data;
        });
    }

    function getMessages(uid) {
      return $http({method:'GET', url:API.url + '/message/'+uid})
        .then(function(resulty) {
            SessionService.setJson('user_messages-'+uid, resulty.data);
            return resulty.data;
        });
    }

    function getBulletins(cid) {
      return $http({method:'GET', url:API.url + '/bulletin/'+cid})
        .then(function(resulty) {
            SessionService.setJson('bulletins-'+cid, resulty.data);
            return resulty.data;
        });
    }


    function getCustomerFeed(uid) {
      return $http({method:'GET', url:API.url + '/feed/'+uid})
        .then(function(resulty) {
            SessionService.setJson('customer_feed',resulty.data);
            return resulty.data;
        });
    }

    function sendMessage(sender_uid, recipient_uid, message_content) {

      $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
      return $http({ 
        method: 'POST', 
        url: API.url + '/message', 
        data: "sender_uid="+sender_uid+"&recipient_uid="+recipient_uid+"&message_content="+message_content, 
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
         
      }).then(function(data) { 
      });  

    }

    function sendBulletin(bulletin) {

      $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
      return $http({ 
        method: 'POST', 
        url: API.url + '/bulletin', 
        data: "sender_uid="+bulletin.sender_uid+"&company_id="+bulletin.company_id+"&message_content="+bulletin.message_content, 
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
         
      }).then(function(data) { 
      });  

    }

    function updateUser(user) {

      $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
      return $http({ 
        method: 'POST', 
        url: API.url + '/user', 
        data: "id="+user.id+"&first_name="+user.first_name+"&last_name="+user.last_name+"&email="+user.email+"&company_name="+user.company_name+"&position="+user.position, 
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
         
      }).then(function(data) { 
      });  

    }

    return service;
  }
})();

(function() {
  'use strict';

  angular
    .module('starter')
    .factory('NavigationService', NavigationService);

  function NavigationService() {

    var service = {};
    service.selected_company = '1';
    service.setLocation = setLocation;
    return service;
  }

  function setLocation(path) {
    location.href = "#" + path;
  }

})();

(function() {
  'use strict';

  angular
    .module('starter')
    .factory('SessionService', SessionService);

  function SessionService() {

    var service = {};

    service.get = get;
    service.set = set;
    service.getJson = getJson;
    service.setJson = setJson;
    service.unset = unset;
    service.reset = reset;

    function get(key) {
      return localStorage.getItem(key);
    }

    function set(key, value) {
      return localStorage.setItem(key, value);
    }

    function getJson(key) {
      return angular.fromJson(get(key));
    }

    function setJson(key, value) {
      return set(key, angular.toJson(value));
    }

    function unset(key) {
      return localStorage.removeItem(key);
    }

    function reset() {
      return localStorage.clear();
    }

    return service;
  }

})();

