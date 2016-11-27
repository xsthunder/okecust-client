/**
 * Created by YY on 2016/9/9.
 */
angular.module('teacher')
    .factory('TeacherConstants', function (Account, AppConstants) {
        var self = {};
        self.URL_BASE = AppConstants.URL_BASE + '/teacher-side/'+Account.getUid();
        self.URL_COURSES = self.URL_BASE + '/courses';
        self.URL_QUESTIONS = self.URL_BASE + '/questions';
        self.URL_COURSE = self.URL_COURSES + '/:courseId';
        self.URL_COURSE_STUDENTS = self.URL_COURSES + '/students';
        return self;
    })
  .factory('teacherFactory', function (Account, $http, $log, TeacherConstants, $cookies) {
        var courseList;
        var currentCourse;
        var self = {};
        self.flushCourseList = function (callback) {
            $http.get(TeacherConstants.URL_COURSES, {
                headers: {'x-token': Account.getToken()}
            }).then(function (res) {
                courseList = res.data;
                callback(null, courseList);
            }, function (res) {
                callback(res);
            });
        };
        self.getCourseList = function (callback) {
            if (courseList) {
                return callback(null, courseList);
            }
            self.flushCourseList(callback);
        };
        self.setCurrentCourse = function (value) {
            $cookies.putObject('currentCourse', value);
            currentCourse = value;
            console.log(currentCourse);
            $log.info('set', value);
        };
        self.getCurrentCourse = function () {
            currentCourse = $cookies.getObject('currentCourse');
            $log.info('cookie', currentCourse);
            return currentCourse;
        };
        return self;
    });