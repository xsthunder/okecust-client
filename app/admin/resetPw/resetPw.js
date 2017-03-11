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
            if(!$scope.password||!$scope.confirmPw||!$scope.username)return Account.showToast('','任意字段不能为空');
            if ($scope.password != $scope.confirmPw) {return $scope.flag = '密码输入不一致';}
            else {
                $http.post(AdminConstants.URL_ACCOUNTS_PASSWORD, {
                    uid: $scope.username,
                    password: Account.hash($scope.username, $scope.password)
                }, {
                    headers: {'x-token': Account.getToken()}
                }).then(function (res) {
                    Account.showToast('','更新密码成功');
                    //$scope.username = '';
                    $scope.password = '';
                    $scope.confirmPw = '';
                }, function (res) {
                    Account.showToast('','更新密码失败');
                })
            }
        }
    });