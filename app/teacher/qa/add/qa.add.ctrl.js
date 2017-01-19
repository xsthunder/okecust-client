/**
 * Created by YY on 2016/11/27.
 */
(function () {
  angular.module('teacher.qa.add')
    .controller('teacherQaAddCtrl', ctrl);
  function ctrl($scope, $mdDialog, teacherFactory, qaAddDetailFactory, teacherQuizFactory, $log, TeacherCourse) {
    $log.info('teacherQaAddCtrl init');
    $scope.newQuizTitle = '';
    $scope.deleteClcik = showDialog;
    function showDialog() {
      $mdDialog.show({
        templateUrl: 'app/layout/dialog/dialog.html',
        controller: function DialogController($scope, $mdDialog) {
          $scope.closeDialog = function () {
            $mdDialog.hide();
          }
        }
      });
    }
    var library = qaAddDetailFactory;
    var id1 = '581f3306d3a9869000a3d862'; //计算机基础id
    var courseId = teacherFactory.getCurrentCourse()._id;

    //id1 = '581f32edd3a9869000a3d861';
    var id2 = '725efd44e34c9ea8730645c90454fd4a'; //线代id
    TeacherCourse.getCorrespondingLibrary(courseId, function (error, res) {
      if (error) {
        alert('error');
      } else {
        $log.info(res);
        library._id = res._id;
      }
    });
    qaAddDetailFactory.getQuestionLibraryQuestion(library._id, function (err, questions) {
      if(err) {
        return alert('some error: '+err);
      }
      //console.log(questions);
      $scope.questions = questions;
    });
    //获取选择条目部分
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
  }
})();