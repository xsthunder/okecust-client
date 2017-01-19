/**
 * Created by YY on 2016/11/16.
 */
(function () {
    angular.module('teacher.qa')
        .controller('teacher.qa.ctrl', function ($scope, teacherQuizFactory, $log, $state, TeacherCourse, teacherFactory, TeacherHeaderFactory) {
            var freshData = function () {
                TeacherCourse.getQuizListFromCourse(teacherFactory.getCurrentCourse()._id, function (error, res) {
                    if (!error) {
                        $scope.QAitems = res;
                    }
                });
            };
            TeacherHeaderFactory.setOnSelectedListener(freshData);
            freshData();
            $scope.selectQuiz = function (quiz) {
                teacherQuizFactory.nowQuiz = quiz;
                $state.go('teacher.qaReport')
            };
            $scope.btnRemoveQuiz=function (quiz) {
                if(!confirm('Remove this quiz: '+quiz.name)){return;}
                teacherQuizFactory.removeQuiz(quiz._id,function (error,res) {
                    if(error){return alert("删除失败")}
                    freshData();
                    return alert("成功删除课程："+quiz.name);
                })
            };
        });
})();