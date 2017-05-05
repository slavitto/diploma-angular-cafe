DroneCafeApp
    .controller('MenuCtrl')
    .component('menuList', {
        templateUrl: './src/Menu/Menu.html',
        controller: ["$scope", "$http", "$cookies", function($scope, $http, $cookies) {
            $http
                .get('./src/Menu/menu.json')
                .then(function(res) {
                    $scope.drinks = res.data.drinks;
                    $scope.dishes = res.data.dishes;
                    $scope.desserts = res.data.desserts;
                    var customer = $cookies.getObject('customer');
                    if(customer) $scope.credit = customer.credit;
                });

            $scope.$on('addCredit', function(addCredit, addedCredit) {
                console.log(addedCredit);
                $scope.credit += addedCredit;
            });

            $scope.putOrder = function(dish) {
                email = $cookies.getObject('customer').email;
                socket.emit('putOrder', { email: email, dish: dish });
                $scope.credit = $scope.credit - dish.price;
            }
        }]
    });
