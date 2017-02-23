/**
 * Created by YY on 2016/11/16.
 */
(function () {
    angular.module('teacher')
        .controller('teacherClassesCtrl', function ($scope, $state, $mdDialog, $mdToast, $cookies, teacherFactory, TeacherCourse) {

            var onDataCallback = function (err, courses) {
                if (err) {
                    return showAlert('错误', '获取课程列表失败，请重试.');
                }
                $scope.courses = courses;
                console.log(courses);
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
                $state.go('teacher.coursePost');
            };


            //two new btn
            console.log('init class crtl')
            $scope.btnNameList=function (course) {
                console.log('btnNameListl');
                teacherFactory.setCurrentCourse(course);
                $state.go('teacher.nameList');

            };
            $scope.btnExam=function (course) {
                console.log('btnExam');
                teacherFactory.setCurrentCourse(course);
                $state.go('teacher.exam');
            };
            $scope.btnQa=function (course) {
                console.log('btnQa');
                teacherFactory.setCurrentCourse(course);
                $state.go('teacher.qa');
            };

            $scope.btnRemoveCourse = function (course) {
                console.log('btnRemove');

                // Appending dialog to document.body to cover sidenav in docs app
                    var confirm = $mdDialog.confirm()
                        .title('删除一个课程吗?')
                        .textContent('课程名称：'+course.name)
                        .ariaLabel('程序员')
                        .ok('确定')
                        .cancel('取消');
                    $mdDialog.show(confirm).then(function () {

                        TeacherCourse.removeCourse(course._id, function (err, course) {
                            if (err) {
                                return teacherFactory.showToast('失败', '删除失败: ' + err.data);
                            }
                            teacherFactory.flushCourseList(onDataCallback);
                            $cookies.put('freshCoursesFlag','yes');

                            var change = function (name) {
                                console.log("childRemoveCtr1", name);
                                $scope.$emit("Ctr1RemoveChange", name);
                            };
                            change("remove course");//success
                            teacherFactory.showToast('成功', '删除了一门课程');
                        });

                    }, function () {
                        console.log("refused to delete course")
                    });


            };
            $scope.showCourseMenu = true;
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