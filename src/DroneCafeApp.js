var DroneCafeApp = angular.module('DroneCafeApp', [ 'ngRoute' ]);

DroneCafeApp
.config(['$routeProvider',
    function config($routeProvider) { 

        $routeProvider.
        when('/login', {
            templateUrl: 'src/Login/Login.html',
            controller: 'LoginCtrl'
        }).
        when('/menu', {
            templateUrl: 'src/Menu/Menu.html',
            controller: 'MenuCtrl'
        }).
        when('/kitchen', {
            templateUrl: 'src/Kitchen/Kitchen.html',
            controller: 'KitchenCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
    }
]);
