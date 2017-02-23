/**
 * Created by YY on 2016/11/16.
 */
(function () {
    angular.module('teacher.nameList')
        .controller('nameListCtrl', ctrl);
    function ctrl($scope, $log, TeacherCourse, $mdDialog, TeacherHeaderFactory, teacherFactory, headerFactory, $state) {
        $log.info('nameList init');
        $log.info(teacherFactory.getCurrentCourse());

        var showAlert = teacherFactory.showToast;


        $scope.showFab = true;
        // teacherFactory.getCourseList(function (error, res) {
        //     if(error)return showAlert('获取课程列表失败')
        //     if (!error) $log.info(res);
        //     $scope.showFab = true;
        // });
        var freshData = function () {
            TeacherCourse.getCourseStudents(teacherFactory.getCurrentCourse()._id, function (error, res) {
                if (error) {
                    console.log(teacherFactory.getCurrentCourse()._id);
                    if (teacherFactory.getCurrentCourse()._id !== undefined||teacherFactory.getCurrentCourse()._id===0) {
                        $scope.showFab = true;
                        return showAlert("失败", "获取名单失败，可以尝试刷新");
                    }
                }
                $log.info(res);
                $scope.students = res;
                console.log('set false');
                $scope.showFab = false;
                if(res===undefined)$scope.showFab = true;
            });
        };
        TeacherHeaderFactory.setOnSelectedListener(freshData);
        $scope.btnRemoveStudent = function (student) {
            var studentIDs = [student.uid];


            var confirm = $mdDialog.confirm()
                .title('删除一名学生')
                .textContent('学生姓名:' + student.name + "  学号：" + studentIDs)
                .ariaLabel('Lucky day')
                .ok('确定')
                .cancel('取消');

            $mdDialog.show(confirm).then(function () {
                TeacherCourse.removeStudentsFromCourse(teacherFactory.getCurrentCourse()._id, studentIDs, function (error, res) {
                    if (error) {
                        return showAlert("失败", "删除失败");
                    }
                    showAlert("成功", "成功删除学生：" + studentIDs);
                    freshData();
                });
            }, function () {
            });

        };
        freshData();

    }
})();