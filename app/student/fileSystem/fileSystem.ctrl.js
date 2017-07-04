/**
 * Created by xs on 2017/4/21.
 */
(function () {
    'use strict';
    angular.module('student.fileSystem')
        .controller('studentFileSystem', ctrl);
    function ctrl(studentFileSystemFactory,$mdDialog, $http, StudentConstants, $scope, $sce, Account, studentFactory, $state) {
        $scope.uid=Account.getUid();
        var showAlert=Account.showToast;
        function freshData() {
            studentFileSystemFactory.getFiles(function (err, res) {
                console.log('fileSystem fact ', err, res);
                if (err)return Account.showToast('', '获取文件失败');
                if (res.length == 0) Account.showToast('', '暂时没有文件');
                $scope.files = res;
            });
            studentFileSystemFactory.getFiles(function (err, res) {
                console.log('fileSystem fact ', err, res);
                if (err)return Account.showToast('', '获取文件失败');
                if (res.length == 0) Account.showToast('', '暂时没有文件');
                $scope.studentfiles = res;
            }, Account.getUid());
        }

        $scope.courseSelected = studentFactory.getCurrentCourseName();
        $scope.backToClass = function () {
            $state.go('student.class');
        };
        studentFactory.getCourseList(function (err, list) {
            if (err == null) {
                $scope.courseList = list;
                // if($scope.courseList[0] != null) {
                //   var id = $scope.courseList[0]._id;
                //   studentFactory.setCurrentCourse(id);
                // }
            }
            else Account.showToast('错误', '无法获得课程列表');
        });
        $scope.switchCourse = function (course) {
            studentFactory.setCurrentCourse(course._id);
            $scope.courseSelected=course;
            freshData();
        };
        $scope.btnVideo = function () {
            window.open('https://appear.in/' + studentFactory.getCurrentCourse());
        };
        freshData();
        $scope.uploading = false;

        $scope.btnDownloadFile = function (fileID,author) {
            studentFileSystemFactory.getFile(fileID,author);
        };
        var getUrl = studentFileSystemFactory.getUrl;
        $scope.getSrc = function (fileID, author) {
            return $sce.trustAsResourceUrl(getUrl(fileID, author));
        };
        document.getElementById("file").addEventListener('change',
            function (e) {
                var files = e.target.files;
                var file = files[0];
                console.log(file);
                var fd = new FormData();
                fd.append('file', file);
                fd.append('name', file.name);
                $http({
                    method: 'POST',
                    url: StudentConstants.URL_FILES,
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

                        return Account.showToast('', '文件上传失败');

                    });
                // teacherFileSystemFactory.postFile(file, function (err, res) {
                //     if (err)return Account.showToast('', '文件' + '上传失败');
                //     else return Account.showToast('', '文件' + res.name + '上传成功');
                // });


                console.log(e);
            }
        );
        $scope.btnRemoveFile = function (file) {
            var confirm = $mdDialog.confirm()
                .title('删除一个文件')
                .textContent('文件名:' + file.name )
                .ariaLabel('Lucky day')
                .ok('确定')
                .cancel('取消');

            $mdDialog.show(confirm).then(function () {
                studentFileSystemFactory.removeFile(file.fileID, function (err, res) {
                    if (err)return Account.showToast('', '删除文件失败');
                    Account.showToast('', '删除文件成功' + res.name);
                    freshData();
                });
            }, function () {
            });

        };

    }
})();