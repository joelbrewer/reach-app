
(function() {
  'use strict';

  angular
    .module('starter')
    .factory('AuthenticationService', AuthenticationService);

  AuthenticationService.$inject = ['SessionService', '$http', 'API', 'DataService', 'jwtHelper'];

  function AuthenticationService(SessionService, $http, API, DataService, jwtHelper) {
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
      var decoded = jwtHelper.decodeToken(data.jwt)
      SessionService.set('uid', decoded['data']['userId']);
      SessionService.setJson('perms', decoded['data']['perms']);
      console.log('Session cached.');
      //SessionService.set('auth_token', data.auth_token);
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
        getEmployees : getEmployees,
        getCustomers : getCustomers,
        getCompanies : getCompanies,
        getCompany : getCompany,
        getUser : getUser,
        sendMessage : sendMessage
    };

    function getUser(uid){

      return $http({method:'GET', url:API.url + '/user/'+uid})
        .success(function(resulty) {
//alert(angular.toJson(resulty.data));
            return resulty.data;
        });
    }

    function getEmployees(cid){

      return $http({method:'GET', url:API.url + '/company/'+cid+'/employees'})
        .success(function(resulty) {
            SessionService.setJson('employee_list',resulty.data);
//alert(angular.toJson(resulty.data));
            return resulty.data;
        });
    }

    function getCustomers(cid){

      return $http({method:'GET', url:API.url + '/company/'+cid+'/customers'})
        .success(function(resulty) {
            SessionService.setJson('customer_list',resulty.data);
//alert(angular.toJson(resulty.data));
            return resulty.data;
        });
    }

    function getCompanies(){

      return $http({method:'GET', url:API.url + '/company'})
        .success(function(resulty) {
            SessionService.setJson('company_list',resulty.data);
//alert(angular.toJson(resulty.data));
            return resulty.data;
        });
//alert(angular.toJson(deferred));
    }

    function getCompany(cid){

      return $http({method:'GET', url:API.url + '/company/'+cid})
        .success(function(resulty) {
//alert(angular.toJson(resulty.data));
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
         
      }).success(function(data) { 
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
    var service = {}
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

