/**
 * Created by YY on 2016/11/27.
 */
(function () {
  angular.module('teacher.qa.add')
    .controller('teacherQaAddCtrl', ctrl);


  function ctrl($scope, $mdDialog, teacherFactory, qaAddDetailFactory, teacherQuizFactory, $log, TeacherCourse) {
    $log.info('teacherQaAddCtrl init');
    $scope.newQuizTitle = '';
      var selected = [];
      var questionSet=[];
    TeacherCourse.getCorrespondingLibrary(teacherFactory.getCurrentCourse()._id, function (error, res) {
      if (error) {
        if(teacherFactory.getCurrentCourse()._id===0)return showAlert("错误","没有选择课程");
        else return showAlert("错误","没有选择课程");
      } else {
        //$log.info("in requriing libiray id");
        //$log.info(res);
        var library=res;
          // $scope.questions=res.questions
        //$log.info(+library._id )
          qaAddDetailFactory.getQuestionLibraryQuestion(library._id, function (err, questions) {
              if(err) {
                  // $scope.questions = err.questions;
                  return showAlert('错误','无法获得“'+library.name+"”的题目，可能是没有题目");
              }
              //$log.info("question :"+library._id+library.name);
              //console.log(questions);
              $scope.questions= [];
              $scope.questionSet=questions;


              console.log($scope.questionSet);
              // console.log(questions);
              var i;
              var j;
              //return ;
              for( i = 0; i <　questions.length;i++){
                questionSet.push(questions[i]);
                selected.push(false);
                var alphaList="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
                var content=questions[i];
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
                $scope.selected=selected;
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
    // var sss;
    // $scope.questionSelected = function (item, list) {
    //   var idx = list.indexOf(item);
    //   if (idx > -1) {
    //     list.splice(idx, 1);
    //   } else {
    //     list.push(item);
    //   }
    //   sss = list;
    // };
      $scope.cardClick=function ($index) {
        $scope.selected[$index]=!$scope.selected[$index];
      };
    $scope.submit = function (title) {
      $log.log('init submit');
      $log.log(title);
      if(title===""||title===undefined)return showAlert("错误","小测试标题不能为空");
      var list=[];
      var i;
      console.log($scope.questionSet);
      for(i =0;i<$scope.selected.length;i++){
          if($scope.selected[i]===true)list.push($scope.questionSet[i]);
      }
      teacherQuizFactory.createNewQuiz(teacherFactory.getCurrentCourse()._id, {'name': title, 'questions': list}, function (error, data) {
        $log.log(error);
        $log.log(data);

        if(error)return showAlert("新增小测验","添加失败，请检查重试");
        else return showAlert("新增小测验","成功：名称“"+title+"”共"+data.questions.length+"道题");
      });
    };
  }
})();