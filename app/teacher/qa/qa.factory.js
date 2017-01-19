/**
 * Created by YY on 2016/11/16.
 */
(function () {
  angular.module('teacher.qa')
    .factory('teacherQaFactory', function ($http, TeacherConstants, Account) {
      var self = {};
      self.nowQuiz = null;

      /**
       * Get quiz report.
       */
      self.getQuizReport = function (quizId, callback) {
        $http.get(TeacherConstants.URL_BASE + '/quizzes/' + quizId + '/reports', {
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