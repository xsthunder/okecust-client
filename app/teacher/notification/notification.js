/**
 * Created by xs on 3/3/2017.
 */
(function () {
    angular.module('account.notification', ['account', 'account.notificationPost'])
        .controller('accountNotification', ctrl);
    function ctrl($scope, Account, teacherFactory, $state, TeacherHeaderFactory, $mdDialog) {
        console.log('init notifcation');
        function getUrl(notificationID) {
            var url = Account.getUrl();
            url += 'courses/' + teacherFactory.getCurrentCourse()._id + '/notifications';
            if (notificationID) url += '/' + notificationID;
            return url;
        }

        console.log('geturl', getUrl());
        var listNotification = function () {
            Account.listNotifications(getUrl(), function (err, res) {
                if (err)return Account.showToast('', '获取课程通知失败');
                $scope.notifications = res.data;
                if($scope.notifications.length==0)return Account.showToast('meiyou','暂时还没有通知');

            });
            Account.setCurrentNotification(undefined);
        };
        listNotification();
        TeacherHeaderFactory.setOnSelectedListener(listNotification);
        $scope.btnNewNotification = function () {
            $state.go('teacher.notificationPost');
        };
        $scope.btnUpdateNotification = function (notification) {
            Account.setCurrentNotification(notification);
            $state.go('teacher.notificationPost');
        };
        $scope.btnRemoveNotification = function (notification) {
            var confirm = $mdDialog.confirm()
                .title('删除一个通知吗?')
                .textContent('通知名称：' + notification.name)
                .ariaLabel('程序员')
                .ok('确定')
                .cancel('取消');
            $mdDialog.show(confirm).then(function () {
                    Account.removeNotification(getUrl(notification._id), notification, function (err) {
                        listNotification();
                        if (err) return Account.showToast('', '删除通知失败');
                        return Account.showToast('', '删除通知成功');
                    });
                }, function () {
                    console.log('refuse to remove a notification ');
                }
            )
        }
    }
})();
