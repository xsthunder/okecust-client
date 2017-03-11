/**
 * Created by YY on 2016/11/26.
 */
(function () {
    angular.module('teacher.nameList.add')
        .controller('nameListAddCtrl', ctrl);
    function ctrl($scope, $log,$state, $mdDialog, headerFactory, TeacherCourse, teacherFactory) {
        var showAlert = teacherFactory.showToast;
        $scope.students = [];
        $scope.nameList=[
            {
                id:'' ,
                name:''
            }
        ];

        //TODO remove repeated codes
        function fixdata(data) {
            var o = "", l = 0, w = 10240;
            for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
            o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
            return o;
        }

        var rABS = true; // true: readAsBinaryString ; false: readAsArrayBuffer
        /* set up drag-and-drop event */
        /* fixdata and rABS are defined in the drag and drop example */
        function handleFile(e) {
            var files = e.target.files;
            var i, f;
            if (1 > files.length) {
                return showAlert('cuowu','请选择一个文件');
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
                handleWorkbook(workbook);
            };
            reader.readAsBinaryString(f);
        }

        /**
         * Handle workbook.
         */
        function handleWorkbook(workbook) {
            var sheet_name_list = workbook.SheetNames;
            console.log(sheet_name_list);
            sheet_name_list.forEach(function (y) {
                /* iterate through sheets */
                var worksheet = workbook.Sheets[y];
                var sheetMap = {};
                var sheetArray = [];
                // Head: A1(CampusID) B1(Name)
                // Data: A2           B2
                // Data: A3           B3
                var regex = /(.+?)(\d+)/;
                for (var key in worksheet) {
                    /* all keys that do not begin with "!" correspond to cell addresses */
                    if (key[0] === '!') {
                        continue;
                    }
                    var res = regex.exec(key);
                    if (!res) {
                        return showAlert('cuowu','无法处理: ' + key);
                    }
                    if (3 !== res.length) {
                        showAlert('cuowu','格式不对: ' + key);
                        continue;
                    }
                    var keyOfRow = res[1];
                    if (!sheetMap[keyOfRow]) {
                        sheetMap[keyOfRow] = {};
                    }
                    sheetMap[keyOfRow][res[2]] = worksheet[key].v;
                }
                for (var key in sheetMap) {
                    sheetArray.push(sheetMap[key]);
                }
                console.log(sheetArray);
                console.log(sheetArray[0][1]);
                $scope.students=[];
                for (var key in sheetArray[0]) {
                    console.log(key);
                    console.log({
                        id: sheetArray[0][key]+'',
                        name: sheetArray[1][key]
                    });
                    $scope.students.push({
                        id: sheetArray[0][key]+'',
                        name: sheetArray[1][key]
                    });
                }
                console.log($scope.students);
            });
        }
        document.getElementById('xlsx').addEventListener('change', handleFile, false);

        $log.info('nameListAddCtrl init');
        $scope.submit = function () {
            console.log("init sumit");
            var nameListArr = $scope.nameList.filter(function (each) {
                if(each.id==''||each.name=='')return false;
                else return true;
            });
            console.log(nameListArr);
            nameListArr=nameListArr.concat($scope.students);
            if(nameListArr.length==0)return showAlert('cuowu','没有读取到任何名单数据');
            $log.info(nameListArr);
            TeacherCourse.addStudentsIntoCourse(teacherFactory.getCurrentCourse()._id, nameListArr, function (error, res) {
                $log.info(res);
                if (error) {
                    return showAlert('错误', "添加名单失败,请重试" + error.status);
                }
                showAlert("成功", "成功添加\"" + res.scoresCreated + "\"名学生到\"" + teacherFactory.getCurrentCourse().name + "\"");
                $state.go('teacher.nameList');
            })

        };


    }
})();