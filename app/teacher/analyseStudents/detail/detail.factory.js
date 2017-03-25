/**
 * Created by yuan on 3/17/17.
 */
(function () {
    'use strict';
    angular.module('teacher.analyseStudents.detail').
        factory('teacherAnalyseStudentsDetailFactory', myFactory);
    function myFactory(TeacherConstants, teacherFactory, Account, $http, $cookies) {
        var selectStudentId;
        var ret = {};
        ret.getSelectStudentId = function () {
            if (selectStudentId != undefined) return selectStudentId;
            else return selectStudentId = $cookies.get('teacherAnalyseStudentsDetailFactorySelectStudentId');
        };
        ret.setSelectStudentId = function (newId) {
            selectStudentId = newId;
            $cookies.put('teacherAnalyseStudentsDetailFactorySelectStudentId', newId);
        };
        ret.getBigTable = function (callback) {
            var promise = $http.get(TeacherConstants.URL_COURSE_STUDENTS_SCORES+ '/' + teacherFactory.getCurrentCourse()._id +
                '/students/' + ret.getSelectStudentId()  + '/scores', {
                    headers: {'x-token': Account.getToken()}
                });
            promise.then(function (res) {
                callback(null, res.data);
            }, function (res) {
                callback(res);
            });
        };
        return ret;
    }
})();