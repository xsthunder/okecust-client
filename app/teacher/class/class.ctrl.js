/**
 * Created by YY on 2016/11/16.
 */
(function () {
  angular.module('teacher')
    .controller('teacherClassesCtrl', function ($scope, teacherFactory, TeacherCourse) {
      var onDataCallback = function (err, courses) {
        if (err) {
          return alert('Error getting courses list.');
        }
        $scope.courses = courses;
      };
      teacherFactory.getCourseList(onDataCallback);
      $scope.selectCourse = function (course) {
        teacherFactory.setCurrentCourse(course);
      };
      $scope.btnTargetNewCourse = function () {
        TeacherCourse.setActiveCourse({name: ''});
      };
      $scope.btnUpdateCourse = function (course) {
        TeacherCourse.setActiveCourse(course);
      };
      $scope.btnRemoveCourse = function (course) {
        var confirmed = confirm('Remove this course?');
        if (confirmed) {
          TeacherCourse.removeCourse(course._id, function (err, course) {
            if (err) {
              return alert('failed to delete course: ' + err.data);
            }
            teacherFactory.flushCourseList(onDataCallback);
            alert('Course deleted!');
          });
        }
      };
    });
})();