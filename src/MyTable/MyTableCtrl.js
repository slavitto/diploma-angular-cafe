DroneCafeApp
.controller('MyTableCtrl', function ($scope, $rootScope, $cookies) {
	$scope.customer = $cookies.getObject('customer') || $rootScope.user;
	var orders = [];

	$scope.addCredit = function() {
		$scope.customer.credit += 100;
		$cookies.putObject('customer', { 
						username: $scope.customer.username,
						email: $scope.customer.email,
						credit: $scope.customer.credit, 
					});
		socket.emit('addCredit', $scope.customer);
		$scope.$broadcast('addCredit');
	}

	socket.on('newOrder', order => {
		orders.push({ dish: order.dish.name, state: "Ordered" });
		$scope.orders = orders;
		$scope.customer.credit = $scope.customer.credit - order.dish.price;
		$cookies.putObject('customer', { 
						username: $scope.customer.username,
						email: $scope.customer.email,
						credit: $scope.customer.credit, 
					});
	});
});