/**
 * Created by YY on 2016/11/21.
 */
(function () {
    angular.module('teacher.exam.single')
        .controller('singleCtrl', ctrl);
    function ctrl(singleFactory, $log, $scope, TeacherCourse, teacherFactory, TeacherQuestionLibraryDetail) {
        $log.info('this is exam single ctrl');
        var question = {
            type: 1,
            extras: [],
            answers: [false, false, false, false]
        };
        var libId;
        TeacherCourse.getCorrespondingLibrary(teacherFactory.getCurrentCourse()._id, function (error, res) {
            $log.info(res);
            libId = res._id;
            $scope.question = question;
            $scope.submit = function () {
                $log.log($scope.answer);
                $log.info('this is qa');
                question.answers[$scope.answer - 'A'] = true;
                var index = 'ABCDEFG'.indexOf($scope.answer);
                if (0 > index) {return alert('Unavailable Answer!');}
                question.answers[index] = true;
                $log.log($scope.answer[0] - 'A', question);
                return;
                TeacherQuestionLibraryDetail.createQuestions(libId, question, function (error, res) {
                    if (error) {
                        return alert(error);
                    }
                    $log.info(res);
                    return alert("成功添加题目到\"" + teacherFactory.getCurrentCourse().name + "\"");

                })
            }
        });
    }
})();