/**
 * Created by YY on 2016/11/16.
 */
(function () {
  angular.module('teacher.nameList')
    .controller('nameListCtrl', ctrl);
  function ctrl($scope, $log, TeacherCourse, teacherFactory, headerFactory, $state) {
    $log.info('nameList init');
    $log.info(teacherFactory.getCurrentCourse());
    teacherFactory.getCourseList(function (error, res) {
      if (!error) $log.info(res);
    });
    TeacherCourse.getCourseStudents(teacherFactory.getCurrentCourse()._id, function (error, res) {
      $log.info(res);
      var arr = [];
      for (var i = 0; i < res.length; i++) {
        arr.push(res[i].uid + ' ' + res[i].name);
      }
      $scope.list = arr;
    });
    $scope.click = function () {
      headerFactory.setTitle('添加学生名单');
      $state.go('teacher.nameListAdd');
    }
  }
})();