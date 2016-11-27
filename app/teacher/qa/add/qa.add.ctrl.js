/**
 * Created by YY on 2016/11/27.
 */
(function () {
  angular.module('teacher.qa.add')
    .controller('teacherQaAddCtrl', ctrl);
  function ctrl($log, $scope, $mdDialog, teacherFactory, TeacherCourse, qaAddDetailFactory, teacherQuizFactory) {
    $log.info('teacherQaAddCtrl init');
    $scope.newQuizTitle = '';
    $scope.deleteClcik = showDialog;
    function showDialog() {
      $mdDialog.show(
        {
          templateUrl: 'app/layout/dialog/dialog.html',
          controller: function DialogController($scope, $mdDialog) {
            $scope.closeDialog = function () {
              $mdDialog.hide();
            }
          }
        });
      var questionLibrary;
      TeacherCourse.getCorrespondingLibrary(teacherFactory.getCurrentCourse()._id, function (error, res) {
        if (error) {
          alert("somethinh errororrrrrrrrrrrrrrrrr");
          return;
        }
        questionLibrary = res;
        console.log(teacherFactory.getCurrentCourse()._id, '对应题库ID', id1);
        qaAddDetailFactory.getQuestionLibraryQuestion(questionLibrary._id, function (err, questions) {
        if (err) {
          return alert('some error: ' + err);
         }
          $scope.questions = questions;
        });
      });
      var sss;
      $scope.selected = [];
      $scope.questionSelected = function (item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) {
          list.splice(idx, 1);
        } else {
          list.push(item);
        }
        sss = list;
      };
      $scope.submit = function (title) {
        $log.log('init submit');
        $log.log(title);
        $log.log('sss' + sss);
        teacherQuizFactory.createNewQuiz(courseId, {'name': title, 'questions': sss}, function (error, data) {
          $log.log(error);
          $log.log(data);
        });
      };
    };
  }
})();