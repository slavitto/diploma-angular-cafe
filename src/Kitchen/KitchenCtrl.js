DroneCafeApp
    .controller('KitchenCtrl', function($scope) {

        socket.emit('cookLogin');
        socket.on('orders', orders => {
            $scope.ordered = [];
            $scope.cooking = [];
            orders.forEach(order => {
                if (order.state === "ordered") {
                    $scope.ordered.push(order);
                } else {
                    $scope.cooking.push(order);
                }
            });
        });

        $scope.refresh = () => socket.emit('cookLogin');
        $scope.clear = () => {
            socket.emit('clearOrders');
            socket.emit('cookLogin');
        }
        $scope.startCook = function(order, index) {
            $scope.ordered.splice(index, 1);
            $scope.cooking.unshift(order);
            order.state = "cooking";
            socket.emit('updateOrder', order);
        }

        $scope.finishCook = function(order, index) {
            order.state = "ready";
            socket.emit('updateOrder', order);
            $scope.cooking.splice(index, 1);
        }
    });