DroneCafeApp
    .controller('KitchenCtrl', ["$scope", function($scope) {

        socket.emit('cookLogin');

        socket.on('orders', orders => {
            $scope.$apply(function() {
                $scope.orders = orders;
            });
        });

        socket.on('newOrder', newOrder => {
            $scope.$apply(function() {
                $scope.orders.unshift(newOrder);
            });
        });

        $scope.startCook = function(order, index) {
            $scope.orders[index].state = "cooking";
            socket.emit('updateOrder', order);
        }

        $scope.finishCook = function(order, index) {
            order.state = "ready";
            socket.emit('updateOrder', order);
            $scope.orders.splice(index, 1);
        }
    }]);
