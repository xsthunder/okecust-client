/**
 * Created by YY on 2016/11/27.
 */
(function () {
  angular.module('teacher.qa.add')
    .factory('qaAddDetailFactory', fact);
  function fact($http, Account, TeacherConstants, $log) {
    $log.log('factory init');
    var self = {};
    var questionLibrary;
    self.flushQuestionLibrary = function (libraryID, callback) {
      $http.get(TeacherConstants.URL_LIBRARIES + '/' + libraryID, {
        headers: {'x-token': Account.getToken()}
      }).then(function (res) {
        questionLibrary = res.data;
        callback(null, questionLibrary);
      }, function (res) {
        callback(res);
      });
    };
    self.getQuestionLibrary = function (libraryID, callback) {
      if (questionLibrary) {
        return callback(null, questionLibrary);
      }
      self.flushQuestionLibrary(libraryID, callback);
    };
    var questionLibraryQuestions;
    self.flushQuestionLibraryQuestion = function (libraryID, callback) {
      $http.get(TeacherConstants.URL_LIBRARIES + '/' + libraryID + '/questions', {
        headers: {'x-token': Account.getToken()}
      }).then(function (res) {
        questionLibraryQuestions = res.data;
        callback(null, questionLibraryQuestions);
      }, function (res) {
        callback(res);
      });
    };

    self.getQuestionLibraryQuestion = function (libraryID, callback) {
      //FIXME 谁乱缓存导致列表更新不了。。。
      // if (questionLibraryQuestions) {
      //   return callback(null, questionLibraryQuestions);
      // }
      self.flushQuestionLibraryQuestion(libraryID, callback);
    };
    return self;
  }
})();