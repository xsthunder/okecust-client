/**
 * Created by YY on 2016/11/12.
 */
(function () {
  angular.module('teacher.person').controller('personCtrl', personCtrl);
  function personCtrl($location, Account) {
    var vm = this;
    vm.logout = function () {
      Account.deleteCredit();
      //location.reload();
      $location.path('/login');
    }
  }
})();
