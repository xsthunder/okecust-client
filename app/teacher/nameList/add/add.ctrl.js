/**
 * Created by YY on 2016/11/26.
 */
(function () {
  angular.module('teacher.nameList.add')
    .controller('nameListAddCtrl', ctrl);
  function ctrl($scope, $log,$mdDialog, headerFactory, TeacherCourse, teacherFactory) {
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
    $log.info('nameListAddCtrl init');
    $scope.submit = function () {
      var nameList = $scope.nameList;
      if(nameList===""||nameList===undefined)return;
      var arr = nameList.split('\n');
      var nameListArr = [];
      for (var i = 0; i < arr.length; i++) {
        var obj = {};

        var xarr = arr[i].split(/[\t ]/);
          if(xarr.length!=2){ return showAlert('错误',"生成数据失败，请确认在学号和姓名间使用TAB或空格");}
        obj.id = xarr[0];
        obj.name = xarr[1];
        nameListArr.push(obj);
      }
      $log.info(nameListArr);
      TeacherCourse.addStudentsIntoCourse(teacherFactory.getCurrentCourse()._id, nameListArr, function (error, res) {
        $log.info(res);
        if(error){return showAlert('错误',"添加名单失败"); }
        showAlert("成功","成功添加\""+res.scoresCreated+"\"名学生到\""+teacherFactory.getCurrentCourse().name+"\"");
      })

    }
  }
})();