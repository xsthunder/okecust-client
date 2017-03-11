/**
 * Created by YY on 7/20/2016.
 */
angular.module('student', [
    'account',
    'ui.router',
    'student.qa',
    'student.class',
    'student.person',
    'student.doc',
    'student.sign',
    'account.update'
])
    .factory('StudentConstants', function (Account, AppConstants, TeacherConstants) {
        var self = {};
        self.URL_BASE = AppConstants.URL_BASE + '/student-side/' + Account.getUid();
        self.URL_COURSES = self.URL_BASE + '/courses';
        self.URL_COURSE = self.URL_COURSES + '/:courseId';
        self.URL_QUIZZES = self.URL_BASE + '/quizzes';
        self.URL_QUIZ = self.URL_QUIZZES + '/:quizID';
        self.URL_ACHIEVEMENTS = self.URL_BASE + '/achievements';
        self.URL_ACHIEVEMENT = self.URL_ACHIEVEMENTS + '/:achievementID';
        self.freshStudentConstant = function () {
            console.log(self.URL_BASE);
            self.URL_BASE = AppConstants.URL_BASE + '/student-side/' + Account.getUid();
            self.URL_COURSES = self.URL_BASE + '/courses';
            self.URL_COURSE = self.URL_COURSES + '/:courseId';
            self.URL_QUIZZES = self.URL_BASE + '/quizzes';
            self.URL_QUIZ = self.URL_QUIZZES + '/:quizID';
            self.URL_ACHIEVEMENTS = self.URL_BASE + '/achievements';
            self.URL_ACHIEVEMENT = self.URL_ACHIEVEMENTS + '/:achievementID';
            console.log(self.URL_BASE);


        };

        return self;
    })
    .factory('studentFactory', function (Account, $http, $log, StudentConstants) {
        var courseList;
        var currentCourse;
        var currentCourseName;
        var self = {};
        self.flushCourseList = function (callback) {

            $http.get(StudentConstants.URL_COURSES, {
                headers: {'x-token': Account.getToken()}
            }).then(function (res) {
                courseList = res.data;
                callback(null, courseList);
            }, function (res) {
                callback(res);
            });
        };
        self.getCourseList = function (callback) {
            if (Account.getFreshTeacherConstantsFlag()) {
                StudentConstants.freshStudentConstant();
                courseList = 0;
            }
            if (courseList) {
                console.log('sec1');
                return callback(null, courseList);
            }
            self.flushCourseList(callback);
            console.log('sec2');

        };
        self.setCurrentCourse = function (value) {
            currentCourse = value;
            console.log('setCurrentC');
            console.log(value);
        };
        self.setCurrentCourseName = function (name) {
            currentCourseName = name;
        }
        self.getCurrentCourse = function () {
            return currentCourse;
        };
        self.getCurrentCourseName = function () {
            return currentCourseName;
        }
        /**
         * Get course detail.
         *
         * Response-example:
         {
          "_id": "57d23f6fb273076009686486",
          "lTime": "2016-11-05T11:40:22.620Z",
          "cTime": "2016-09-09T04:49:51.713Z",
          "email": "",
          "desc": "高等数学-施劲松 :)",
          "tel": "",
          "author": "250",
          "students": [],
          "name": "高等数学",
          "__v": 1,
          "time": []
        }
         */
        self.getCourseDetail = function (courseID, callback) {
            $http.get(StudentConstants.URL_COURSES + '/' + courseID, {
                headers: {'x-token': Account.getToken()}
            }).then(function (res) {
                callback(null, res.data);
            }, function (res) {
                callback(res);
            });
        };
        /**
         * Get quizzes from a specific course.
         *
         Response-Example: Quizzes Array
         {
             "_id": "581f21d9d3a9869000a3d85c",
             "lTime": "2016-11-06T12:42:07.810Z",
             "cTime": "2016-11-06T12:28:09.346Z",
             "author": "250",
             "courseID": "57d23f6fb273076009686486",
             "name": "QUIZ for 线性代数-第二章",
             "__v": 1,
             "questions": [
               "57cbdd38f3ae1d4b4f1126dd",
               "57f92006ff19051e5b81b4c1",
               "57e7f625c2a982ff466c6c0d"
             ],
             "time": {
               "from": 1478404032544,
               "duration": 3600000
             }
           }
         */
        self.getCourseQuizzesList = function (courseID, callback) {
            $http.get(StudentConstants.URL_COURSES + '/' + courseID + '/quizzes', {
                headers: {'x-token': Account.getToken()}
            }).then(function (res) {
                callback(null, res.data);
            }, function (res) {
                callback(res);
            });
        };
        /**
         * Get quiz detail.
         *
         * Response: Quiz Object.
         */
        self.getCourseQuizDetail = function (courseID, quizID, callback) {
            $http.get(StudentConstants.URL_COURSES + '/' + courseID + '/quizzes' + '/' + quizID, {
                headers: {'x-token': Account.getToken()}
            }).then(function (res) {
                callback(null, res.data);
            }, function (res) {
                callback(res);
            });
        };
        self.getTeacherProfile = function (courseID, callback) {
            $http.get(StudentConstants.URL_COURSES + '/' + courseID + '/teacher/profile', {
                headers: {'x-token': Account.getToken()}
            }).then(function (res) {
                callback(null, res.data);
            }, function (res) {
                callback(res);
            });
        };

        /**
         * Join the quiz.
         *
         * Request body: Empty.
         *
         * Response: Achievement Object.
         * {
        "_id": "581f2222d3a9869000a3d85e",
        "lTime": "2016-11-06T12:29:30.116Z",
        "cTime": "2016-11-06T12:29:22.561Z",
        "userID": "10140000",
        "quizID": "581f21d8d3a9869000a3d85b",
        "__v": 1,
      }
         */
        self.joinAQuiz = function (courseID, quizID, callback) {
            $http.post(StudentConstants.URL_COURSES + '/' + courseID + '/quizzes' + '/' + quizID, {}, {
                headers: {'x-token': Account.getToken()}
            }).then(function (res) {
                callback(null, res.data);
            }, function (res) {
                callback(res);
            });
        };
        return self;
    })
    .config(function ($stateProvider) {
        $stateProvider
            .state('student', {
                url: '/student',
                templateUrl: 'app/student/student.html',
                controller: 'studentCtrl'
            })
            .state('student.accountUpdate', {
                url: '/account/update',
                templateUrl: 'app/student/accountUpdate/accountUpdate.html',
                controller: 'accountUpdateCtrl'
            })

    })

    .controller('studentCtrl', function ($scope, $mdSidenav, $location, Account, studentFactory, $log) {
        if (!Account.checkCredit(1)) {
            return $location.path('/login');
        }
        $scope.items = [
            {
                sref: 'student.class',
                content: '班级',
                icon: 'class'
            }
            // ,{
            //     sref:'student.doc',
            //     content:'课件',
            //     icon:'description'
            // }

            , {
                sref: 'student.qa',
                content: '问答',
                icon: 'help'
            }
            , {
                sref: 'student.person',
                content: '个人',
                icon: 'person'
            }
            // , {
            //     sref:'student.sign',
            //     content:'签到',
            //     icon:'fingerprint'
            // }
        ];
        var toggle = function () {
            $mdSidenav('left').toggle();
        };
        $scope.toggleList = toggle;
        Account.getProfile(function (err, res) {
            if (err == null) {
                $scope.studentName = res.name;
            }
            else Account.showToast('错误', "error");
        })
    })
// .factory('stdFactory', function(){
//   var self {};
//   self.
// })
