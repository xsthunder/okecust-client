angular.module('admin.teacherOpt', ['ui.router'])
    .config(function ($stateProvider) {
        $stateProvider.state('admin.teacherOpt', {
            url: '/teacherOpt',
            templateUrl: 'app/admin/teacherOpt/teacherOpt.html',
            controller: 'AdminTeacherCtrl'
        })
    })
    .factory('AdminTeacher', function ($http, AdminConstants, Account) {
        var factory = {};
        var teacherList;
        factory.getTeacherList = function (callback) {
            if (teacherList) {return callback(null, teacherList);}
            $http.get(AdminConstants.URL_TEACHERS, {
                headers: {'x-token': Account.getToken()}
            }).then(function (res) {
                teacherList = res.data;
                callback(null, teacherList);
            }, function (res) {
                callback(res);
            });
        };
        factory.createTeacher = function (uid, name, password, callback) {
            $http.post(AdminConstants.URL_TEACHERS, {
                uid: uid,
                name: name,
                password: Account.hash(uid, password)
            }, {
                headers: {'x-token': Account.getToken()}
            }).then(function (res) {
                callback(null, res.data);
            }, function (res) {
                callback(res);
            });
        };
        return factory;
    })
    .controller('AdminTeacherCtrl', function ($scope, AdminTeacher) {
        $scope.userName = '';
        $scope.userId = '';
        $scope.password = '';
        $scope.confirmPw = '';
        var flushData = function () {
            AdminTeacher.getTeacherList(function (err, teachers) {
                if (err) {return alert(err.data);}
                $scope.teachers = teachers;
            });
        };
        flushData();
        $scope.createStd = function () {
            if ($scope.password != $scope.confirmPw) {return $scope.flag = '密码输入不一致';}
            AdminTeacher.createTeacher($scope.userId, $scope.userName, $scope.password, function (err, teacher) {
                if (err) {return alert('Failed to add teacher: ' + err.status + '(' + err.data + ')');}
                $scope.teachers.push(teacher);
                alert('Added teacher ' + $scope.userName + ' with uid: ' + $scope.userId);
                flushData();
                $scope.userName = '';
                $scope.userId = '';
                $scope.password = '';
                $scope.confirmPw = '';
            });
        }
    });