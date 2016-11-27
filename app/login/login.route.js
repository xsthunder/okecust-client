/**
 * Created by YY on 2016/11/28.
 */
(function () {
  angular.module('login')
    .config(config);
  function config($stateProvider) {
    $stateProvider.state('login', {
        url: "/login",
        templateUrl: "app/login/login.html",
        controller: 'loginCtrl'
      }
    )
  }
})();