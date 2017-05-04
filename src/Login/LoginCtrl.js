var socket = io('/');

DroneCafeApp
    .controller('LoginCtrl', ["$scope", "$cookies", "$window", function($scope, $cookies, $window) {

        var cookie = $cookies.getObject('customer');
        if(cookie !== undefined) socket.emit('logOut', cookie);

        $scope.login = function(newUser) {
            socket.emit('newUser', newUser);
            socket.on('newCustomer', function(res) {
                    $cookies.putObject('customer', {
                        username: res.customer.username,
                        email: res.customer.email,
                        credit: res.customer.credit,
                        orders: res.orders
                    });
                $window.location.href = '/';
            });
        }
    }]);
