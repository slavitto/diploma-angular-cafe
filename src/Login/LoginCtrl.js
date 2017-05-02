var socket = io('/');

DroneCafeApp
    .controller('LoginCtrl', function($scope, $cookies, $window) {

        socket.emit('logOut', $cookies.getObject('customer'));

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
    });
