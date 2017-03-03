/**
 * Created by xs on 3/1/2017.
 */
(function () {
    angular.module('account.update', ['account'])
        .controller('accountUpdateCtrl', ctrl);
    function ctrl($scope, Account) {
        var updatePwd = 0;
        $scope.updatePwd = updatePwd;
        Account.getProfile(function (err, profile) {
            console.log('profile', profile);
            if (err)return Account.showToast('', '获取个人信息失败');
            $scope.tel = profile.tel;
            $scope.motto = profile.motto;
            $scope.nick = profile.nick;
            $scope.email = profile.email;
            $scope.uid = profile.uid;
            $scope.name = profile.name;

        });
        $scope.updatePwdInfo = ["更新密码", "不更新密码"];

        $scope.switchUpdatePwd = function () {
            updatePwd = !updatePwd;
            updatePwd += 0;
            $scope.updatePwd = updatePwd;
        };
        var updateInfo =function () {
            Account.updateProfile({
                tel: $scope.tel,
                motto: $scope.motto,
                nick: $scope.nick,
                email: $scope.email,
                uid: $scope.uid
            }, function (err) {
                if (err) {
                    Account.showToast('', '更新个人信息失败');
                }
                else {
                    Account.showToast('', '更新个人信息成功');
                    history.back();
                }
            })
        };
        $scope.submit = function () {
            console.log('init submit');

            if ($scope.updatePwd == true) {
                if (!$scope.newPwd1 || !$scope.newPwd2)return Account.showToast('', '密码栏不能为空');
                if ($scope.newPwd1 != $scope.newPwd2)return Account.showToast('', '两次密码输入不一致');
                if($scope.newPwd1==$scope.curPwd)return Account.showToast('','新密码和原密码不能一样');
                Account.updatePwd($scope.uid, $scope.newPwd1, $scope.curPwd, function (err) {
                    console.log(err);
                    if (err)return err.status==401?Account.showToast('', '更新密码失败，请检查原密码'):Account.showToast('', '更新个人信息失败');
                    updateInfo();
                })
            }
            else updateInfo();
            $scope.title = '更新个人信息';

        }
    }
})();