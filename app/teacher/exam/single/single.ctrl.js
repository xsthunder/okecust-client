/**
 * Created by YY on 2016/11/21.
 */
(function () {
    angular.module('teacher.exam.single')
        .controller('singleCtrl', ctrl);
    function ctrl(singleFactory, $log, $scope,$state ,$mdDialog,TeacherCourse, teacherFactory, TeacherQuestionLibraryDetail) {
        $log.info('this is exam single ctrl');

        //FIXME 去重复
        var showAlert = teacherFactory.showToast;

        var Instance = {
            type: 1,
            name: ""
        };
        var contents = [];
        for (var x = 0; x < 4; x++) {
            contents.push({
                answer: false,
                extras: ""
            });
        }

        $scope.questionInstance = Instance;
        $scope.contents = contents;
        $scope.type = true;

        $scope.switchType = function () {
            $scope.questionInstance.type = $scope.type ? 2 : 1;
            $scope.showCheckbox=true;


            function checkNon(age) {
                return !age;
            }
            if($scope.questionInstance.type===2){
                $scope.contents=$scope.contents.every(checkNon);
            }
            else {
                $scope.contents=contents;
            }
            if(!$scope.contents) {
                $scope.contents=[];
                console.log($scope.contents);
                $scope.contents.push({
                    answer: false,
                    extras: ""
                });
            }
            console.log($scope.questionInstance.type);
        };

        $scope.btnRemoveContent = function (index) {
            $scope.contents.splice( index,1);
        };
        $scope.btnNewContent = function () {
            $scope.contents.push({
                answer: false,
                extras: ""
            });
            // console.log(Instance.contents.length());
        };

        $scope.String=String;
        $scope.showCheckbox=true;
        var libId;
        $scope.chooseCorrect=function () {
            if($scope.type)$scope.showCheckbox=false;
        };
        $scope.submit = function () {
            TeacherCourse.getCorrespondingLibrary(teacherFactory.getCurrentCourse()._id, function (error, res) {
                if (error) {
                    if (res._id === undefined) {
                        return showAlert("错误", "没有选择课程");
                    }
                    else {
                        return showAlert("错误", "无法获取课程id,请刷新重试");
                    }
                }
                $log.info(res);
                libId = res._id;

                // var question = {
                //     type: 1,
                //     extras: [],
                //     answers: [false, false, false, false]
                // };


                var submitToServer = function () {

                    var question = $scope.questionInstance;
                    if (question.name === "")return showAlert("错误", "题目不能为空");
                    question.extras = [];
                    question.answers = [];
                    var i;
                    if (question.type === 1) {//选择题
                        for (i = 0; i < $scope.contents.length; i++) {
                            question.extras.push($scope.contents[i].extras);
                            question.answers.push($scope.contents[i].answer);
                        }
                    }
                    else if (question.type === 2) {
                        for (i = 0; i < $scope.contents.length; i++) {
                            question.answers.push($scope.contents[i].extras);
                            question.extras.push('第'+(i+1)+'个空');
                        }
                    }

                    console.log(question);

                    TeacherQuestionLibraryDetail.createQuestions(libId, question, function (error, res) {
                        if (error) {
                            console.log(error);
                            return showAlert("添加题目失败", "请检查网络或刷新后重试");
                        }
                        $log.info(res);
                        showAlert("成功添加题目", "添加到\"" + teacherFactory.getCurrentCourse().name + "\"");
                        $state.go('teacher.exam.lookup');

                    })
                };
                submitToServer();
            });
        }
    }
})();