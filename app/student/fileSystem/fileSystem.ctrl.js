/**
 * Created by xs on 2017/4/21.
 */
(function () {
    'use strict';
    angular.module('student.fileSystem')
        .controller('studentFileSystem', ctrl);
    function ctrl(studentFileSystemFactory, StudentConstants , $scope, $sce, Account,studentFactory,$state ) {
        console.log('init sh file system');
        function freshData() {
            studentFileSystemFactory.getFiles(function (err, res) {
                console.log('fileSystem fact ', err, res);
                if (err)return Account.showToast('', '获取文件失败');
                if(res.length==0)Account.showToast('', '暂时没有文件');
                $scope.files = res;
            });
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
            studentFactory.setCurrentCourse(course);
            freshData();
        };
        $scope.btnVideo = function () {
            window.open('https://appear.in/' + studentFactory.getCurrentCourse());
        };
        freshData();
        $scope.uploading=false;

        $scope.btnDownloadFile = function (fileID) {
            console.log('btnDownloadFile');
            studentFileSystemFactory.getFile(fileID, function (err, res) {
                if (err)return Account.showToast('err', 'kk')
            })
        };
        $scope.getSrc = function (fileID) {
            return $sce.trustAsResourceUrl(StudentConstants.URL_FILE + fileID + '?token=' + Account.getToken())
        };



    }
})();