DroneCafeApp
.controller('LoginCtrl', function ($scope, $rootScope, AuthService) {
 
$scope.user = {
  username: '',
  email: ''
}

$scope.login = function (user) {
    AuthService.login(user).then(function () {
      $rootScope.authenticated = true;
    }, function () {
      $rootScope.authenticated = false;
    });
  };
})
.service('Session', function () {
  this.create = function (sessionId, userId, userRole) {
    this.id = sessionId;
    this.userId = userId;
    this.userRole = userRole;
  };
  this.destroy = function () {
    this.id = null;
    this.userId = null;
    this.userRole = null;
  };
  return this;
})
.factory('AuthService', function ($http, Session) {
  return {
    login: function (user) {
      return $http
        .post('/!#/menu', user)
        .then(function (res) {
          Session.create(res.id, res.userid, res.role);
        });
    },
    isAuthenticated: function () {
      return !!Session.userId;
    },
    isAuthorized: function (authorizedRoles) {
      if (!angular.isArray(authorizedRoles)) {
        authorizedRoles = [authorizedRoles];
      }
      return (this.isAuthenticated() &&
        authorizedRoles.indexOf(Session.userRole) !== -1);
    }
  }
});