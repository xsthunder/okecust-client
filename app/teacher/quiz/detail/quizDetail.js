/**
 * Created by Fisher at 23:53 on 10/08/2016.
 */
angular.module('teacher.quiz.detail', [
    'ui.router',
    'teacher'
])
  .config(function ($stateProvider) {
    $stateProvider.state('teacher.quizDetail', {
        url: '/quiz/detail',
        views: {
            'header': {
                templateUrl: 'app/layout/header/header2.html',
                controller: 'teacherHeaderCtrl'
            },
            'main': {
                templateUrl: 'app/teacher/quiz/detail/quizDetail.html',
                controller: 'teacherQuizDetailCtrl'
            }
        }
    })
})
  .factory('TeacherQuizDetail', function ($http, Account, TeacherConstants, TeacherQuizConstants) {
    var self = {};

    var quiz;
    /**
     * Flush quiz detail.
     */
    self.flushQuiz = function (quizID, callback) {
        $http.get(TeacherConstants.URL_QUIZZES + '/' + quizID, {
            headers: {'x-token': Account.getToken()}
        }).then(function (res) {
            quiz = res.data;
            callback(null, quiz);
        }, function (res) {
            callback(res);
        });
    };
    /**
     * Get quiz detail.
     */
    self.getQuiz = function (quizID, callback) {
        if (quiz) {
            return callback(null, quiz);
        }
        self.flushQuiz(quizID, callback);
    };
    /**
     * @type{Array} Question array.
     *
     Question:
     {
    "_id": "581c81b68dc96e4462d3cc4c",
    "lTime": "2016-11-04T12:40:22.757Z",
    "cTime": "2016-11-04T12:40:22.757Z",
    "author": "250",
    "type": 1,
    "__v": 0,
    "answers": [
      false,
      false,
      true,
      false
    ],
    "extras": [
      "控制器和运算器",
      "控制器和存储器",
      "CPU和控制器",
      "运算器和I/O接口"
    ],
    "name": "在微型计算机中，微处理器芯片上集成的是"
  }
     */
    var quizQuestions;
    /**
     * Flush quiz questions detail.
     */
    self.flushQuizQuestion = function (quizID, callback) {
        $http.get(TeacherConstants.URL_QUIZZES + '/' + quizID + '/questions', {
            headers: {'x-token': Account.getToken()}
        }).then(function (res) {
            quizQuestions = res.data;
            callback(null, quizQuestions);
        }, function (res) {
            callback(res);
        });
    };
    /**
     * Get quiz questions detail.
     */
    self.getQuizQuestion = function (quizID, callback) {
        if (quizQuestions) {
            return callback(null, quizQuestions);
        }
        self.flushQuizQuestion(quizID, callback);
    };
    return self;
})
  .controller('teacherQuizDetailCtrl', function ($scope, Account,TeacherQuiz, TeacherQuizDetail) {
    var quiz = TeacherQuiz.getActiveQuiz();
    console.log(quiz);
    TeacherQuizDetail.getQuizQuestion(quiz._id, function (err, questions) {
        if(err){return Account.showToast('成功','some error: '+err);}
        console.log(questions);
    })
});