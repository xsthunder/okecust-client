/**
 * Created by YY on 2016/11/16.
 */
(function () {
    angular.module('teacher.qa')
        .controller('teacher.qa.edit.ctrl', function ($scope, teacherQuizFactory) {
            $scope.quiz = teacherQuizFactory.getCurrentQuiz();
        })

        .controller('teacher.qa.ctrl', function ($scope, $mdDialog, teacherQuizFactory, $mdToast, $log, $state, TeacherCourse, teacherFactory, TeacherHeaderFactory) {


            var showAlert = teacherFactory.showToast;
            // $scope.edit = function (quiz) {
            //     teacherQuizFactory.setCurrentQuiz(quiz);
            //     $mdToast.show(
            //         {
            //             hideDelay: 0,
            //             position: 'top right',
            //             controller: 'teacher.qa.edit.ctrl',
            //             templateUrl: 'app/teacher/qa/qa.edit.html'
            //         }
            //     );
            // };


            var freshData = function () {
                TeacherCourse.getQuizListFromCourse(teacherFactory.getCurrentCourse()._id, function (error, res) {
                    if (!error) {
                        $scope.QAitems = res;
                        $scope.showFab = true;
                        if (res.length == 0)return showAlert('', '目前该课程还没有问答');
                    }
                    else {
                        $scope.showFab = false;
                        return showAlert('', '错误：没有选择课程');
                    }
                });
            };
            $scope.showFab = true;
            TeacherHeaderFactory.setOnSelectedListener(freshData);
            freshData();

            $scope.selectQuiz = function (quiz) {
                teacherQuizFactory.nowQuiz = quiz;
                $state.go('teacher.qaReport')
            };
            $scope.btnQuiz = function (quiz) {
                if (quiz == null) {
                    teacherQuizFactory.setCurrentQuiz(null);
                }
                else {
                    teacherQuizFactory.setCurrentQuiz(quiz);
                }
                $state.go('teacher.qaAdd');

            };
            $scope.btnRemoveQuiz = function (quiz) {

                var confirm = $mdDialog.confirm()
                    .title("删除这个小测验")
                    .textContent("小测验名称：" + quiz.name)
                    .ariaLabel('Lucky day')
                    .ok('确定')
                    .cancel('取消');

                $mdDialog.show(confirm).then(function () {
                    teacherQuizFactory.removeQuiz(quiz._id, function (error, res) {
                        if (error) {
                            return showAlert("删除失败")
                        }
                        freshData();
                        return showAlert("成功", "成功删除小测验：" + quiz.name);
                    })
                }, function () {

                });


            };
        });


})();