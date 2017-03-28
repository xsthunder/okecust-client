angular.module('admin.teacherOpt', ['ui.router'])
    .config(function ($stateProvider) {
        $stateProvider.state('admin.teacherOpt', {
            url: '/teacherOpt',
            templateUrl: 'app/admin/teacherOpt/teacherOpt.html',
            controller: 'AdminTeacherCtrl'
        })
    })
    .factory('AdminTeacher', function ($http, AdminConstants, Account) {
        var factory = {};
        var teacherList;
        // factory.addTeachers=function (teachers) {
        //     factory.teacherList.push(teachers);
        // };
        factory.createTeachers = function (teachers, callback) {
            $http.post(AdminConstants.URL_TEACHERS, teachers,
                {
                    headers: {'x-token': Account.getToken()}
                }).then(function (res) {
                callback(null, res.data);
            }, function (res) {
                callback(res);
            });
        }
        factory.getTeacherList = function (callback) {
            // if (teacherList) {
            //     return callback(null, teacherList);
            // }
            $http.get(AdminConstants.URL_TEACHERS, {
                headers: {'x-token': Account.getToken()}
            }).then(function (res) {
                teacherList = res.data;
                callback(null, teacherList);
            }, function (res) {
                callback(res);
            });
        };
        // factory.createTeacher = function (uid, name, password, callback) {
        //     $http.post(AdminConstants.URL_TEACHERS, {
        //         uid: uid,
        //         name: name,
        //         password: Account.hash(uid, password)
        //     }, {
        //         headers: {'x-token': Account.getToken()}
        //     }).then(function (res) {
        //         callback(null, res.data);
        //     }, function (res) {
        //         callback(res);
        //     });
        // };
        return factory;
    })
    .controller('AdminTeacherCtrl', function (Account, $scope, AdminTeacher) {
        $scope.userName = '';
        $scope.userId = '';
        $scope.password = '';
        $scope.confirmPw = '';
        $scope.NewTeachers = new Array();

        var flushData = function () {
            AdminTeacher.getTeacherList(function (err, teachers) {
                if (err) {
                    return Account.showToast('错误', err.data);
                }
                $scope.teachers = teachers;
            });
        };
        flushData();
        //TODO remove repeated codes
        /* processing array buffers, only required for readAsArrayBuffer */
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
                    try {
                        workbook = XLSX.read(data, {type: 'binary'});
                    }
                    catch (err) {
                        Account.showToast('', '无法处理数据');
                        return;
                    }
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
                        return showAlert('cuowu', '无法处理: ' + key);
                    }
                    if (3 !== res.length) {
                        showAlert('cuowu', '格式不对: ' + key);
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
                $scope.NewTeachers = new Array();
                for (var key in sheetArray[0]) {
                    console.log(key);
                    console.log({
                        uid: sheetArray[0][key] + '',
                        name: sheetArray[1][key]
                    });
                    $scope.NewTeachers.push({
                        uid: sheetArray[0][key] + '',
                        name: sheetArray[1][key]
                    });
                }
                console.log($scope.NewTeachers);
            });
        }

        document.getElementById('xlsx').addEventListener('change', handleFile, false);
        $scope.createStd = function () {
            if ($scope.userName) {
                $scope.NewTeachers.push({
                    uid: $scope.userId,
                    name: $scope.userName
                });
            }
            console.log($scope.NewTeachers);
            if ($scope.NewTeachers && $scope.NewTeachers.length) {
                console.log('newTEachers', $scope.NewTeachers)
                AdminTeacher.createTeachers($scope.NewTeachers, function (err, teacher) {
                    if (err) {
                        return Account.showToast('错误', 'Failed to add teacher: ' + err.status + '(' + err.data + ')');
                    }
                    Account.showToast('成功', '添加' + teacher.created.length + '位老师，已存在' + teacher.existed.length + '位老师');
                    // AdminTeacher.addTeachers(teacher.created);
                    $scope.NewTeachers = new Array();
                    $scope.userName = '';
                    $scope.userId = '';
                    $scope.password = '';
                    $scope.confirmPw = '';
                    flushData();
                });
            }
            else return Account.showToast('', '没有读取到任何数据');

            // AdminTeacher.createTeacher($scope.userId, $scope.userName, $scope.password, function (err, teacher) {
            //     if (err) {
            //         return Account.showToast('错误', 'Failed to add teacher: ' + err.status + '(' + err.data + ')');
            //     }
            //     $scope.teachers.push(teacher);
            //     Account.showToast('成功', 'Added teacher ' + $scope.userName + ' with uid: ' + $scope.userId);
            //     flushData();
            //     $scope.userName = '';
            //     $scope.userId = '';
            //     $scope.password = '';
            //     $scope.confirmPw = '';
            // });
        }
    });