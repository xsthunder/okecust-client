/**
 * Created by YY on 7/22/2016.
 */
angular.module('student.person', ['ui.router', 'account'])
.config(function ($stateProvider) {
  $stateProvider.state('student.person', {
    url: '/person',
    templateUrl: 'app/student/person/person.html',
    controller: 'personCtrl'
  })
})
    .controller('personCtrl', function ($scope, $location, deleteCredit) {
      $scope.logout = function () {
        deleteCredit();
        $location.path('/login');
      };
    });
