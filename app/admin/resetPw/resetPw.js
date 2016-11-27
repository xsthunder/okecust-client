angular.module('admin.resetPw', ['ui.router', 'account'])
    .config(function ($stateProvider) {
        $stateProvider.state('admin.resetPw', {
            url: '/resetPw',
            templateUrl: 'app/admin/resetPw/resetPw.html',
            controller: 'resetPwCtrl'
        })
    })
    .controller('resetPwCtrl', function ($scope, $http, Account, AdminConstants) {
        $scope.resetPw = function () {
            if ($scope.password != $scope.confirmPw) {return $scope.flag = '密码输入不一致';}
            else {
                $http.post(AdminConstants.URL_ACCOUNTS_PASSWORD, {
                    uid: $scope.username,
                    password: Account.hash($scope.username, $scope.password)
                }, {
                    headers: {'x-token': Account.getToken()}
                }).then(function (res) {
                    alert('Updated password!');
                    //$scope.username = '';
                    $scope.password = '';
                    $scope.confirmPw = '';
                }, function (res) {
                    alert('Failed to update password!');
                })
            }
        }
    });