var note = angular.module('note', ['ckeditor']);

note.controller('NoteListCtrl', ['$scope', '$http', function ($scope, $http) {
    $http.get('/note').
        success(function (notes) {
            $scope.notes = notes;
        }).
        error(function (err) {
            return console.log(err);
        });

    $scope.remove = function (id) {
        $http.delete(['/note/', id].join('')).
            success(function () {
                window.location.href = '/';
            }).
            error(function (err) {
                console.log(err);
            });
    };
}]);

note.controller('NoteCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.noteid = window.noteid;

    $http.get(['/note/', $scope.noteid].join('')).
        success(function (note) {
            $scope.note = note;
        }).
        error(function (err) {
            return console.log(err);
        });

    $scope.submitNote = function () {
        $http.post(['/note/', $scope.noteid].join(''), {
            title: $scope.note.title,
            content: $scope.note.content
        }).success(function (notes) {
            window.location.href = '/';
        }).error(function (err) {
            console.log(err);
        });
    };

    $scope.addTag = function () {
        $scope.note.tags.push($scope.newtag);
        $http.post(['/note/', $scope.noteid].join(''), {
            tags: $scope.note.tags
        }).error(function (err) {
            console.log(err);
            $scope.tags.pop();
        });

        delete $scope.newtag;
    };

    $scope.back = function () {
        window.location.href = '/';
    };
}]);

note.controller('CkeditorCtrl', ['$scope', function ($scope) {
    $scope.options = {
    };

    $scope.onReady = function () {
    };
}]);
