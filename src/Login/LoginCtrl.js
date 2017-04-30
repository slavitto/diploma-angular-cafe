var socket = io('/');

DroneCafeApp
    .controller('LoginCtrl', function($scope, $cookies, $window) {

        var cookie = $cookies.getObject('customer');

        if (cookie !== undefined) {
            socket.emit('logOut', cookie);
            if (cookie.orders)
                cookie.orders = cookie.orders.filter(function(order) {
                    return (order.state === "ordered" || order.state === "cooking");
                });
            $cookies.putObject('customer', cookie);
        }

        $scope.login = function(newUser) {
            socket.emit('newUser', newUser);
            socket.on('newCustomer', function(newCustomer) {
                if (!cookie) $cookies.putObject('customer', newCustomer);
                $window.location.href = '/';
            });
        }
    });
