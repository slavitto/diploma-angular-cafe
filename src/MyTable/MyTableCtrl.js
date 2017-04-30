DroneCafeApp
    .controller('MyTableCtrl', function($scope, $location, $cookies) {
        $scope.customer = $cookies.getObject('customer');
        if ($scope.customer === undefined) $location.path('/login');
        $scope.customer.orders =  $cookies.getObject('customer').orders || [];

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
            $scope.$apply(function() {
                $scope.customer.orders.push({ dish: order.dish, state: "ordered" });
                $scope.customer.credit = $scope.customer.credit - order.dish.price;
                $cookies.putObject('customer', {
                    username: $scope.customer.username,
                    email: $scope.customer.email,
                    credit: $scope.customer.credit,
                    orders: $scope.customer.orders
                });
            });
        });

        socket.on('updatedOrder', updatedOrder => {
             $scope.$apply(function() { 
                updatedOrder.map(function(order) {
                    return { dish: order.dish.name, state: order.state };
                });
                $scope.customer.orders = updatedOrder;
                $cookies.putObject('customer', {
                    username: $scope.customer.username,
                    email: $scope.customer.email,
                    credit: $scope.customer.credit,
                    orders: updatedOrder
                });
             });
        });
    });
