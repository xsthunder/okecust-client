(function () {
    'use strict';
    angular.module('teacher.course.post', [
        'ui.router',
        'teacher'
    ]).config(function ($stateProvider) {
        $stateProvider.state('teacher.coursePost', {
            url: '/class/post',
            views: {
                'header': {
                    templateUrl: 'app/layout/header/header2.html',
                    controller: function ($scope,TeacherCourse) {
                        var TARGET_UPDATE = 'update';
                        var TARGET_CREATE = 'create';
                        var target = TARGET_CREATE;
                        $scope.course = TeacherCourse.getActiveCourse();
                        if($scope.course===undefined)target=TARGET_CREATE;
                        else if($scope.course._id) {target = TARGET_UPDATE;}
                        $scope.title = (TARGET_CREATE === target) ? '创建课程' : '更新课程信息';
                    }
                },
                'main': {
                    templateUrl: 'app/teacher/class/post/coursePost.html',
                    controller: 'teacherCoursePostCtrl'
                }
            }
        })
    }).controller('teacherCoursePostCtrl', function ($scope,$state,$mdDialog, TeacherCourse,teacherFactory) {
        $scope.btnRemoveCourse = function () {
            var course = TeacherCourse.getActiveCourse();
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
        //尝试冒泡
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





        var TARGET_UPDATE = 'update';
        var TARGET_CREATE = 'create';
        var target = TARGET_CREATE;
        $scope.course = TeacherCourse.getActiveCourse();
        if($scope.course===undefined)target=TARGET_CREATE;
        else if($scope.course._id) {target = TARGET_UPDATE;}
        $scope.targetText = (TARGET_CREATE === target) ? '创建课程' : '更新课程信息';
        $scope.btnNewCourse = function () {
            if (TARGET_CREATE === target) {
                if($scope.course.name===""||$scope.course.name===undefined)return teacherFactory.showToast("错误","课程名不能为空");
                console.log("check create info");
                console.log($scope.course);
                TeacherCourse.createNewCourse($scope.course, function (err, course) {
                    if (err) {return teacherFactory.showToast('失败','未能创建课程，请重试，错误信息: ' + err.data);}
                    $scope.course = course;
                    teacherFactory.showToast('成功','创建成功!');
                    teacherFactory.flushCourseList(function () {
                        $state.go('teacher.class');

                    });

                    //冒泡

                });
            } else {
                TeacherCourse.updateCourse($scope.course, function (err, course) {
                    if (err) {return teacherFactory.showToast('错误','未能更新课程信息，请重试，错误信息: ' + err.data);}
                    $scope.course = course;
                    teacherFactory.showToast('成功','已更新课程信息');
                    // FIXME ? whether go-to detail page.
                    teacherFactory.flushCourseList(function () {
                        $state.go('teacher.class');
                    });


                    //冒泡


                });
            }
        };

    });
})();