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

    var id1 = '581f3306d3a9869000a3d862'; //计算机基础id
    var courseId = teacherFactory.getCurrentCourse()._id;

    //id1 = '581f32edd3a9869000a3d861';
    var id2 = '725efd44e34c9ea8730645c90454fd4a'; //线代id
    TeacherCourse.getCorrespondingLibrary(teacherFactory.getCurrentCourse()._id, function (error, res) {
      if (error) {
        alert('error');
      } else {
        //$log.info("in requriing libiray id");
        //$log.info(res);
        var library=res;
        $scope.questions = {};
          // $scope.questions=res.questions
        //$log.info(+library._id )
          qaAddDetailFactory.getQuestionLibraryQuestion(library._id, function (err, questions) {
              if(err) {
                  // $scope.questions = err.questions;
                  return alert('本课程: '+err);
              }
              //$log.info("question :"+library._id+library.name);
              //console.log(questions);
              $scope.questions = questions;
          });
      }
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
      teacherQuizFactory.createNewQuiz(teacherFactory.getCurrentCourse()._id, {'name': title, 'questions': sss}, function (error, data) {
        $log.log(error);
        $log.log(data);
      });
    };
  }
})();