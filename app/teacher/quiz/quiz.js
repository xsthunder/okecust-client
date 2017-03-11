/**
 * Created by Fisher at 23:50 on 10/08/2016.
 */
angular.module('teacher.quiz', [
    'ui.router',
    'account',
    'teacher.quiz.detail',
    'teacher.quiz.post'
])
//?
    .factory('TeacherQuizConstants', function (TeacherConstants) {
        var self = {};
        self.updateQuizId = function (quizId) {
            self.URL_MODEL = TeacherConstants.URL_QUIZZES + '/' + quizId;
            self.URL_MODEL_QUESTIONS = self.URL_MODEL + '/questions';
        };
        self.updateQuizId('');
        return self;
    })
    //目前知道有提交问题的功能
    //getQuizList
    .factory('teacherQuizFactory', function ($http, Account, TeacherConstants, TeacherQuizConstants) {
        /** @namespace $scope.quiz._id */
        var self = {};
        var activeQuiz;
        /**
         * Transfer value between pages.
         * FIXME standardize it.
         * @param quiz Active quiz to be edited.
         */
        self.setActiveQuiz = function (quiz) {
            activeQuiz = quiz;
        };
        self.getActiveQuiz = function () {
            return activeQuiz;
        };
        var quizList;
        self.flushQuizList = function (callback) {
            $http.get(TeacherConstants.URL_QUIZZES, {
                headers: {'x-token': Account.getToken()}
            }).then(function (res) {
                quizList = res.data;
                callback(null, quizList);
            }, function (res) {
                callback(res);
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
        self.getQuizList = function (callback) {
            if (quizList) {
                return callback(null, quizList);
            }
            self.flushQuizList(callback);
        };
        /**
         * Create a new quiz into the specific course.
         *
         * Request.quiz:
         {
            "name": "QUIZ for 线性代数-第二章",
            "desc": "Everyone should get 60 at least :)",
            "time": {
                "from": 1478404032544,
                "duration": 3600000
            },
            "questions": [
                "57cbdd38f3ae1d4b4f1126dd",
                "57f92006ff19051e5b81b4c1",
                "57e7f625c2a982ff466c6c0d"
              ]
         }
         *
         * @param quiz{Object} Quiz object.
         * @param courseID{String} Course ID.
         * @param callback
         */
        //添加题目方法
        var currentQuiz;
        self.setCurrentQuiz=function (quiz) {
            currentQuiz=quiz;
        };
        self.getCurrentQuiz=function () {
            return currentQuiz;
        };
        self.createNewQuiz = function (courseID, quiz, callback) {
            $http.post(TeacherConstants.URL_BASE + '/courses/' + courseID + '/quizzes', {
                name: quiz.name,
                description: quiz.desc,
                time: quiz.time,
                questions: quiz.questions
            }, {
                headers: {'x-token': Account.getToken()}
            }).then(function (res) {
                callback(null, res.data);
            }, function (res) {
                callback(res);
            });
        };
        self.updateQuiz = function (quiz, callback) {
            TeacherQuizConstants.updateQuizId(quiz._id);
            $http.patch(TeacherQuizConstants.URL_MODEL, {
                name: quiz.name,
                desc: quiz.desc,
                duration: quiz.duration,
                time: quiz.time,
                questions: quiz.questions
            }, {
                headers: {'x-token': Account.getToken()}
            }).then(function (res) {
                callback(null, res.data);
            }, function (res) {
                callback(res);
            });
        };
        self.removeQuiz = function (quizId, callback) {
            TeacherQuizConstants.updateQuizId(quizId);
            $http.delete(TeacherQuizConstants.URL_MODEL, {
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
        $stateProvider.state('teacher.quiz', {
            url: '/quiz',
            views: {
                'header': {
                    templateUrl: 'app/teacher/teacher.header.html',
                    controller: 'teacherHeaderCtrl'
                },
                'main': {
                    templateUrl: 'app/teacher/quiz/quiz.html',
                    controller: 'teacherQuizzesCtrl'
                }
            }
        })
    })
    .controller('teacherQuizzesCtrl', function ($scope, Account, teacherFactory, TeacherQuiz) {
        var onListCallback = function (err, quizzes) {
            if (err) {
                return Account.showToast('错误', 'Error getting quizzes list.');
            }
            $scope.quizzes = quizzes;
        };
        TeacherQuiz.getQuizList(onListCallback);
        $scope.btnViewQuiz = function (quiz) {
            TeacherQuiz.setActiveQuiz(quiz);
        };
        $scope.btnTargetNewQuiz = function () {
            TeacherQuiz.setActiveQuiz({name: ''});
        };
        $scope.btnUpdateQuiz = function (quiz) {
            TeacherQuiz.setActiveQuiz(quiz);
        };
        $scope.btnRemoveQuiz = function (quiz) {
            var confirm = $mdDialog.confirm()
                .title('Remove this quiz?')
                .textContent('不可恢复')
                .ariaLabel('Lucky day')
                .ok('确定')
                .cancel('取消');

            $mdDialog.show(confirm).then(function () {
                    TeacherQuiz.removeQuiz(quiz._id, function (err, quiz) {
                        if (err) {
                            return Account.showToast('错误', 'failed to delete quiz: ' + err.data);
                        }
                        TeacherQuiz.flushQuizList(onListCallback);
                        Account.showToast('成功', 'Quiz deleted!');
                    })
                }, function () {
                }
            );
        }
    });