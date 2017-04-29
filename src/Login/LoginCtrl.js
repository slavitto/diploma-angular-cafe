var socket = io('http://localhost:3000');

DroneCafeApp
.controller('LoginCtrl', function ($scope, $http, $location, $cookies, $rootScope) {
  
  $scope.user = {};
  $cookies.remove('customer'); //logout

  $scope.login = function(newUser) {
    socket.emit('newUser', newUser);
    socket.on('newCustomer', function(customer) {
      $cookies.putObject('customer', customer);
      $location.path('/');
    });
  }
  
});
// app.factory('Session', function($http) {
//   var Session = {
//     data: {},
//     saveSession: function() { /* save session data to db */ },
//     updateSession: function() { 
//       /* load data from db */
//       $http.get('session.json').then(function(r) { return Session.data = r.data;});
//     }
//   };
//   Session.updateSession();
//   return Session; 
// });