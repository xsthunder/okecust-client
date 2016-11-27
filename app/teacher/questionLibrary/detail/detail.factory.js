/**
 * Created by YY on 2016/11/27.
 */
(function () {
  angular.module('teacher.questionLibrary.detail')
    .factory('TeacherQuestionLibraryDetail', fact);
  function fact($http, Account, TeacherConstants, TeacherQuestionLibraryConstants) {
    var self = {};
    /**
     * Question Library object.
     {
          "_id": "581c48844a95371a43dc9b5b",
          "lTime": "2016-11-04T08:36:20.254Z",
          "cTime": "2016-11-04T08:36:20.254Z",
          "description": "",
          "author": "250",
          "name": "线性代数-第二章",
          "__v": 0,
          "questions": []
        }
     */
    var questionLibrary;
    /**
     * Flush question-library detail.
     */
    self.flushQuestionLibrary = function (libraryID, callback) {
      $http.get(TeacherQuestionLibraryConstants.URL_LIBRARIES + '/' + libraryID, {
        headers: {'x-token': Account.getToken()}
      }).then(function (res) {
        questionLibrary = res.data;
        callback(null, questionLibrary);
      }, function (res) {
        callback(res);
      });
    };
    /**
     * Get question-library detail.
     */
    self.getQuestionLibrary = function (libraryID, callback) {
      if (questionLibrary) {
        return callback(null, questionLibrary);
      }
      self.flushQuestionLibrary(libraryID, callback);
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
    var questionLibraryQuestions;
    /**
     * Flush question-library questions detail.
     */
    self.flushQuestionLibraryQuestion = function (libraryID, callback) {
      $http.get(TeacherQuestionLibraryConstants.URL_LIBRARIES + '/' + libraryID + '/questions', {
        headers: {'x-token': Account.getToken()}
      }).then(function (res) {
        questionLibraryQuestions = res.data;
        callback(null, questionLibraryQuestions);
      }, function (res) {
        callback(res);
      });
    };
    /**
     * Get question-library questions detail.
     */
    self.getQuestionLibraryQuestion = function (libraryID, callback) {
      if (questionLibraryQuestions) {
        return callback(null, questionLibraryQuestions);
      }
      self.flushQuestionLibraryQuestion(libraryID, callback);
    };
    /**
     * Create a single question or several question.
     * Questions are not deletable or editable.
     *
     * @param questions{Object|Array} Instances of questions.
     * @param callback{Function} Callback.
     *
     * Request:  Question object or question array.
     [{
        "type": 1,    // @see README.md
        "name": "在微型计算机中，微处理器芯片上集成的是",
        "extras": ["控制器和运算器", "控制器和存储器", "CPU和控制器", "运算器和I/O接口"],
        "answers": [false, false, true, false]
       }]

     Response: Question object or question array.
     [{
         "__v": 0,
         "lTime": "2016-11-15T10:13:52.974Z",
         "cTime": "2016-11-15T10:13:52.974Z",
         "_id": "582adfe037b9e4d0033336d1",
         "author": "250",
         "type": 1,
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
     }]
     */
    // Parameter `questions` could be a question object or questions array.
    self.createQuestions = function (questions, callback) {
      $http.post(TeacherConstants.URL_QUESTIONS, questions, {
        headers: {'x-token': Account.getToken()}
      }).then(function (res) {
        callback(null, res.data);
      }, function (res) {
        callback(res);
      });
    };
    return self;
  }
})();