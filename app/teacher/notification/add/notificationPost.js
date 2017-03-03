/**
 * Created by xs on 3/3/2017.
 */
(function () {
        angular.module('account.notificationPost', ['account'])
            .controller('accountNotificationPost', ctrl);
        function ctrl($scope, Account, teacherFactory, $state) {
            console.log('init notifcation');
            function getUrl(notificationID) {
                var url = Account.getUrl();
                url += 'courses/' + teacherFactory.getCurrentCourse()._id + '/notifications';
                if (notificationID) url += '/' + notificationID;
                return url;
            }

            var currentNotification = Account.getCurrentNotification();
            if (currentNotification) $scope.notification = currentNotification;
            $scope.submit = function (notification) {
                if (!(notification.name && notification.description))return Account.showToast('', '任意栏不能为空');
                if (currentNotification) {
                    Account.updateNotification(getUrl(notification._id), notification, function (err, res) {
                        if (err)return Account.showToast('', '修改课程通知失败');
                        Account.showToast('', '修改课程通知成功');
                        history.back();
                    });
                }
                else
                    Account.newNotification(getUrl(), notification, function (err, res) {
                        if (err)return Account.showToast('', '新增课程通知失败');
                        Account.showToast('', '新增课程通知成功');
                        history.back();
                    })
            }
        }
    })();
