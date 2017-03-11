angular.module('admin.studentOpt', ['account', 'helper', 'ui.router'])
    .config(function ($stateProvider) {
        $stateProvider.state('admin.studentOpt', {
            url: '/studentOpt',
            templateUrl: 'app/admin/studentOpt/studentOpt.html',
            controller: 'AdminStudentCtrl'
        })
    })
    .factory('AdminStudent', function ($http, AdminConstants, Account) {
        var factory = {};
        var studentList;
        factory.getStudentList = function (callback) {
            if (studentList) {return callback(null, studentList);}
            $http.get(AdminConstants.URL_STUDENTS, {
                headers: {'x-token': Account.getToken()}
            }).then(function (res) {
                studentList = res.data;
                callback(null, studentList);
            }, function (res) {
                callback(res);
            });
        };
        factory.createStudent = function (uid, name, password, callback) {
            $http.post(AdminConstants.URL_STUDENTS, {
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
    .controller('AdminStudentCtrl', function (Account,$scope, AdminStudent) {
        $scope.userName = '';
        $scope.userId = '';
        $scope.password = '';
        $scope.confirmPw = '';
        AdminStudent.getStudentList(function (err, students) {
            if (err) {return console.error(err);}
            $scope.students = students;
        });
        $scope.createStd = function () {
            if ($scope.password != $scope.confirmPw) {return $scope.flag = '密码输入不一致';}
            AdminStudent.createStudent($scope.userId, $scope.userName, $scope.password, function (err, data) {
                if (err) {return Account.showToast("错误",'Failed to add student: ' + err.status + '(' + err.data + ')');}
                AdminStudent.getStudentList(function (err, students) {
                    if (err) {return console.error(err);}
                    $scope.students = students;
                });
                Account.showToast('错误','Added student ' + $scope.userName + ' with uid: ' + $scope.userId);
                $scope.userName = '';
                $scope.userId = '';
                $scope.password = '';
                $scope.confirmPw = '';
            });
        }
    });