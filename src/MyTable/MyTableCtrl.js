DroneCafeApp
    .controller('MyTableCtrl', function($scope, $location, $cookies) {
        var orders = [];
        $scope.customer = $cookies.getObject('customer');
        if($scope.customer === undefined) $location.path('/login');

        $scope.addCredit = function() {
            $scope.customer.credit += 100;
            $cookies.putObject('customer', {
                username: $scope.customer.username,
                email: $scope.customer.email,
                credit: $scope.customer.credit,
                orders: $scope.customer.orders
            });
            socket.emit('addCredit', $scope.customer);
            $scope.$broadcast('addCredit');
        }

        socket.on('newOrder', order => {
            orders.push({ dish: order.dish, state: "ordered" });
            $scope.orders = orders;
            $scope.customer.credit = $scope.customer.credit - order.dish.price;
            $cookies.putObject('customer', {
                username: $scope.customer.username,
                email: $scope.customer.email,
                credit: $scope.customer.credit,
                orders: orders
            });
        });

        socket.on('updatedOrder', updatedOrder => {
            updatedOrder.map(function(order) {
                return { dish: order.dish.name, state: order.state };
            });
            $scope.orders = updatedOrder;
            $cookies.putObject('customer', {
                username: $scope.customer.username,
                email: $scope.customer.email,
                credit: $scope.customer.credit,
                orders: updatedOrder
            });
        });
    });
