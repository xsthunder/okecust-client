/**
 * Created by YY on 2016/11/16.
 */
(function () {
  angular.module('teacher.exam')
    .config(function ($stateProvider) {
      $stateProvider.state('teacher.exam.single',
        {
          url: '/single',
          templateUrl: 'app/teacher/exam/single/single.html',
          controller: 'singleCtrl'
        })
        .state('teacher.exam.2', {
          url: '/2',
          templateUrl: 'app/teacher/exam/2.html'
        })
        .state('teacher.exam.3', {
          url: '/3',
          templateUrl: 'app/teacher/exam/3.html'
        })
    })
})();