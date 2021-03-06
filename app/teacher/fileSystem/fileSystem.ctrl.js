/**
 * Created by xs on 2017/4/21.
 */
(function () {
    'use strict';
    angular.module('teacher.fileSystem')
        .controller('teacherFileSystem', ctrl);
    function ctrl(teacherFileSystemFactory, TeacherCourse, $log, TeacherConstants, teacherFactory, $scope, $sce, $http, Account, $mdDialog, TeacherHeaderFactory) {
        console.log('init teacher file system');
        var showToast = Account.showToast;
        var btnFetchFileByUid = function (uid, $index) {
            if ($scope.students[$index].fetchFlag) {
                $scope.students[$index].fetchFlag = false;
                $scope.studentsFiles[$index] = [];
            }
            else teacherFileSystemFactory.getFiles(function (err, res) {
                console.log('fileSystem fact ', err, res);
                if (err)return Account.showToast('', '获取文件失败');
                if (res.length == 0) Account.showToast('', '暂时没有文件');
                $scope.studentsFiles[$index] = res;
                $scope.students[$index].fetchFlag = true;

            }, uid);
        };
        $scope.btnFetchFileByUid = btnFetchFileByUid;
        var getNameList = function () {
			$scope.students=[];
            TeacherCourse.getCourseStudents(teacherFactory.getCurrentCourse()._id, function (error, res) {
                if (error) {
                    console.log(teacherFactory.getCurrentCourse()._id);
                    if (teacherFactory.getCurrentCourse()._id !== undefined || teacherFactory.getCurrentCourse()._id === 0) {
                        $scope.showFab = true;
                        return showAlert("失败", "获取名单失败，可以尝试刷新");
                    }
                }
                $log.info(res);
                $scope.students = res;
                $scope.studentsFiles = [];
				for(var i = 0;i<res.length;i++)$scope.studentsFiles.push(new Array());
                $scope.showFab = false;

                if (res.length == 0) {
                    $scope.showFab = false;
                    return showAlert('', '本课程名单为空');
                }

                if (res === undefined) {
                    showAlert('', '读取名单数据失败，请重试');
                    $scope.showFab = true;
                }
            });
        };
        getNameList();
        function freshData() {
			
			getNameList();
			$scope.files = [];
            teacherFileSystemFactory.getFiles(function (err, res) {
                console.log('fileSystem fact ', err, res);
                if (err)return Account.showToast('', '获取文件失败');
                if (res.length == 0) Account.showToast('', '暂时没有文件');
                $scope.files = res;
            });
        }

        freshData();
        TeacherHeaderFactory.setOnSelectedListener(freshData);
        $scope.btnVideo = function () {
            window.open('https://appear.in/' + teacherFactory.getCurrentCourse()._id);
        };
        $scope.uploading = false;
        $scope.btnRemoveFile = function (file) {
            var confirm = $mdDialog.confirm()
                .title('删除一个文件')
                .textContent('文件名:' + file.name)
                .ariaLabel('Lucky day')
                .ok('确定')
                .cancel('取消');

            $mdDialog.show(confirm).then(function () {
                teacherFileSystemFactory.removeFile(file.fileID, function (err, res) {
                    if (err)return Account.showToast('', '删除文件失败');
                    Account.showToast('', '删除文件成功' + res.name);
                    freshData();
                });
            }, function () {
            });

        };

        $scope.btnDownloadFile = function (fileID, author) {
            console.log('btnDownloadFile');
            teacherFileSystemFactory.getFile(fileID, author);
        };
        $scope.getSrc = function (fileID, author) {
            return $sce.trustAsResourceUrl(teacherFileSystemFactory.getUrl(fileID, author))
        };
        $scope.showbtnPack = true;
        $scope.btnPack = function () {
            $scope.showbtnPack = false;
            showToast('', '请求服务器打包,请耐心等候');
            teacherFileSystemFactory.pack(function (err, res) {
                if (err)return showToast('', '生成失败');
                $scope.files.concat(res);
                freshData();
                var date = (new Date(res[0].createdTime));
                showToast('', '打包成功' + ',在我的文件列表 ' + date.toLocaleTimeString());
                $scope.showbtnPack = true;
            })
        };
        document.getElementById("file").addEventListener('change',
            function (e) {
                $scope.uploading = true;

                var files = e.target.files;
                var file = files[0];
                console.log(file);
                var fd = new FormData();
                fd.append('file', file);
                fd.append('name', file.name);
                $http({
                    method: 'POST',
                    url: TeacherConstants.URL_FILES,
                    data: fd,
                    headers: {
                        'x-token': Account.getToken(),
                        'Content-Type': undefined
                    },
                    transformRequest: angular.identity
                })
                    .then(function (res) {

                        freshData();
                        $scope.uploading = false;

                        return Account.showToast('', '文件上传成功');
                    }, function (res) {
                        $scope.uploading = false;
                        switch(res.status)
                        {
                            case 409:
                                return Account.showToast('', '文件已存在');
                                break;
                            default:
                                return Account.showToast('', '文件上传失败');
                        }
                    });
                // teacherFileSystemFactory.postFile(file, function (err, res) {
                //     if (err)return Account.showToast('', '文件' + '上传失败');
                //     else return Account.showToast('', '文件' + res.name + '上传成功');
                // });


                console.log(e);
            }
        );

    }
})();