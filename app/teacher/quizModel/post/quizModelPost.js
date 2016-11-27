/**
 * Created by Fisher at 23:53 on 10/08/2016.
 */
angular.module('teacher.quizModel.post', [
    'ui.router',
    'teacher'
]).config(function ($stateProvider) {
    $stateProvider.state('teacher.quizModelPost', {
        url: '/quizModel/post',
        views: {
            'header': {
                templateUrl: 'app/layout/header/header2.html',
                controller: 'teacherHeaderCtrl'
            },
            'main': {
                templateUrl: 'app/teacher/quizModel/post/quizModelPost.html',
                controller: 'teacherQuizModelPostCtrl'
            }
        }
    })
}).controller('teacherQuizModelPostCtrl', function ($scope, TeacherQuizModel) {
    var TARGET_UPDATE = 'update';
    var TARGET_CREATE = 'create';
    var target = TARGET_CREATE;
    $scope.quizModel = TeacherQuizModel.getActiveQuizModel();
    if ($scope.quizModel._id) {target = TARGET_UPDATE;}
    $scope.targetText = TARGET_CREATE === target ? 'Create QuizModel' : 'Update QuizModel';
    $scope.btnNewQuizModel = function () {
        if (TARGET_CREATE === target) {
            TeacherQuizModel.createNewQuizModel($scope.quizModel, function (err, quizModel) {
                if (err) {return alert('Failed to create quizModel: ' + err.data);}
                $scope.quizModel = quizModel;
                alert('QuizModel created!');
                history.back();
            });
        } else {
            TeacherQuizModel.updateQuizModel($scope.quizModel, function (err, quizModel) {
                if (err) {return alert('Failed to update quizModel: ' + err.data);}
                $scope.quizModel = quizModel;
                alert('QuizModel updated!');
                // FIXME ? whether go-to detail page.
                history.back();
            });
        }
    };
});