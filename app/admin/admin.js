/**
 * Created by yy on 16-8-6.
 */
angular.module('admin', ['account', 'ui.router', 'admin.resetPw', 'admin.studentOpt', 'admin.teacherOpt'])
    .config(function ($stateProvider) {
        $stateProvider.state('admin', {
            url: "/admin",
            templateUrl: "app/admin/admin.html",
            controller: 'adminCtrl'
        })
    })
    .factory('AdminConstants', function (AppConstants) {
        // constant fields related to app.admin;
        var self = {};
        var base = AppConstants.URL_BASE + '/admin-dangerous';
        self.URL_STUDENTS = base + '/students';
        self.URL_TEACHERS = base + '/teachers';
        self.URL_ACCOUNTS_PASSWORD = base + '/accounts/password';
        return self;
    })
    .controller('adminCtrl', function ($scope, $log, $location, Account) {
        if (!Account.checkCredit(7)) {
            return $location.path('/login');
        }
        Account.getProfile(function (err, profile) {
            if (err) {return $log.error(err);}
            $scope.name = profile.name;
        });
        $scope.items = [
            {
                sref: 'admin.resetPw',
                content: '重置密码'
            },
            {
                sref: 'admin.studentOpt',
                content: '管理学生'
            },
            {
                sref: 'admin.teacherOpt',
                content: '管理老师'
            }
        ];
        $scope.logout = function () {
            Account.deleteCredit();
            $location.path('/login');
        };
    });
