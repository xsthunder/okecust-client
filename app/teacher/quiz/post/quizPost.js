/**
 * Created by Fisher at 23:53 on 10/08/2016.
 */
angular.module('teacher.quiz.post', [
    'ui.router',
    'teacher'
]).config(function ($stateProvider) {
    $stateProvider.state('teacher.quizPost', {
        url: '/quiz/post',
        views: {
            'header': {
                templateUrl: 'app/layout/header/header2.html',
                controller: 'teacherHeaderCtrl'
            },
            'main': {
                templateUrl: 'app/teacher/quiz/post/quizPost.html',
                controller: 'teacherQuizPostCtrl'
            }
        }
    })
}).controller('teacherQuizPostCtrl', function ($scope, Account,TeacherQuiz) {
    var TARGET_UPDATE = 'update';
    var TARGET_CREATE = 'create';
    var target = TARGET_CREATE;
    $scope.quiz = TeacherQuiz.getActiveQuiz();
    if ($scope.quiz._id) {target = TARGET_UPDATE;}
    $scope.targetText = TARGET_CREATE === target ? 'Create Quiz' : 'Update Quiz';
    $scope.btnNewQuiz = function () {
        if (TARGET_CREATE === target) {
            TeacherQuiz.createNewQuiz($scope.quiz, function (err, quiz) {
                if (err) {return Account.showToast('失败','Failed to create quiz: ' + err.data);}
                $scope.quiz = quiz;
                alert('成功','Quiz created!');
                history.back();
            });
        } else {
            TeacherQuiz.updateQuiz($scope.quiz, function (err, quiz) {
                if (err) {return Account.showToast('失败','Failed to update quiz: ' + err.data);}
                $scope.quiz = quiz;
                Account.showToast('成功','Quiz updated!');
                // FIXME ? whether to go-to detail page.
                history.back();
            });
        }
    };
});