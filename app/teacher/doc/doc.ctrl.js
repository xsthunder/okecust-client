/**
 * Created by YY on 2016/11/26.
 */
(function () {
  angular.module('teacher.doc')
    .controller('teacherDocCtrl', ctrl);
  function ctrl($scope, $log, $state) {
    $scope.list = ['1', '2', '3', '4', '5'];
    $scope.click = function () {
      $log.info('click');
      $state.go('teacher.docAdd');
    }
  }
})();