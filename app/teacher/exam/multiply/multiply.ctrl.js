/**
 * Created by xs on 2017/1/21.
 */

(function () {
    angular.module('teacher.exam.multiply')
        .controller('multiplyCtrl', ctrl);
    function ctrl(multiplyFactory, $log, $scope, $mdDialog, TeacherCourse, teacherFactory, TeacherQuestionLibraryDetail) {
        $log.info('this is exam multiply ctrl');

        //FIXME 去重复
        var contents=[];

        var showAlert = function (title, message) {
            // Appending dialog to document.body to cover sidenav in docs app
            // Modal dialogs should fully cover application
            // to prevent interaction outside of dialog
            $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title(title)
                    .textContent(message)
                    .ariaLabel('Alert Dialog Demo')
                    .ok('明白')
            );
        };


        var Instance = {
            type: 1,
            name: ""
        };
        $scope.splitName = "（\\d{1,2}）";
        $scope.splitOption = "[A-Z].";
        $scope.splitNameNum = 20;
        $scope.splitOptionNum = 5;


        $scope.split = function () {
            var contents=[];
            var splitNameNum = parseInt($scope.splitNameNum);
            var splitOptionNum = parseInt($scope.splitOptionNum);
            var text = $scope.text;
            var splitName = new RegExp ($scope.splitName,'g');
            var splitOption = new RegExp ($scope.splitOption,'g');
            console.log("init split/");

            if ($scope.splitName === "" || $scope.splitName === undefined ||
                $scope.splitOption === "" || $scope.splitOption === undefined ||
                $scope.text === "" || $scope.text === undefined ||
                $scope.splitNameNum === "" || $scope.splitNameNum === undefined ||
                $scope.splitOptionNum === "" || $scope.splitOptionNum === undefined
            )  return showAlert("错误", "任意输入框不能为空");

            if (splitNameNum < 1 || splitNameNum > 200)return showAlert("请输入有效最大题目数数字", "有效范围从1到200");
            if (splitOptionNum < 1 || splitOptionNum > 50)return showAlert("请输入有效最大题目数数字", "有效范围从1到50");

            console.log(text);
            var questions = text.split(splitName, splitNameNum);
            console.log(questions);
            for (var i = 0; i < questions.length; i++) {
                var question = questions[i].split(splitOption, splitOptionNum);
                var content =  {
                    type: 1,
                    name: question[0],
                    answers: [],
                    extras: []
                };
                if(content.name==="")continue;
                // console.log(i+"init content:");console.log(content);

                for (var j = 1; j < question.length; j++) {
                    console.log(i+"init content:");console.log(content);
                    console.log(j+"init question");console.log(question);
                    content.answers.push(false);
                    content.extras.push(question[j]);
                }
                contents.push(content);

            }
            if(contents.length===0)return showAlert("错误","生成0题题目，请调整输入");
            $scope.contents= contents;
            console.log(contents);
        };

        $scope.questionInstance = Instance;
        $scope.contents = contents;


        $scope.btnRemoveContent = function (index) {
            console.log("rmContent:"+index);
            $scope.contents.splice(index,1);
            console.log($scope.contents);
        };
        $scope.btnRemoveExtra=function (contentIndex,extraIndex) {
            $scope.contents[contentIndex].answers.splice(extraIndex,1);
            $scope.contents[contentIndex].extras.splice(extraIndex,1);
            console.log(contentIndex+extraIndex);
            console.log($scope.contents);
        };


        var libId;
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

                    contents = $scope.contents;
                    for (i = 0; i<contents.length;i++){
                        if(contents[i].name===undefined||contents[i].name==="")return showAlert("错误", "第"+(i+1)+"题题目不能为空");
                    }
                    console.log("on submit to server")
                    console.log(contents);
                    TeacherQuestionLibraryDetail.createQuestions(libId, contents, function (error, res) {
                        if (error) {
                            console.log(error);
                            return showAlert("添加题目失败", "请检查网络或刷新后重试");
                        }
                        return showAlert("成功添加"+res.length+"道题目", "添加到\"" + teacherFactory.getCurrentCourse().name + "\"");
                    })
                };
                submitToServer();
            });
        }
    }
})();