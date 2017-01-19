/**
 * Created by YY on 2016/11/16.
 */
(function () {
    angular.module('teacher.nameList')
        .controller('nameListCtrl', ctrl);
    function ctrl($scope, $log, TeacherCourse, TeacherHeaderFactory, teacherFactory, headerFactory, $state) {
        $log.info('nameList init');
        $log.info(teacherFactory.getCurrentCourse());
        teacherFactory.getCourseList(function (error, res) {
            if (!error) $log.info(res);
        });
        var freshData = function () {
            TeacherCourse.getCourseStudents(teacherFactory.getCurrentCourse()._id, function (error, res) {
                if (error) {
                    return alert("获取名单失败，可以尝试刷新");
                }
                $log.info(res);
                $scope.students = res;
            });
        };
        TeacherHeaderFactory.setOnSelectedListener(freshData);
        $scope.btnRemoveStudent = function (student) {
            var studentIDs = [student.uid];
            if(!confirm('Remove this student: '+student.name)){return;}
            TeacherCourse.removeStudentsFromCourse(teacherFactory.getCurrentCourse()._id, studentIDs, function (error, res) {
                if (error) {
                    return alert("删除失败");
                }
                alert("成功删除学生：" + studentIDs);
                freshData();
            });
        };
        freshData();

    }
})();