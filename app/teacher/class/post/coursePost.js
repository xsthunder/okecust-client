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
}).controller('teacherCoursePostCtrl', function ($scope, TeacherCourse) {
    var TARGET_UPDATE = 'update';
    var TARGET_CREATE = 'create';
    var target = TARGET_CREATE;
    $scope.course = TeacherCourse.getActiveCourse();
    if ($scope.course._id) {target = TARGET_UPDATE;}
    $scope.targetText = TARGET_CREATE === target ? 'Create Course' : 'Update Course';
    $scope.btnNewCourse = function () {
        if (TARGET_CREATE === target) {
            TeacherCourse.createNewCourse($scope.course, function (err, course) {
                if (err) {return alert('Failed to create course: ' + err.data);}
                $scope.course = course;
                alert('Course created!');
                history.back();
            });
        } else {
            TeacherCourse.updateCourse($scope.course, function (err, course) {
                if (err) {return alert('Failed to update course: ' + err.data);}
                $scope.course = course;
                alert('Course updated!');
                // FIXME ? whether go-to detail page.
                history.back();
            });
        }
    };
});