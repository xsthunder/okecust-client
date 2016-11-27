/**
 * Created by YY on 7/19/2016.
 */
angular.module('login', ['ui.router'])
    .config(function ($stateProvider) {
        $stateProvider.state('login', {
                url: "/login",
                templateUrl: "app/login/login.html",
                controller: 'LoginCtrl'
            }
        )
    })
    .controller('LoginCtrl', function ($scope, $http, $location, Account) {
        $scope.username = '';
        $scope.password = '';
        $scope.login = function () {
            if ('' === $scope.username || '' === $scope.password) {
                return alert('not available input');
            }
            Account.login($scope.username, $scope.password, function (err, res) {
                if (null !== err) {return alert('Failed to login, check your id and password! ' + err.status);}
                Account.setCredit(res);
                var type = res.type;
                if (type == 7) {
                    $location.path('/admin');
                } else if (type == 1) {
                    $location.path('/student');
                } else if (type == 2) {
                    $location.path('/teacher/qa');
                }
            });
        }
        $scope.showQR = false;
        $scope.switchQR = function() {
            $scope.showQR = !$scope.showQR;
        }
    });

