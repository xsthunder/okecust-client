/**
 * Created by yuan on 3/17/17.
 */
(function () {
    'use strict';
    angular.module('teacher.analyseStudents')
        .controller('teacherAnalyseStudentsCtrl', ctrl);
    function ctrl(TeacherHeaderFactory,Account, $log, $scope, $state, teacherAnalyseStudentsFactory, teacherFactory,
                  teacherAnalyseStudentsDetailFactory) {
        var freshData = function () {
            $scope.scores = teacherAnalyseStudentsFactory
                .getStudentsScoresByCourseID(teacherFactory.getCurrentCourse()._id, function (err, res) {
                if (err) {
                    Account.showToast('', '获取学生成绩失败');
                }
                else {
                    if(res.length==0)return  Account.showToast('', '本课程还没有添加任何学生');
                    Account.showToast('','点击学生学号可以查看详细信息')
                    console.log('in scores', res);
                    $scope.scores = res;
                    $scope.labels = [0.5, 1, 1.5, 2, 2.5, 3, 3.5];
                    var barData = [0, 0, 0, 0, 0, 0, 0];
                    var i;
                    var e;
                    for (i = 0;i<res.length;i++) {
                        e=res[i];
                        var t = parseFloat(e.gpa);
                        barData[parseInt(t / 0.5)]++;
                    }
                    $log.info(barData);
                    $scope.data = barData;
                }
            })
        };
        TeacherHeaderFactory.setOnSelectedListener(freshData);
        freshData();
        $scope.sortBy = function(propertyName) {
            $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
            $scope.propertyName = propertyName;
        };
        $scope.propertyName = 'average';
        $scope.reverse = true;
        $scope.showDetail = function (studentId) {
            teacherAnalyseStudentsDetailFactory.teacherAnalyseStudentsDetailFactory(studentId);
            $state.go('teacher.analyseStudentsDetail');
        };
    }
})();