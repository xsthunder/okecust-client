/**
 * Created by YY on 2016/11/28.
 */
(function () {
  angular.module('login')
    .controller('loginCtrl', ctrl);
  function ctrl($scope, $location, Account, $log, $state) {
    $scope.username = '';
    $scope.password = '';
    $scope.login = function () {
      if ('' === $scope.username || '' === $scope.password) {
        return alert('not available input');
      }
      Account.login($scope.username, $scope.password, function (err, res) {
        if (null !== err) {return alert('Failed to login, check your id and password! ' + err.status);}
        Account.setCredit(res);
        var type = res.type;
        if (type == 7) {
          $location.path('/admin');
        } else if (type == 1) {
          $log.info('student');
          $state.go('student');
        } else if (type == 2) {
          $location.path('/teacher/qa');
        }
      });
    };
    $scope.showQR = false;
    $scope.switchQR = function() {
      $scope.showQR = !$scope.showQR;
    }
  }
})();