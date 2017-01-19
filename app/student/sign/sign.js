/**
 * Created by YY on 7/22/2016.
 */
angular.module('student.sign', ['ui.router'])
.config(function ($stateProvider) {
  $stateProvider.state('student.sign', {
    url: '/sign',
    templateUrl: 'app/student/sign/sign.html'
  })
});