/**
 * Created by YY on 2016/11/26.
 */
(function () {
  angular.module('teacher.nameList.add')
    .controller('nameListAddCtrl', ctrl);
  function ctrl($scope, $log, headerFactory, TeacherCourse, teacherFactory) {
    $log.info('nameListAddCtrl init');
    $scope.submit = function () {
      var nameList = $scope.nameList;
      var arr = nameList.split('\n');
      var nameListArr = [];
      for (var i = 0; i < arr.length; i++) {
        var obj = {};

        var xarr = arr[i].split(/[\t ]/);
          if(xarr.length!=2){ return alert("生成数据失败，请确认在学号和姓名间使用TAB或空格");}
        obj.id = xarr[0];
        obj.name = xarr[1];
        nameListArr.push(obj);
      }
      $log.info(nameListArr);
      TeacherCourse.addStudentsIntoCourse(teacherFactory.getCurrentCourse()._id, nameListArr, function (error, res) {
        $log.info(res);
        if(error){return alert("添加名单失败"); }
        alert("成功添加\""+res.scoresCreated+"\"名学生到\""+teacherFactory.getCurrentCourse().name+"\"");
      })

    }
  }
})();