/**
 * Created by YY on 7/22/2016.
 */
angular.module('student.qa', [
    'account',
    'ui.router'
])
    .factory('studentQuizFactory', function (Account, $http, $log, StudentConstants) {
        var quizList;
        var currentQuiz;
        var self = {};
        self.flushQuizList = function (callback) {
            $http.get(StudentConstants.URL_QUIZZES, {
                headers: {'x-token': Account.getToken()}
            }).then(function (res) {
                quizList = res.data;
                callback(null, quizList);
            }, function (res) {
                callback(res);
            });
        };

        self.getQuizList = function (callback) {
            if (quizList) {
                return callback(null, quizList);
            }
            self.flushQuizList(callback);
        };
        self.setCurrentQuiz = function (value) {
            currentQuiz = value;
        };
        self.getCurrentQuiz = function () {
            return currentQuiz;
        };
        return self;
    })
    .factory('studentAchievementFactory', function (Account, $http, $log, StudentConstants) {
        var achievementList;
        var currentAchievement;
        var self = {};
        self.flushAchievementList = function (callback) {
            $http.get(StudentConstants.URL_ACHIEVEMENTS, {
                headers: {'x-token': Account.getToken()}
            }).then(function (res) {
                achievementList = res.data;
                callback(null, achievementList);
            }, function (res) {
                callback(res);
            });
        };
        /**
         * Achievement Array
         [{
        "_id": "581f2222d3a9869000a3d85e",
        "lTime": "2016-11-06T12:29:30.116Z",
        "cTime": "2016-11-06T12:29:22.561Z",
        "userID": "10140000",
        "quizID": "581f21d8d3a9869000a3d85b",
        "__v": 1,
      }]
         * @param callback
         * @returns {*}
         */
        self.getAchievementList = function (callback) {
            if (achievementList) {
                return callback(null, achievementList);
            }
            self.flushAchievementList(callback);
        };
        self.setCurrentAchievement = function (value) {
            currentAchievement = value;
        };
        self.getCurrentAchievement = function () {
            return currentAchievement;
        };
        /**
         * Get achievementID;
         * @param achievementID{String} AchievementID
         * @param callback Callback.
         {
          "_id": "581f2222d3a9869000a3d85e",
          "lTime": "2016-11-06T12:29:30.116Z",
          "cTime": "2016-11-06T12:29:22.561Z",
          "userID": "10140000",
          "quizID": "581f21d8d3a9869000a3d85b",
          "__v": 1,
          "questionDetails": []
        }
         */
        self.getAchievementDetail = function (achievementID, callback) {
            $http.get(StudentConstants.URL_ACHIEVEMENTS + '/' + achievementID, {
                headers: {'x-token': Account.getToken()}
            }).then(function (res) {
                callback(null, res.data);
            }, function (res) {
                callback(res);
            });
        };
        /**
         * Submit answers.
         *
         * req-body example.
         {
            "answers": [[
                false, false, true, false
              ], [
                false, false, true, false
              ], [
                false, false, true, false
              ]]
          }
         Response: Achievement Object.
         *
         * @param achievementID Achievement ID.
         * @param answers{Array} Answers.
         * @param callback Callback
         */
        self.submitAchievementDetail = function (achievementID, answers, callback) {
            $http.patch(StudentConstants.URL_ACHIEVEMENTS + '/' + achievementID, {
                answers: answers
            }, {
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
        $stateProvider.state('student.qa', {
            url: '/qa',
            templateUrl: 'app/student/qa/qa.html',
            controller: 'qaCtrl'
        })
    })
    .controller('qaCtrl', function ($scope, $mdSidenav, $state, $location, Account, $mdToast, $mdDialog,
                                    studentFactory, $log, studentAchievementFactory, studentQuizFactory) {
        if (!Account.checkCredit(1)) {
            return $location.path('/login');
        }
        $scope.paperVisible = false;
        $scope.questionVisible = false;
        $scope.currentPaper = null;
        $scope.currentQuestion = null;
        $scope.alphabet=function (i) {
            return String.fromCharCode("A".charCodeAt(0)+i);
        };

        $scope.backToList = function () {
            $scope.paperVisible = false;
            $scope.currentPaper = null;
        }
        $scope.backToPaper = function () {
            $scope.questionVisible = false;
            $scope.currentQuestion = null;
        }
        $scope.preQuestion = function () {
            var temp = $scope.currentQuestion;
            temp = temp > 0 ? temp - 1 : 0;
            $scope.backToPaper();
            $scope.currentQuestion = temp;
            $scope.questionVisible = true;
        }
        $scope.nextQuestion = function () {
            var temp = $scope.currentQuestion;
            temp = temp < $scope.questionNum - 1 ? temp + 1 : $scope.questionNum - 1;
            $scope.backToPaper();
            $scope.currentQuestion = temp;
            $scope.questionVisible = true;
        }
        // $scope.closeToast = function() {
        //     $mdToast.hide();
        //     $scope.paperVisible = true;
        // }
        // $scope.showCustomToast = function(index) {
        //   $scope.currentPaper = index;
        //   $mdToast.show({
        //     hideDelay   : 3000,
        //     position    : 'top right',
        //     controller  : 'qaCtrl',
        //     templateUrl : 'app/student/qa/toast-template.html'
        //   });
        // }
        studentFactory.getCourseList(function (err, list) {
            if (err == null) {
                $scope.courseList = list;
                // if($scope.courseList[0] != null) {
                //   var id = $scope.courseList[0]._id;
                //   studentFactory.setCurrentCourse(id);
                // }
            }
            else Account.showAlert('错误', '无法获得课程列表');
        });
        $scope.switchPaper = function (idx) {
            $scope.paperVisible = true;
            var quiz = $scope.quizList[idx];
            var quizID = $scope.quizList[idx]._id;
            try {
                if (+new Date < quiz.from) return Account.showToast('', '问答还没开始');
            } catch (err) {
            }
            studentFactory.joinAQuiz(studentFactory.getCurrentCourse(), quizID, function (err, res) {
                if (err == null) {
                    $scope.achID = res._id;
                    var ansConst;
                    studentAchievementFactory.getAchievementDetail($scope.achID, function (err, res) {
                            if (err == null) {
                                console.log(res);
                                $scope.questions = res.questionDetails;
                                $scope.questionNum = $scope.questions.length;
                                $scope.answer = [];
                                //deal with the teacher's answer in questions
                                if($scope.questions.length&&$scope.questions[0].answers)
                                    $scope.questions=$scope.questions.map(function (item) {
                                        console.log('in maping answers',item);
                                        var alphaArr= [];
                                        if(item.answers.length&&typeof(item.answers[0])=='boolean'){
                                            for(var i = 0 ; i< item.answers.length;i++){
                                                if(item.answers[i])alphaArr.push(String.fromCharCode("A".charCodeAt(0)+i));
                                            }
                                            item.answers=alphaArr;
                                            return item;
                                        }
                                        else return item;
                                    });


                                //deal with the student answers
                                if (res.answers) {
                                    $scope.answer = res.answers;
                                }
                                else for (var i = 0; i < $scope.questions.length; i++) {
                                    $scope.answer.push([]);
                                    if ($scope.questions[i].type == 1) ansConst = false;
                                    else ansConst = '';
                                    for (var j = 0; j < $scope.questions[i].extras.length; j++) {
                                        $scope.answer[i].push(ansConst);
                                    }
                                }
                            }
                            else {
                                Account.showAlert('', "无法读取题目，请重试");
                            }
                        }
                    )
                }
                else $scope.questions = [];

            })
        };

        $scope.switchCourse = function (course) {
            studentFactory.setCurrentCourse(course);
            studentFactory.getCourseQuizzesList(studentFactory.getCurrentCourse(), function (err, list) {
                if (err == null) {
                    $scope.quizList = list;
                    if (!list.length) Account.showToast('', '该课程还没有问答');
                }
            });
        };
        $scope.switchCourse(studentFactory.getCurrentCourse());
        $scope.courseSelected = studentFactory.getCurrentCourseName();
        $scope.switchQuestion = function (index) {
            $scope.questionVisible = true;
            $scope.currentQuestion = index;
        };
        $scope.submitQuiz = function () {
            var confirm = $mdDialog.confirm()
                .title('确认交卷吗？')
                .textContent('只能提交一次')
                .ariaLabel('Lucky day')
                .ok('确定')
                .cancel('取消');

            $mdDialog.show(confirm).then(function () {
                studentAchievementFactory.submitAchievementDetail($scope.achID, $scope.answer, function (err, res) {
                    if (err == null) Account.showAlert('成功', '提交成功');
                    else Account.showAlert('错误', '已经提交过');
                })
                console.log($scope.answer)
            }, function () {
            });
        }
        $scope.backToClass = function () {
            $state.go('student.class');
        }
    })