/**
 * Created by YY on 2016/11/21.
 */
(function () {
  angular.module('teacher.exam.single')
    .controller('singleCtrl', ctrl);
  function ctrl(singleFactory, $log, $scope, TeacherCourse, teacherFactory, TeacherQuestionLibraryDetail) {
    $log.info('this is exam single ctrl');
    var question = {
      type: 1,
      extras: [],
      answers: [false, false, false, false]
    };
    var libId;
    TeacherCourse.getCorrespondingLibrary(teacherFactory.getCurrentCourse()._id, function (error, res) {
      $log.info(res);
      libId = res._id;
      $scope.question = question;
      $scope.submit = function () {
        $log.log($scope.answer);
        $log.info('this is qa');
        question.answers[$scope.answer - 'A'] = true;
        $log.log(question);
        TeacherQuestionLibraryDetail.createQuestions(libId, question, function (error, res) {
          if (error) {
            return alert(error);
          }
          $log.info(res);
        })
      }
    });
  }
})();