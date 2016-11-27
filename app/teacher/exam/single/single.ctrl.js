/**
 * Created by YY on 2016/11/21.
 */
(function () {
  angular.module('teacher.exam.single')
    .controller('singleCtrl', ctrl);
  function ctrl(singleFactory, $log, $scope) {
    $log.info('this is exam single ctrl');
    var question = {
      type: 1,
      extras: [],
      answers: [false, false, false, false]
    };
    $scope.question = question;
    $scope.submit = function () {
      $log.log($scope.answer);
      $log.info('this is qa');
      question.answers[$scope.answer - 'A'] = true;
      $log.log(question);
      singleFactory.createAQuestion(question, function (error, res) {
        if (!error) $log.info(res);
      });
    }
  }
})();