/**
 * Created by YY on 2016/11/26.
 */
(function () {
  angular.module('teacher.nameList')
    .config(config);
  function config($stateProvider) {
    $stateProvider.state('teacher.nameListAdd', addRoute);
  }

  var addRoute = {
    url: '/add',
    views: {
      'header': {
        templateUrl: 'app/layout/header/header.html',
        controller: 'layoutHeaderCtrl'
      },
      'main': {
        templateUrl: 'app/teacher/nameList/add/add.html',
        controller: 'nameListAddCtrl'
      }
    }
  }
})();