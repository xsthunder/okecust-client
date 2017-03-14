/**
 * Created by YY on 2016/11/27.
 */
(function () {
        angular.module('teacher.qa.add')
            .controller('teacherQaAddCtrl', ctrl);


        function ctrl($scope, $mdDialog, teacherFactory, qaAddDetailFactory, $state, teacherQuizFactory, $log, TeacherCourse) {
            $log.info('teacherQaAddCtrl init');
            $scope.date = new Date();
            $scope.newQuizTitle = '';
            var selected = [];
            var questionSet = [];
            var quiz = teacherQuizFactory.getCurrentQuiz();
            var showAlert = teacherFactory.showToast;
            showAlert('', '请注意，一旦开始时间过去，您将不能修改此问答的题目和开始时间');
            TeacherCourse.getCorrespondingLibrary(teacherFactory.getCurrentCourse()._id, function (error, res) {
                if (error) {
                    if (teacherFactory.getCurrentCourse()._id === 0)return showAlert("错误", "没有选择课程");
                    else return showAlert("错误", "没有选择课程");
                } else {
                    //$log.info("in requriing libiray id");
                    //$log.info(res);
                    var library = res;
                    // $scope.questions=res.questions
                    //$log.info(+library._id )

                    qaAddDetailFactory.getQuestionLibraryQuestion(library._id, function (err, questions) {
                        if (err) {
                            // $scope.questions = err.questions;
                            return showAlert('错误', '无法获得“' + library.name + "”的题目，可能是没有题目");
                        }
                        //$log.info("question :"+library._id+library.name);
                        //console.log(questions);
                        $scope.questions = [];
                        $scope.questionSet = questions;
                        // console.log(questions);
                        if (questions.length == 0)return showAlert('', '该课程还没有题目，请到题库添加');
                        //console.log($scope.questionSet);
                        // console.log(questions);
                        var i;
                        var j;
                        //return ;
                        var qs = quiz === null ? null : quiz.questions;
                        if (quiz) {
                            if (quiz.time) {
                                $scope.date = new Date(quiz.time.from);
                                $scope.minute = (quiz.time.to - quiz.time.from) / 1000 / 60;
                            }
                        }
                        $scope.newQuizTitle = quiz === null ? '' : quiz.name;
                        for (i = 0; i < questions.length; i++) {
                            questionSet.push(questions[i]);
                            var flag = true;
                            if (qs !== null) for (j = 0; j < qs.length; j++) if (qs[j] === questions[i]._id) {
                                selected.push(true);
                                flag = false;
                                break;
                            }
                            if (flag) selected.push(false);
                            var alphaList = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
                            var content = questions[i];
                            if (content.type == 1) {
                                content.name += "       - 选择题";
                                for (j = 0; j < content.extras.length && j < alphaList.length; j++) {
                                    content.extras[j] = alphaList[j] + '. ' + content.extras[j];
                                    if (content.answers[j]) content.extras[j] += "        - 正确答案";
                                    if (j === content.extras.length - 1 && j === alphaList.length - 1) {
                                        content.extras[j] += "选项数目超过设定范围，后续选项不予显示";
                                    }
                                }
                            }
                            else if (content.type == 2) {

                                content.name += "   - 填空题";
                                content.extras = [];
                                for (j = 0; j < content.answers.length; j++) {
                                    content.extras[j] = "第" + (j + 1) + "个空：" + content.answers[j];
                                }
                            }
                            $scope.questions.push(content);
                            $scope.selected = selected;
                        }

                    });
                }
            });
            //FIXME 去重复
            $scope.cardClick = function ($index) {
                $scope.selected[$index] = !$scope.selected[$index];
            };
            $scope.submit = function (title) {
                var minute = $scope.minute;
                var date = new Date($scope.date);
                console.log(+date);
                var curdate = new Date();
                if (title === "" || title === undefined)return showAlert("错误", "小测试标题不能为空");
                if (!(minute > 0))return showAlert('', '无效持续时间');
                if(+$scope.date <= 0) return showAlert('', '无效开始时间');
                console.log('helol');
                $log.log('init submit');
                $log.log(title);
                //delete old
                var list = [];
                var i;
                console.log($scope.questionSet);
                if(!$scope.selected)return showAlert('','没有题目，添加问答失败');
                for (i = 0; i < $scope.selected.length; i++) {
                    if ($scope.selected[i] === true) list.push($scope.questionSet[i]);
                }
                if (quiz !== null) teacherQuizFactory.updateQuiz({
                        '_id': quiz._id,
                        'name': title,
                        'questions': list,
                        "time": {
                            "from": +date,
                            "duration": minute * 60 * 1000
                        }
                    }
                    , function (error, res) {
                        if (error) teacherFactory.showToast("", "测试已经开始，不能修改此问答");
                        else {
                            teacherFactory.showToast("hi", "修改成功");
                            $state.go('teacher.qa');
                        }

                    });
                else {
                    teacherQuizFactory.createNewQuiz(teacherFactory.getCurrentCourse()._id, {
                        'name': title,
                        'questions': list,
                        "time": {
                            "from": +date,
                            "duration": minute * 60 * 1000
                        }
                    }, function (error, data) {
                        $log.log(error);
                        $log.log('date', data);

                        if (error) {
                            showAlert("新增小测验", "添加失败，请检查重试");
                            $state.go('teacher.qa');

                        }
                        else {
                            showAlert("新增小测验", "成功：名称“" + title + "”共" + data.questions.length + "道题");
                            $state.go('teacher.qa');
                        }
                    });
                }
            };
        }
    }


    )();