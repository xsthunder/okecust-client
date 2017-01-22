/**
 * Created by YY on 2016/11/28.
 */
(function () {
  angular.module('login')
    .controller('loginCtrl', ctrl);
  function ctrl($scope,$mdDialog, $location, Account, $log, $state) {
      var showAlert = function (title, message) {
          // Appending dialog to document.body to cover sidenav in docs app
          // Modal dialogs should fully cover application
          // to prevent interaction outside of dialog
          $mdDialog.show(
              $mdDialog.alert()
                  .parent(angular.element(document.querySelector('#popupContainer')))
                  .clickOutsideToClose(true)
                  .title(title)
                  .textContent(message)
                  .ariaLabel('Alert Dialog Demo')
                  .ok('明白')
          );
      };

      $scope.username = '';
    $scope.password = '';
    $scope.login = function () {
      if ('' === $scope.username || '' === $scope.password) {
        return showAlert('错误',"输入不能为空");
      }
      Account.login($scope.username, $scope.password, function (err, res) {
        if (null !== err) {return showAlert("无法登陆",'请检查账号或密码');}
        Account.setCredit(res);
        var type = res.type;
        if (type == 7) {
          $location.path('/admin');
        } else if (type == 1) {
          $log.info('student');
          $state.go('student');
        } else if (type == 2) {
          $location.path('/teacher/person');
        }
      });
    };
    $scope.showQR = false;
    $scope.switchQR = function() {
      $scope.showQR = !$scope.showQR;
    }
  }
})();