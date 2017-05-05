DroneCafeApp
    .controller('MyTableCtrl', ["$scope", "$location", "$cookies", function($scope, $location, $cookies) {
        $scope.customer = $cookies.getObject('customer');
        if ($scope.customer === undefined) $location.path('/login');
        $scope.customer.orders = $cookies.getObject('customer').orders || [];

        $scope.addCredit = function() {
            $scope.customer.credit += 100;
            putCookie()
            socket.emit('addCredit', $scope.customer);
            $scope.$broadcast('addCredit', 100);
        }

        socket.on('newOrder', order => {
            $scope.$apply(function() {
                $scope.customer.orders.push({ dish: order.dish, state: "ordered" });
                $scope.customer.credit = $scope.customer.credit - order.dish.price;
                putCookie()
            });
        });

        socket.on('updatedOrder', updatedOrder => {
            $scope.$apply(function() {
                var notExpired = updatedOrder.filter(function(order) {
                    return order.state !== "expired";
                });

                $scope.customer.orders = notExpired;
                putCookie()
            });
        });

        socket.on('refund', refund => {
            $scope.$apply(function() {
                $scope.customer.credit = $scope.customer.credit + refund;
                $scope.$broadcast('addCredit', refund);
                putCookie()
            });
        });

        function putCookie() {
            $cookies.putObject('customer', {
                username: $scope.customer.username,
                email: $scope.customer.email,
                credit: $scope.customer.credit,
                orders: $scope.customer.orders
            });
        }
        
    }]);
