/**
 * Created by YY on 7/22/2016.
 */
(function () {
    'use strict';
    angular.module('teacher.class')
        .factory('TeacherCourseConstants', function (TeacherConstants) {
            var self = {};
            self.updateCourseId = function (courseId) {
                self.URL_COURSE = TeacherConstants.URL_COURSES + '/' + courseId;
            };
            self.updateCourseId('');
            return self;
        })
        .factory('TeacherCourse', function ($http, Account, TeacherConstants, TeacherCourseConstants) {
            /** @namespace $scope.course._id */
            var self = {};
            var activeCourse;
            /**
             * Transfer value between pages.
             * FIXME standardize it.
             * @param course Active course to be edited.
             */
            self.setActiveCourse = function (course) {
                activeCourse = course;
            };
            self.getActiveCourse = function () {
                return activeCourse;
            };
            self.createNewCourse = function (course, callback) {
                $http.post(TeacherConstants.URL_COURSES, {
                    name: course.name,
                    description: course.description,
                    email: course.email,
                    tel: course.tel
                }, {
                    headers: {'x-token': Account.getToken()}
                }).then(function (res) {
                    callback(null, res.data);
                }, function (res) {
                    callback(res);
                });
            };
            self.updateCourse = function (course, callback) {
                TeacherCourseConstants.updateCourseId(course._id);
                $http.patch(TeacherCourseConstants.URL_COURSE, {
                    name: course.name,
                    description: course.description,
                    email: course.email,
                    tel: course.tel
                }, {
                    headers: {'x-token': Account.getToken()}
                }).then(function (res) {
                    callback(null, res.data);
                }, function (res) {
                    callback(res);
                });
            };
            /**
             * List students of a course.
             * @param courseID{String} Course ID.
             * @param callback{Function} Callback.
             *
             * Response Example:
             [
             {
               "name": "王琴",
               "uid": "10161776"
             },
             {
               "name": "孙薇",
               "uid": "10161777"
             },
             {
               "name": "王诗珂",
               "uid": "10161778"
             }
             ]
             */
            self.getCourseStudents = function (courseID, callback) {
                TeacherCourseConstants.updateCourseId(courseID);
                $http.get(TeacherCourseConstants.URL_COURSE + '/students', {
                    headers: {'x-token': Account.getToken()}
                }).then(function (res) {
                    callback(null, res.data);
                }, function (res) {
                    callback(res);
                });
            };

            /**
             * Add students into course.
             * Students that do not exist will be created.
             *
             * @param courseID{String} Course ID.
             * @param students{Array} Student object array. {"id": "10140001", "name": "Whatever"}
             * @param callback{Function} Callback.
             *
             * Request Example:
             {
                 "students": [{
                     "id": "10140000",
                     "name": "Test-10140000"
                 }, {
                     "id": "10140001",
                     "name": "Test-10140001"
                 }, {
                     "id": "10140002",
                     "name": "Test-10140002"
                 }, {
                     "id": "10140003",
                     "name": "Test-10140003"
                 }, {
                     "id": "10140004",
                     "name": "Test-10140004"
                 }]
             }

             Response Example:
             {
                "studentsCreated": 0,    // How many students are created.
                "scoresCreated": 12      // How many students are added to this course.
             }
             */
            self.addStudentsIntoCourse = function (courseID, students, callback) {
                TeacherCourseConstants.updateCourseId(courseID);
                $http.post(TeacherCourseConstants.URL_COURSE + '/students', {
                    students: students
                }, {
                    headers: {'x-token': Account.getToken()}
                }).then(function (res) {
                    callback(null, res.data);
                }, function (res) {
                    callback(res);
                });
            };
            /**
             * Remove students from course.
             *
             * @param courseID{String} Course ID.
             * @param studentIDs{Array} Student id array. ["10140000"]
             * @param callback{Function} Callback.
             */
            self.removeStudentsFromCourse = function (courseID, studentIDs, callback) {
                TeacherCourseConstants.updateCourseId(courseID);
                $http({
                    url: TeacherCourseConstants.URL_COURSE + '/students',
                    method: 'DELETE',
                    data: {
                        students: studentIDs
                    },
                    headers: {
                        "Content-Type": "application/json;charset=utf-8",
                        'x-token': Account.getToken()
                    }
                }).then(function (res) {
                    callback(null, res.data);
                }, function (res) {
                    callback(res);
                });
            };
            self.resetStudentsPwdFromCourse = function (courseID, studentIDs, callback) {
                TeacherCourseConstants.updateCourseId(courseID);
                $http({
                    url: TeacherCourseConstants.URL_COURSE + '/students'+'/'+studentIDs+'/password',
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json;charset=utf-8",
                        'x-token': Account.getToken()
                    }
                }).then(function (res) {
                    callback(null, res.data);
                }, function (res) {
                    callback(res);
                });
            };

            /**
             * Get the corresponding library via course id.
             *
             * @param courseID{String} Course ID.
             * @param callback{Function} Callback.
             * @param callback.data{Object} Return library in callback.
             *
             * Response Example:
             {
               "_id": "582c67a0e091104165dcf0a1",
               "lTime": "2016-11-16T14:05:20.554Z",
               "cTime": "2016-11-16T14:05:20.554Z",
               "author": "250",
               "name": "高等数学 - Question Library",
               "parentID": "57d284424dfd938d36d80a1f",
               "__v": 0,
               "questions": []
             }
             */
            self.getCorrespondingLibrary = function (courseID, callback) {
                TeacherCourseConstants.updateCourseId(courseID);
                $http.get(TeacherCourseConstants.URL_COURSE + '/library', {
                    headers: {'x-token': Account.getToken()}
                }).then(function (res) {
                    callback(false, res.data);
                }, function (res) {
                    callback(true, res);
                });
            };


            /**
             * Get quiz list.
             *
             * Response: Quiz
             *
             [{
        "_id": "58205d9c9a6b47001802522e",
        "lTime": "2016-11-07T10:55:24.808Z",
        "cTime": "2016-11-07T10:55:24.808Z",
        "author": "250",
        "courseID": "57d284424dfd938d36d80a1f",
        "name": "QUIZ for 线性代数-第二章",
        "__v": 0,
        "questions": [
          "57cbdd38f3ae1d4b4f1126dd",
          "57f92006ff19051e5b81b4c1",
          "57e7f625c2a982ff466c6c0d"
        ],
        "time": {
          "from": 1478404032544,
          "duration": 3600000
        }
      }]
             */
            self.getQuizListFromCourse = function (courseID, callback) {
                TeacherCourseConstants.updateCourseId(courseID);
                $http.get(TeacherCourseConstants.URL_COURSE + '/quizzes', {
                    headers: {'x-token': Account.getToken()}
                }).then(function (res) {
                    callback(null, res.data);
                }, function (res) {
                    callback(res);
                });
            };
            self.getQuizAttendanceFromQuiz = function (quizId, callback) {
                $http.get(TeacherConstants.URL_QUIZZES +quizId+'/reportsDetail', {
                    headers: {'x-token': Account.getToken()}
                }).then(function (res) {
                    callback(null, res.data);
                }, function (res) {
                    callback(res);
                });
            };
            self.getAllAttendanceFromCourse=function (courseID, callback) {
                TeacherCourseConstants.updateCourseId(courseID);
                $http.get(TeacherCourseConstants.URL_COURSE + '/quizzes/reports', {
                    headers: {'x-token': Account.getToken()}
                }).then(function (res) {
                    callback(null, res.data);
                }, function (res) {
                    callback(res);
                });
            };


            self.removeCourse = function (courseID, callback) {
                TeacherCourseConstants.updateCourseId(courseID);
                $http.delete(TeacherCourseConstants.URL_COURSE, {
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