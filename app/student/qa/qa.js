/**
 * Created by YY on 7/22/2016.
 */
angular.module('student.qa', [
  'account',
  'ui.router',
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
  /**
   * Quiz Array
   [{
    "_id": "581f063bbde445e00f71581a",
    "lTime": "2016-11-06T10:31:02.808Z",
    "cTime": "2016-11-06T10:30:19.388Z",
    "author": "250",
    "quizID": "581eff94bde445e00f71580d",
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
  }]
   * @param callback
   * @returns {*}
   */
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
.controller('qaCtrl', function($scope, $mdSidenav, $location, Account, $mdToast, $mdDialog,
studentFactory, $log, studentAchievementFactory, studentQuizFactory
){
  if (!Account.checkCredit(1)) {
    return $location.path('/login');
  }
  $scope.paperVisible = false;
  $scope.questionVisible = false;
  $scope.currentPaper = null;
  $scope.currentQuestion = null;
  $scope.backToList = function() {
    $scope.paperVisible = false;
    $scope.currentPaper = null;
  }
  $scope.backToPaper = function() {
    $scope.questionVisible = false;
    $scope.currentQuestion = null;
  }
  $scope.preQuestion = function() {
    var temp = $scope.currentQuestion;
     temp = temp > 0 ? temp - 1 : 0;
    $scope.backToPaper();
    $scope.currentQuestion = temp;
    $scope.questionVisible = true;
  }
  $scope.nextQuestion = function() {
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
    studentFactory.getCourseList(function(err, list){
        if(err == null) {
          $scope.courseList = list;
          // if($scope.courseList[0] != null) {
          //   var id = $scope.courseList[0]._id;
          //   studentFactory.setCurrentCourse(id);
          // }
        }
        else alert('error');
      });
    $scope.switchPaper = function(idx) {
      $scope.paperVisible = true;
      var quizID = $scope.quizList[idx]._id;
      studentFactory.joinAQuiz(studentFactory.getCurrentCourse(), quizID, function(err, res) {
        if(err == null) {
          $scope.achID = res._id;
          studentAchievementFactory.getAchievementDetail($scope.achID, function(err, res) {
            if(err == null) {
              $scope.questions = res.questionDetails;
              $scope.questionNum = $scope.questions.length;
              $scope.answers=[];
            }
            else alert("error");
          })
        }
      })
    }
    $scope.switchCourse = function(idx) {
      var id = $scope.courseList[idx]._id;
      studentFactory.setCurrentCourse(id);
      studentFactory.getCourseQuizzesList(studentFactory.getCurrentCourse(), function(err, list) {
        if(err == null) {
          $scope.quizList = list;
        }
      });
    }
    $scope.switchQuestion = function(index) {
      $scope.questionVisible = true;
      $scope.currentQuestion = index;
    }
    $scope.submitQuiz = function() {
      var c = confirm('确认交卷吗？（只能提交一次）');
      if(!c) {
        return;
      }
      var ans = [];
      for(var i = 0; i < $scope.answers.length; i++) {
        ans[i] = [];
        for(var j = 0; j < $scope.questions[i].extras.length; j++) {
          ans[i][j] = false;
        }
        if($scope.answers[i] != null) ans[i][$scope.answers[i]] = true;
      }
      studentAchievementFactory.submitAchievementDetail($scope.achID, ans, function(err, res) {
        if(err == null) alert('提交成功');
        else alert('已经提交过');
      })
      $log.log(ans);
    }
})