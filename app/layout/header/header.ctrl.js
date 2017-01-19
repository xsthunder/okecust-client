/**
 * Created by YY on 2016/11/26.
 */
(function () {
  angular.module('layout.header')
    .controller('layoutHeaderCtrl', ctrl);
  function ctrl($scope, headerFactory, $log) {
    $log.info('header' + headerFactory.title);
    $scope.title = headerFactory.title;
  }
})();