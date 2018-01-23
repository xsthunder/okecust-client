/**
 * Created by xs on 2017/1/21.
 */

(function () {
	
    angular.module('teacher.exam.multiply')
        .controller('multiplyCtrl', ctrl);
    function ctrl(multiplyFactory, $log, $scope, $mdDialog, TeacherCourse, teacherFactory, TeacherQuestionLibraryDetail) {
        $log.info('this is exam multiply ctrl');

        //FIXME 去重复
		$scope.contents = [];
        $scope.type = true;
		
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
		
		//TODO remove repeated codes
        function fixdata(data) {
            var o = "", l = 0, w = 10240;
            for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
            o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
            return o;
        }

        function checkName(s) {
            return /[A-Za-z0-9]+$/gi.test(s);
        }

        var rABS = true; // true: readAsBinaryString ; false: readAsArrayBuffer
        /* set up drag-and-drop event */
        /* fixdata and rABS are defined in the drag and drop example */
        function handleFile(e) {
            var files = e.target.files;
            var i, f;
            if (1 > files.length) {
                return showAlert('cuowu', '请选择一个文件');
            }
            f = files[0];
            var reader = new FileReader();
            var name = f.name;
            reader.onload = function (e) {
                var data = e.target.result;
                var workbook;
                if (rABS) {
                    /* if binary string, read with type 'binary' */
                    workbook = XLSX.read(data, {type: 'binary'});
                } else {
                    /* if array buffer, convert to base64 */
                    var arr = fixdata(data);
                    workbook = XLSX.read(btoa(arr), {type: 'base64'});
                }
                /* DO SOMETHING WITH workbook HERE */
				if($scope.type)
				{
					handleWorkbook_choice(workbook);
				}
				else
				{
					handleWorkbook_blank(workbook);
				}
            };
            reader.readAsBinaryString(f);
        }

        /**
         * Handle workbook.
         */
        function handleWorkbook_choice(workbook) {
            var sheet_name_list = workbook.SheetNames;
            sheet_name_list.forEach(function (y) {
                /* iterate through sheets */
                var worksheet = workbook.Sheets[y];
				var table_data = XLSX.utils.sheet_to_json(worksheet, {header:1, raw:false});
				var invalidID = 0;
				for(i=1;i<table_data.length;i++)
				{
					var row=table_data[i];
					if(row.length==6)
					{
						for(j=0;j<row.length;j++)
						{
							if(row[j]=="")
							{
								invalidID++;
								continue;
							}
						}
						var tmp_question = {
							"type": 1,
							"name": row[0],
							"extras": [row[1], row[2], row[3], row[4]],
							"answers": [false, false, false, false]
							};
						
						if(row[5].charCodeAt(0)>=65 && row[5].charCodeAt(0)<=68)
						{
							tmp_question.answers[row[5].charCodeAt(0)-65]=true;
							$scope.contents.push(tmp_question);
						}
						else
						{
							invalidID++;
						}
							
					}
					else
					{
						invalidID++;
					}
				}
				if (invalidID) showAlert('错误', invalidID + ' 项因为格式不对而被忽略');
            });
			console.log($scope.contents);
        }

		function handleWorkbook_blank(workbook) {
            var sheet_name_list = workbook.SheetNames;
            sheet_name_list.forEach(function (y) {
                /* iterate through sheets */
                var worksheet = workbook.Sheets[y];
				var table_data = XLSX.utils.sheet_to_json(worksheet, {header:1, raw:false});
				var invalidID = 0;
				for(i=1;i<table_data.length;i++)
				{
					var row=table_data[i];
					if(row.length==2)
					{
						for(j=0;j<row.length;j++)
						{
							if(row[j]=="")
							{
								invalidID++;
								continue;
							}
						}
						var tmp_question = {
							"type": 2,
							"name": row[0],
							"answers": row[1]
							};
						$scope.contents.push(tmp_question);	
					}
					else
					{
						invalidID++;
					}
				}
				if (invalidID) showAlert('错误', invalidID + ' 项因为格式不对而被忽略');
            });
        }
		
        document.getElementById('xlsx').addEventListener('change', handleFile, false);
		

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