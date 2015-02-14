var user = angular.module('user', []);

user.controller('UserCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.registerUser = function () {
        window.location.href = '/register';
    };
}]);
