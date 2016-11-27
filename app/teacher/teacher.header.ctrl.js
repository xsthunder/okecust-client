/**
 * Created by YY on 2016/11/12.
 */
(function () {
  angular.module('teacher').controller('teacherHeaderCtrl', teacherHeaderCtrl);
  function teacherHeaderCtrl($scope, teacherFactory, $log) {
    teacherFactory.getCourseList(function (err, courses) {
      $scope.courses = courses;
    });
    var empty_course=1;
    var old_course;
      $scope.selectedCourse = teacherFactory.getCurrentCourse();
        $scope.$watch('selectedCourse', function (newValue) {
            teacherFactory.setCurrentCourse(newValue);
            if(empty_course===1) {
                //location.reload();
                empty_course=newValue;//init empty_course
            }
            if(newValue!==empty_course){
              if(newValue!==old_course){
                old_course=newValue;
                location.reload();
              }
            }
        });
  }
})();