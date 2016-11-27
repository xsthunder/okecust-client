/**
 * Created by Fisher at 23:53 on 10/08/2016.
 */
angular.module('teacher.quizModel.detail', [
    'ui.router',
    'teacher'
])
  .config(function ($stateProvider) {
    $stateProvider.state('teacher.quizModelDetail', {
        url: '/quizModel/detail',
        views: {
            'header': {
                templateUrl: 'app/layout/header/header2.html',
                controller: 'teacherHeaderCtrl'
            },
            'main': {
                templateUrl: 'app/teacher/quizModel/detail/quizModelDetail.html',
                controller: 'teacherQuizModelDetailCtrl'
            }
        }
    })
})
  .factory('TeacherQuizModelDetail', function ($http, Account, TeacherConstants, TeacherQuizModelConstants) {
    var self = {};
    /**
     * Quiz Model object.
     {
       "_id": "581c4b29d265c6b4441109dd",
       "lTime": "2016-11-06T09:22:30.230Z",
       "cTime": "2016-11-04T08:47:37.218Z",
       "description": "",
       "author": "250",
       "name": "线性代数-第二章",
       "__v": 1,
       "questions": [
         "57cbdd38f3ae1d4b4f1126dd",
         "57f92006ff19051e5b81b4c1",
         "57e7f625c2a982ff466c6c0d"
       ]
     }
     */
    var quizModel;
    /**
     * Flush quiz-model detail.
     */
    self.flushQuizModel = function (modelID, callback) {
        $http.get(TeacherQuizModelConstants.URL_MODELS + '/' + modelID, {
            headers: {'x-token': Account.getToken()}
        }).then(function (res) {
            quizModel = res.data;
            callback(null, quizModel);
        }, function (res) {
            callback(res);
        });
    };
    /**
     * Get quiz-model detail.
     */
    self.getQuizModel = function (modelID, callback) {
        if (quizModel) {
            return callback(null, quizModel);
        }
        self.flushQuizModel(modelID, callback);
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
    var quizModelQuestions;
    /**
     * Flush quiz-model questions detail.
     */
    self.flushQuizModelQuestion = function (modelID, callback) {
        $http.get(TeacherQuizModelConstants.URL_MODELS + '/' + modelID + '/questions', {
            headers: {'x-token': Account.getToken()}
        }).then(function (res) {
            quizModelQuestions = res.data;
            callback(null, quizModelQuestions);
        }, function (res) {
            callback(res);
        });
    };
    /**
     * Get question-model questions detail.
     */
    self.getQuizModelQuestion = function (modelID, callback) {
        if (quizModelQuestions) {
            return callback(null, quizModelQuestions);
        }
        self.flushQuizModelQuestion(modelID, callback);
    };
    return self;
})
  .controller('teacherQuizModelDetailCtrl', function ($scope, TeacherQuizModel, TeacherQuizModelDetail) {
    var model = TeacherQuizModel.getActiveQuizModel();
    console.log(model);
    TeacherQuizModelDetail.getQuizModelQuestion(model._id, function (err, questions) {
        if(err){return alert('some error: '+err);}
        console.log(questions);
    })
});