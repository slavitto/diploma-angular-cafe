var DroneCafeApp = angular.module('DroneCafeApp', [ 'ngRoute', 'ngCookies' ]);

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
        when('/mytable', {
            templateUrl: 'src/MyTable/MyTable.html',
            controller: 'MyTableCtrl'
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