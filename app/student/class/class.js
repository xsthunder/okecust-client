/**
 * Created by YY on 7/22/2016.
 */
angular.module('student.class', ['ui.router'])
    .config(function ($stateProvider) {
        $stateProvider.state('student.class', {
            url: '/class',
            templateUrl: 'app/student/class/class.html',
            controller: 'classCtrl'
        })
    })
    .controller('classCtrl', function ($scope,$mdBottomSheet, $log, $state, Account, studentFactory) {
        studentFactory.getCourseList(function (err, list) {
            if (err == null) {
                $scope.courseList = list;
            }
            else Account.showlert('错误', '无法获得课程列表');
        });
        var setCourse = function (course) {
            studentFactory.setCurrentCourseName(course.name);
            studentFactory.setCurrentCourse(course._id);
        };
        $scope.btnExam = function (course) {
            console.log('btnExam');
            console.log(course);
            setCourse(course);
            $state.go('student.qa');
        };
        $scope.logout = function () {
            console.log('要推出了');
            Account.deleteCredit();
            $state.go('login');
        };
        $scope.updatePwd = function () {
            $state.go('student.accountUpdate');
        };
        $scope.btnInfo=function (course) {
                $scope.alert = '';
                $mdBottomSheet.show({
                    templateUrl: 'app/student/class/class.info.html',
                    controller: function ($scope) {
                        $scope.course=course;
                        console.log('hello bottom sheet');
                    }
                }).then(function(clickedItem) {
                    $scope.alert = clickedItem['name'] + ' clicked!';
                });
        }
    });
   
