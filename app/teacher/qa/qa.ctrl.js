/**
 * Created by YY on 2016/11/16.
 */
(function () {
  angular.module('teacher.qa')
    .controller('teacher.qa.ctrl', function ($scope, teacherQuizFactory, $log, $state,TeacherCourse,teacherFactory) {
      // teacherQuizFactory.getQuizList(function (error, res) {
      //   if (!error) {
      //     $scope.QAitems = res;
      //     // $log.log(res);
      //   }
      // });
      TeacherCourse.getQuizListFromCourse(teacherFactory.getCurrentCourse()._id,function (error,res) {
            if (!error) {
                $scope.QAitems = res;
                $log.log(res);
                $log.log('正在获取的问答所属的课程ID',teacherFactory.getCurrentCourse()._id);
            }
      });
        // end by xs
      $scope.selectQuiz = function (quiz) {
        teacherQuizFactory.nowQuiz = quiz;
        //console.log(teacherQuizFactory.nowQuiz);
        $state.go('teacher.qaReport')
      }
    });
})();