/**
 * Created by YY on 7/22/2016.
 */
angular.module('student.person', ['ui.router', 'account'])
.config(function ($stateProvider) {
  $stateProvider.state('student.person', {
    url: '/person',
    templateUrl: 'app/student/person/person.html',
    controller: function ($scope, $location, Account) {
        console.log('init student ctrl');
        $scope.logout = function () {
            console.log('要推出了');
            Account.deleteCredit();
            $location.path('/login');
        };

    }
  })
});
    // .controller('personCtrl', );
