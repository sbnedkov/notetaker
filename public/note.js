var note = angular.module('note', ['ckeditor']);

note.controller('NoteListCtrl', ['$scope', '$http', '$window', function ($scope, $http, $window) {
    $http.get('/note').
        then(function (notes) {
            $scope.notes = notes.data;
            $window.document.body.style = "";
        }).
        catch(function (err) {
            return console.log(err);
        });

    $scope.remove = function (id) {
        $http.delete(['/note/', id].join('')).
            then(function () {
                window.location.href = '/';
            }).
            catch(function (err) {
                console.log(err);
            });
    };
}]);

note.controller('NoteCtrl', ['$scope', '$http', '$window', function ($scope, $http, $window) {
    $scope.noteid = window.noteid;

    $http.get(['/note/', $scope.noteid].join('')).
        then(function (note) {
            $scope.note = note.data;
            $window.document.body.style = "";
        }).
        catch(function (err) {
            return console.log(err);
        });

    $scope.submitNote = function () {
        $http.post(['/note/', $scope.noteid].join(''), {
            title: $scope.note.title,
            content: $scope.note.content
        }).then(function (notes) {
            window.location.href = '/';
        }).catch(function (err) {
            console.log(err);
        });
    };

    $scope.addTag = function () {
        $scope.note.tags.push($scope.newtag);
        $http.post(['/note/', $scope.noteid].join(''), {
            tags: $scope.note.tags
        }).catch(function (err) {
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
