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
        .state('teacher.exam.multiply', {
          url: '/multiply',
          templateUrl: 'app/teacher/exam/multiply/multiply.html',
            controller:'multiplyCtrl'
        })
        .state('teacher.exam.lookup', {
          url: '/lookup',
          templateUrl: 'app/teacher/exam/lookup/lookup.html',
            controller:'lookupCtrl'
        })
    })
})();