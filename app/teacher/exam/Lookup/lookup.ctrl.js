/**
 * Created by YY on 2016/11/27.
 */
(function () {
  angular.module('teacher.exam.lookup')
    .controller('lookupCtrl', ctrl);
  function ctrl($scope, $mdDialog,TeacherHeaderFactory , teacherFactory, qaAddDetailFactory, teacherQuizFactory, $log, TeacherCourse) {
    $log.info('lookuptrl init');
      var freshData=function() {
          TeacherCourse.getCorrespondingLibrary(teacherFactory.getCurrentCourse()._id, function (error, res) {
              if (error) {
                  alert('error');
              } else {
                  //$log.info("in requriing libiray id");
                  //$log.info(res);
                  var library = res;
                  $scope.questions = {};
                  // $scope.questions=res.questions
                  //$log.info(+library._id )
                  qaAddDetailFactory.getQuestionLibraryQuestion(library._id, function (err, questions) {
                      if (err) {
                          if (teacherFactory.getCurrentCourse()._id === 0)return showAlert("错误", "没有选择课程");
                          else return showAlert("错误", "没有选择课程");
                      }
                      //$log.info("question :"+library._id+library.name);
                      //console.log(questions);
                      $scope.questions = [];

                      console.log(questions);
                      var i;
                      var j;
                      //return ;
                      for (i = 0; i < questions.length; i++) {
                          var alphaList = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
                          var content = questions[i];
                          console.log("content:");
                          console.log(content);
                          //return ;
                          if (content.type == 1) {
                              content.name += "       - 选择题";
                              for (j = 0; j < content.extras.length && j < alphaList.length; j++) {
                                  content.extras[j] = alphaList[j] + '. ' + content.extras[j];
                                  if (content.answers[j]) content.extras[j] += "        - 正确答案";
                                  if (j === content.extras.length - 1 && j === alphaList.length - 1) {
                                      content.extras[j] += "选项数目超过设定范围，后续选项不予显示";

                                  }
                              }
                          }
                          else if (content.type == 2) {

                              content.name += "   - 填空题";
                              content.extras = [];
                              for (j = 0; j < content.answers.length; j++) {
                                  content.extras[j] = "第" + (j + 1) + "个空：" + content.answers[j];
                              }
                          }
                          $scope.questions.push(content);
                      }

                  });
              }
          });
      };
      TeacherHeaderFactory.setOnSelectedListener(freshData);
      freshData();

      //FIXME 去重复
      var showAlert = function(title,message) {
          // Appending dialog to document.body to cover sidenav in docs app
          // Modal dialogs should fully cover application
          // to prevent interaction outside of dialog
          $mdDialog.show(
              $mdDialog.alert()
                  .parent(angular.element(document.querySelector('#popupContainer')))
                  .clickOutsideToClose(true)
                  .title(title)
                  .textContent(message)
                  .ariaLabel('Alert Dialog Demo')
                  .ok('明白')
          );
      };


  }
})();