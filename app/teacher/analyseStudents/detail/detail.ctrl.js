/**
 * Created by yuan on 3/17/17.
 */
(function () {
    'use strict';
    angular.module('teacher.analyseStudents.detail')
        .controller('teacherAnalyseStudentsDetailCtrl', ctrl);
    function ctrl($log, $scope, teacherAnalyseStudentsDetailFactory) {
        $log.info('teacherAnalyseStudentsDetailCtrl init');
       // $log.info(teacherAnalyseStudentsDetailFactory.getSelectStudentId());
        $scope.labels = ['等级 A', '等级 B', '等级 C', '等级 D', '等级 F'];
        teacherAnalyseStudentsDetailFactory.getBigTable(function (error, res) {
           if (error) $log.error(error); else showDetail(res);
        });
        function showDetail(res) {
            $log.info(res);
            $scope.studentInfo = {
                name: res.name,
                campusID: res.campusID,
                average: res.average,
                gpa: res.gpa,
                detail: res.detail
            };
            $scope.data = [res.A, res.B, res.C, res.D, res.F];
            $scope.options = {
                title : {
                    display: true,
                    text: '成绩分析'
                },
                legend: {
                    display: true
                }
            };
        }
    }
})();