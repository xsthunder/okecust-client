/**
 * Created by YY on 7/22/2016.
 */
angular.module('student.doc', ['ui.router'])
    .config(function ($stateProvider) {
      $stateProvider
          .state('student.doc', {
            url: '/doc',
            templateUrl: 'app/student/doc/doc.html'
          })
    });
// .controller('docCtrl', function ($scope) {
//   $scope.text = '这是课件页面 test test';
// });