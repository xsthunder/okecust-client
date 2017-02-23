/**
 * Created by YY on 2016/11/16.
 */
(function () {
  angular.module('teacher.exam')
    .controller('teacherExamCtrl', ctrl);
  function ctrl($log, $scope,$state) {
    $state.go("teacher.exam.single")
  }
})();