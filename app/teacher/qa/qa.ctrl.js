/**
 * Created by YY on 2016/11/16.
 */
(function () {
  angular.module('teacher.qa')
    .controller('teacher.qa.ctrl', function ($scope, teacherQuizFactory, $log, $state,TeacherCourse,teacherFactory) {
      TeacherCourse.getQuizListFromCourse(teacherFactory.getCurrentCourse()._id,function (error,res) {
            if (!error) {
                $scope.QAitems = res;
            }
      });
      $scope.selectQuiz = function (quiz) {
        teacherQuizFactory.nowQuiz = quiz;
        $state.go('teacher.qaReport')
      }
    });
})();