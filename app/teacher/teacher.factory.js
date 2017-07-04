/**
 * Created by YY on 2016/9/9.
 */
angular.module('teacher')
    .factory('TeacherConstants', function (Account, AppConstants, $cookies) {
        var self = {};
        self.URL_BASE = AppConstants.URL_BASE + '/teacher-side/' + Account.getUid();
        self.URL_COURSES = self.URL_BASE + '/courses';
        self.URL_QUESTIONS = self.URL_BASE + '/questions';
        self.URL_COURSE = self.URL_COURSES + '/:courseId';
        self.URL_COURSE_STUDENTS = self.URL_COURSES + '/students';
        self.URL_COURSE_STUDENTS_SCORES = self.URL_COURSES;
        self.URL_LIBRARIES = self.URL_BASE + '/libraries';
        self.URL_QUIZZES = self.URL_BASE + '/quizzes/';
        self.URL_FILES = self.URL_BASE + '/courses/err_courseIDNotSet';
        self.URL_FILE = self.URL_BASE + '/courses/err_courseIDNotSet' + '/files';

        self.freshTeacherConstant = function () {
            self.URL_BASE = AppConstants.URL_BASE + '/teacher-side/' + Account.getUid();
            self.URL_COURSES = self.URL_BASE + '/courses';
            self.URL_QUESTIONS = self.URL_BASE + '/questions';
            self.URL_COURSE = self.URL_COURSES + '/:courseId';
            self.URL_COURSE_STUDENTS = self.URL_COURSES + '/students';
            self.URL_COURSE_STUDENTS_SCORES = self.URL_COURSES;
            self.URL_LIBRARIES = self.URL_BASE + '/libraries';
            self.URL_QUIZZES = self.URL_BASE + '/quizzes/';
            var currentCourse = $cookies.getObject('currentCourse');
            if (currentCourse&&currentCourse._id) {
                let courseID=currentCourse._id;
                self.URL_FILES = self.URL_BASE + '/courses/' + courseID + '/files';
                self.URL_FILE = self.URL_BASE + '/courses/' + courseID + '/files/';
            }
            // else {
            //     self.URL_FILES = self.URL_BASE + '/courses/' + teacherFactory.getCurrentCourse()._id + '/files';
            //     self.URL_FILE = self.URL_BASE + '/courses/' + teacherFactory.getCurrentCourse()._id + '/files/';
            // }
        };
        return self;
    })
    .factory('teacherFactory', function ($mdDialog, Account, $http, $log, $location, TeacherConstants, $cookies, $mdToast) {
        var courseList;
        var currentCourse;
        var self = {};
        self.clearCourseList = function () {
            courseList = null;
        };

        /**
         * FIXME help me remove this repeated code
         * @param callback
         */
        self.showToast = Account.showToast;
        var showAlert = function (title, message) {
            // Appending dialog to document.body to cover sidenav in docs app
            // Modal dialogs should fully cover application
            // to prevent interaction outside of dialog
            $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title(title)
                    .textContent(message)
                    .ariaLabel('Alert Dialog Demo')
                    .ok('明白')
            );
        };

        self.flushCourseList = function (callback) {
            if (Account.getFreshTeacherConstantsFlag()) {
                TeacherConstants.freshTeacherConstant();
            }
            console.log(TeacherConstants.URL_COURSES);
            if (!TeacherConstants.URL_COURSES) $location.path('/login');
            $http.get(TeacherConstants.URL_COURSES, {
                headers: {'x-token': Account.getToken()}
            }).then(function (res) {
                console.log('resh coursfe list', res);
                self.courseList = res.data;
                callback(null, self.courseList);
            }, function (res) {
                callback(res);
            });
        };
        self.getCourseList = function (callback) {
            // var freshCoursesFlag = $cookies.get('freshCoursesFlag');
            // if(freshCoursesFlag=='yes'){
            //     self.flushCourseList(callback);
            // }
            console.log("courseList", courseList);
            if (courseList) {
                //console.log("in tearcher factory, courseList: " +courseist);

                return callback(null, courseList);
            }
            self.flushCourseList(callback);
        };
        self.setCurrentCourse = function (value) {
            if (value) TeacherConstants.freshTeacherConstant(value._id);
            console.log('setcuurnetcousre', value);
            if (value === null) $cookies.remove('setcuurnetcousre');
            $cookies.putObject('currentCourse', value);
            currentCourse = value;
        };
        self.getCurrentCourse = function () {
            currentCourse = $cookies.getObject('currentCourse');
            console.log("requied cureent courses");
            console.log(currentCourse);


            /*
             **FIXME 需要更新请求代码
             * 虽然解决了最开始什么也不出来（break）了的问题，但还是会出现一个500错误。
             * by xsthunder
             */
            if (currentCourse === undefined) {
                //showAlert("严重错误","拒绝和服务器通信，原因是:\n没有选择课程");
                return function () {
                    _id:0
                };
            }
            else return currentCourse;


        };

        return self;
    });