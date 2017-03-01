/**
 * Created by xs on 3/1/2017.
 */
(function () {
    angular.module('account.update', ['account'])
        .controller('accountUpdateCtrl', ctrl);
    function ctrl($scope, Account) {
        var updatePwd = 0;
        $scope.updatePwd = updatePwd;
        Account.getProfile(function (err,profile) {
            console.log('profile',profile);
            if(err)return Account.showToast('','获取个人信息失败');
            $scope.tel=profile.tel;
            $scope.motto=profile.motto;
            $scope.nick=profile.nick;
            $scope.email=profile.email;
            $scope.uid=profile.uid;
            $scope.name=profile.name;

        });
        $scope.updatePwdInfo =["更新密码", "不更新密码"];

        $scope.switchUpdatePwd = function () {
            updatePwd = !updatePwd;
            updatePwd+=0;
            $scope.updatePwd = updatePwd;
        };
        $scope.submit = function () {
            console.log('init submit');
            var updateInfo = function () {
                Account.updateProfile({
                    tel: $scope.tel,
                    motto: $scope.motto,
                    nick: $scope.nick,
                    email: $scope.email,
                    uid:$scope.uid
                }, function (err) {
                    if(err)return Account.showToast('','更新个人信息失败');
                    history.back();
                    return Account.showToast('','更新个人信息成功');
                })
            };
            var updatePwd = function () {
                if ($scope.updatePwd == true) {
                    if(!$scope.newPwd1||!$scope.newPwd2)return Account.showToast('','密码栏不能为空');
                    if($scope.newPwd1!=$scope.newPwd2)return Account.showToast('','两次密码输入不一致');
                    Account.updatePwd($scope.uid,$scope.newPwd1,$scope.curPwd,function (err) {
                        if(err)return Account.showToast('','更新个人信息失败');
                        history.back();
                        return Account.showToast('','更新个人信息成功');
                    })
                }
            };
            //updateInfo();

            updatePwd();
        }
    }
})();