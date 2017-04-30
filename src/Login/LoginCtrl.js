var socket = io('/');

DroneCafeApp
.controller('LoginCtrl', function ($scope, $http, $cookies, $rootScope, $window) {
  
  $scope.user = {};
  $cookies.remove('customer'); //logout

  $scope.login = function(newUser) {
    socket.emit('newUser', newUser);
    socket.on('newCustomer', function(customer) {
    	console.log('customer');
      $cookies.putObject('customer', customer);
      $window.location.href = '/';
    });
  }
  
});