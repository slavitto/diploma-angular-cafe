var socket = io('/');

DroneCafeApp
    .controller('LoginCtrl', function($scope, $cookies, $window) {

        if ($cookies.getObject('customer'))
            socket.emit('logOut', $cookies.getObject('customer'));
        $cookies.remove('customer');
        $scope.user = {};

        $scope.login = function(newUser) {
            socket.emit('newUser', newUser);
            socket.on('newCustomer', function(newCustomer) {
 				$cookies.putObject('customer', newCustomer);
                $window.location.href = '/';
            });
        }
    });
