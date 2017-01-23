/**
 * Created by YY on 7/22/2016.
 */
angular.module('student.class', ['ui.router'])
  .config(function ($stateProvider) {
    $stateProvider.state('student.class', {
      url: '/class',
      templateUrl: 'app/student/class/class.html',
      controller: 'classCtrl'
    })
  })
  .controller('classCtrl', function($scope, $log, Account,studentFactory){
    studentFactory.getCourseList(function(err, list){
      if(err == null) {
        $scope.courseList = list;
      }
      else Account.showlert('错误','无法获得课程列表');
    });
    $scope.setCourse = function(idx) {
      var id = $scope.courseList[idx]._id;
      studentFactory.setCurrentCourse(id);
    }
  });
   
