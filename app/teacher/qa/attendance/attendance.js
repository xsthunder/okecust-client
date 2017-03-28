/**
 * Created by xs on 3/25/2017.
 */
'use strict';
(function () {
    angular.module('teacher.qa.attendance', [])
        .controller('teacherQaAttendanceCtrl', ctrl)
        .factory('teacherQaAttendanceFactory', fact);
    function fact(teacherQuizFactory, TeacherCourse, Account,teacherFactory) {
        var self = {};
        self.getAttendance = function (callback) {
            var quiz = teacherQuizFactory.getCurrentQuiz();
            if (quiz) {
                if (quiz == -1) {
                    return TeacherCourse.getAllAttendanceFromCourse(teacherFactory.getCurrentCourse()._id, callback);
                }
                return TeacherCourse.getQuizAttendanceFromQuiz(quiz._id, callback);
            } else {
                Account.showToast('', '没有选择问答');
            }
        };
        return self;
    }


    function ctrl(teacherQaAttendanceFactory, $scope, Account, $mdBottomSheet, teacherAnalyseStudentsDetailFactory) {
        var ctrlRes = null;
        $scope.type=true;
        teacherQaAttendanceFactory.getAttendance(function (err, res) {
            if (err)return Account.showToast('', '无法获得出勤情况');
            console.log(res);
            ctrlRes = res;
            $scope.res = res;
            if(res.reportsByQuiz!==undefined){
                $scope.type=false;
            }
        });
        $scope.btnAchievement = function (index) {
            $mdBottomSheet.show({
                templateUrl: 'app/teacher/qa/attendance/achievement.html',
                controller: function ($scope, Account, studentFactory) {
                    $scope.res = ctrlRes.achievements[index];
                    $scope.details = ctrlRes.achievements[index].detail;
                }
            }).then(function (clickedItem) {
            });
        }
    }
})();