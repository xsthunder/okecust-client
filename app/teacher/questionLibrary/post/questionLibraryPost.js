/**
 * Created by Fisher at 23:53 on 10/08/2016.
 */
angular.module('teacher.questionLibrary.post', [
    'ui.router',
    'teacher'
]).config(function ($stateProvider) {
    $stateProvider.state('teacher.questionLibraryPost', {
        url: '/questionLibrary/post',
        views: {
            'header': {
                templateUrl: 'app/layout/header/header2.html',
                controller: 'teacherHeaderCtrl'
            },
            'main': {
                templateUrl: 'app/teacher/questionLibrary/post/questionLibraryPost.html',
                controller: 'teacherQuestionLibraryPostCtrl'
            }
        }
    })
}).controller('teacherQuestionLibraryPostCtrl', function ($scope, TeacherQuestionLibrary) {
    var TARGET_UPDATE = 'update';
    var TARGET_CREATE = 'create';
    var target = TARGET_CREATE;
    $scope.questionLibrary = TeacherQuestionLibrary.getActiveQuestionLibrary();
    if ($scope.questionLibrary._id) {target = TARGET_UPDATE;}
    $scope.targetText = TARGET_CREATE === target ? 'Create QuestionLibrary' : 'Update QuestionLibrary';
    $scope.btnNewQuestionLibrary = function () {
        if (TARGET_CREATE === target) {
            TeacherQuestionLibrary.createNewQuestionLibrary($scope.questionLibrary, function (err, questionLibrary) {
                if (err) {return alert('Failed to create questionLibrary: ' + err.data);}
                $scope.questionLibrary = questionLibrary;
                alert('QuestionLibrary created!');
                history.back();
            });
        } else {
            TeacherQuestionLibrary.updateQuestionLibrary($scope.questionLibrary, function (err, questionLibrary) {
                if (err) {return alert('Failed to update questionLibrary: ' + err.data);}
                $scope.questionLibrary = questionLibrary;
                alert('QuestionLibrary updated!');
                // FIXME ? whether go-to detail page.
                history.back();
            });
        }
    };
});