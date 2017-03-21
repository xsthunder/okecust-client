/**
 * Created by xs on 3/13/2017.
 */
(function () {
    'use strict';
    angular.module('teacher.analyseStudents', [
            'ui.router',
            'account',
            'teacher.analyseStudents.detail',
            'chart.js'
        ]
    )
        .factory('teacherAnalyseStudentsFactory', function (Account, $http, TeacherConstants, TeacherCourseConstants) {
            var self = {};
            self.getStudentsScoresByCourseID = function (courseID, callback) {
                TeacherCourseConstants.updateCourseId(courseID);
                $http.get(TeacherConstants.URL_COURSE_STUDENTS_SCORES + '/' + courseID + '/' + 'students/scores', {
                    headers: {'x-token': Account.getToken()}
                }).then(function (res) {
                    callback(null, res.data);
                }, function (res) {
                    callback(res);
                });
            };
            return self;
        });
})();