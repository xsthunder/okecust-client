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
              $scope.questions= [];

              console.log(questions);
              var i;
              var j;
              //return ;
              for( i = 0; i <　questions.length;i++){
                var alphaList="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
                var content=questions[i];
                console.log("content:");
                console.log(content);
                //return ;
                if(content.type==1){
                  content.name+="       - 选择题";
                  for(j = 0 ;j <content.extras.length&&j<alphaList.length;j++){
                    content.extras[j]=alphaList[j]+'. '+content.extras[j];
                    if(content.answers[j])content.extras[j]+="        - 正确答案";
                    if(j===content.extras.length-1&&j===alphaList.length-1){
                      content.extras[j]+="选项数目超过设定范围，后续选项不予显示";

                    }
                  }
                }
                else if(content.type==2){

                  content.name+="   - 填空题";
                  content.extras=[];
                  for(j =0 ; j< content.answers.length;j++){
                    content.extras[j]="第"+(j+1)+"个空："+content.answers[j];
                  }
                }
                  $scope.questions.push(content);
              }

          });
      }
    });
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

        if(error)return showAlert("新增小测验","添加失败，请检查重试");
        else return showAlert("新增小测验","添加成功");
      });
    };
  }
})();