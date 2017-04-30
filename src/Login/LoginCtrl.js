var socket = io('/');

DroneCafeApp
    .controller('LoginCtrl', function($scope, $http, $cookies, $rootScope, $window) {

        if ($cookies.getObject('customer'))
            socket.emit('logOut', $cookies.getObject('customer'));
        $cookies.remove('customer');
        $scope.user = {};

        $scope.login = function(newUser) {
            socket.emit('newUser', newUser);
            socket.on('newCustomer', function(customer) {
 				$cookies.putObject('customer', customer);
                $window.location.href = '/';
            });
        }
    });
