/**
 * Created by YY on 2016/11/16.
 */
(function () {
    angular.module('teacher')
        .controller('teacherClassesCtrl', function ($scope, $mdDialog, teacherFactory, TeacherCourse) {
            var onDataCallback = function (err, courses) {
                if (err) {
                    return showAlert('错误', '获取课程列表失败，请重试.');
                }
                $scope.courses = courses;
            };
            teacherFactory.getCourseList(onDataCallback);
            $scope.selectCourse = function (course) {
                teacherFactory.setCurrentCourse(course);
            };
            $scope.btnTargetNewCourse = function () {
                TeacherCourse.setActiveCourse({name: ''});
            };
            $scope.btnUpdateCourse = function (course) {
                TeacherCourse.setActiveCourse(course);
            };
            $scope.btnRemoveCourse = function (course) {

                    // Appending dialog to document.body to cover sidenav in docs app
                    var confirm = $mdDialog.confirm()
                        .title('删除一个课程吗?')
                        .textContent('课程名称：'+course.name)
                        .ariaLabel('萌萌的程序员')
                        .ok('确定')
                        .cancel('取消');

                    $mdDialog.show(confirm).then(function () {

                        TeacherCourse.removeCourse(course._id, function (err, course) {
                            if (err) {
                                return showAlert('失败', '删除失败: ' + err.data);
                            }
                            teacherFactory.flushCourseList(onDataCallback);
                            var change = function (name) {
                                console.log("childRemoveCtr1", name);
                                $scope.$emit("Ctr1RemoveChange", name);
                            };
                            change("remove course");//success
                            showAlert('成功', 'Course deleted!');
                        });

                    }, function () {
                        console.log("refused to delete course")
                    });


            };
            //$scope.showCourseMenu = true;
            var showAlert = function (title, message) {
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
        });
})();