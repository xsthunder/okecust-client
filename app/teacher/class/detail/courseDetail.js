/**
 * Created by Fisher on 9/28/2016 at 00:24.
 */
angular.module('teacher.course.detail', [
    'ui.router',
    'teacher'
]).config(function ($stateProvider) {
    $stateProvider.state('teacher.courseDetail', {
        url: '/class/detail',
        views: {
            'header': {
                templateUrl: 'app/layout/header/header2.html',
                controller: 'teacherHeaderCtrl'
            },
            'main': {
                templateUrl: 'app/teacher/class/detail/courseDetail.html',
                controller: 'teacherCourseDetailCtrl'
            }
        }
    })
}).controller('teacherCourseDetailCtrl', function ($scope, teacherFactory) {
    $scope.course = teacherFactory.getCurrentCourse();
});