/**
 * Created by Fisher on 9/28/2016 at 00:24.
 */
angular.module('teacher.course.post', [
    'ui.router',
    'teacher'
]).config(function ($stateProvider) {
    $stateProvider.state('teacher.coursePost', {
        url: '/class/post',
        views: {
            'header': {
                templateUrl: 'app/layout/header/header2.html',
                controller: 'teacherHeaderCtrl'
            },
            'main': {
                templateUrl: 'app/teacher/class/post/coursePost.html',
                controller: 'teacherCoursePostCtrl'
            }
        }
    })
}).controller('teacherCoursePostCtrl', function ($scope,$state,$mdDialog, TeacherCourse,teacherFactory) {

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
    $scope.targetText = TARGET_CREATE === target ? '创建课程' : '更新课程信息';
    $scope.btnNewCourse = function () {
        if (TARGET_CREATE === target) {
            if($scope.course.name===""||$scope.course.name===undefined)return showAlert("错误","课程名不能为空");
            console.log("check create info");
            console.log($scope.course);
            TeacherCourse.createNewCourse($scope.course, function (err, course) {
                if (err) {return showAlert('失败','未能创建课程，请重试，错误信息: ' + err.data);}
                $scope.course = course;
                showAlert('成功','创建成功!');
                teacherFactory.flushCourseList(function () {
                    $state.go('teacher.class');

                });

                //冒泡

            });
        } else {
            TeacherCourse.updateCourse($scope.course, function (err, course) {
                if (err) {return showAlert('错误','未能更新课程信息，请重试，错误信息: ' + err.data);}
                $scope.course = course;
                showAlert('成功','已更新课程信息');
                // FIXME ? whether go-to detail page.
                teacherFactory.flushCourseList(function () {
                    $state.go('teacher.class');
                });


                //冒泡


            });
        }
    };

});