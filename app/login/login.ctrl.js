/**
 * Created by YY on 2016/11/28.
 */
(function () {
    'use strict';
    angular.module('login')
        .controller('loginCtrl', ctrl);
    function ctrl($scope, $mdDialog, $location, Account, $log, $state) {
        var showAlert = Account.showToast;

        $scope.username = '';
        $scope.password = '';
        $scope.login = function () {
            if ('' === $scope.username || '' === $scope.password) {
                return showAlert('错误', "输入不能为空");
            }
            Account.login($scope.username, $scope.password, function (err, res) {
                if (null !== err) {
                    return showAlert("无法登陆", '请检查账号或密码');
                }
                Account.setCredit(res);
                var type = res.type;
                console.log(res);
                Account.getProfile(function (err, profile) {
                    if (err) {
                        return $log.error(err);
                    }
                    Account.showToast('chengong', '欢迎' + profile.name + (type == 1 ? '同学' : '老师'));
                });
                if (type == 7) {
                    $location.path('/admin');
                } else if (type == 1) {
                    $log.info('student');
                    $state.go('student.class');
                } else if (type == 2) {
                    $location.path('/teacher/class');
                }
            });
        };
        $scope.showQR = false;
        $scope.switchQR = function () {
            $scope.showQR = !$scope.showQR;
        }
    }
})();