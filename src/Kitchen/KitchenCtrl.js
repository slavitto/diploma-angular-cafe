DroneCafeApp
.controller('KitchenCtrl', function ($scope) {

	socket.emit('cookLogin');
	socket.on('orders', orders => {
		$scope.ordered = [];
		$scope.cooking = [];
		orders.forEach(order => {
			if(order.state === "ordered") $scope.ordered.push(order);
			if(order.state === "cooking") $scope.cooking.push(order);
		});
	});

	$scope.refresh = () => socket.emit('cookLogin'); 
	$scope.startCook = function(order, index) {
		$scope.ordered.splice(index, 1);
		$scope.cooking.push(order);
		order.state = "cooking";
		socket.emit('updateOrder', order);
	}

	$scope.finishCook = function(order, index) {
		order.state = "ready";
		socket.emit('updateOrder', order);
	}

	// socket.on('newOrder', order => {
	// 	orders.push({ dish: order.dish.name, state: "Ordered" });
	// 	$scope.orders = orders;
	// 	$scope.customer.credit = $scope.customer.credit - order.dish.price;
	// 	$cookies.putObject('customer', { 
	// 					username: $scope.customer.username,
	// 					email: $scope.customer.email,
	// 					credit: $scope.customer.credit, 
	// 				});
	// });

});