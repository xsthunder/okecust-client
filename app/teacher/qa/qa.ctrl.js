/**
 * Created by YY on 2016/11/16.
 */
(function () {
    angular.module('teacher.qa')
        .controller('teacher.qa.ctrl', function ($scope,$mdDialog, teacherQuizFactory, $log, $state, TeacherCourse, teacherFactory, TeacherHeaderFactory) {


            var showAlert = teacherFactory.showToast;



            var freshData = function () {
                TeacherCourse.getQuizListFromCourse(teacherFactory.getCurrentCourse()._id, function (error, res) {
                    if (!error) {
                        $scope.QAitems = res;
                        $scope.showFab=true;
                    }
                    else {

                        $scope.showFab=false;
                    }
                });
            };
            $scope.showFab=true;
            TeacherHeaderFactory.setOnSelectedListener(freshData);
            freshData();
            $scope.selectQuiz = function (quiz) {
                teacherQuizFactory.nowQuiz = quiz;
                $state.go('teacher.qaReport')
            };
            $scope.btnRemoveQuiz=function (quiz) {

                var confirm = $mdDialog.confirm()
                    .title("删除这个小测验")
                    .textContent("小测验名称："+quiz.name)
                    .ariaLabel('Lucky day')
                    .ok('确定')
                    .cancel('取消');

                $mdDialog.show(confirm).then(function() {
                    teacherQuizFactory.removeQuiz(quiz._id,function (error,res) {
                        if(error){return showAlert("删除失败")}
                        freshData();
                        return showAlert("成功","成功删除小测验："+quiz.name);
                    })
                }, function() {

                });




            };
        });






})();