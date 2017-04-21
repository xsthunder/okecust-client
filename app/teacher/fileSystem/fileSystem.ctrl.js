/**
 * Created by xs on 2017/4/21.
 */
(function () {
    'use strict';
    angular.module('teacher.fileSystem')
        .controller('teacherFileSystem',ctrl);
    function ctrl (teacherFileSystemFactory,$scope,Account) {
        console.log('init teacher file system');
        teacherFileSystemFactory.getFiles(function (err,res) {
            console.log('fileSystem fact ',err,res);
            if(err)return Account.showToast('','err getting files');
            $scope.files=res;
        });
        $scope.btnRemoveFile=function (fileID) {
            console.log('btnRemoveFile');
            teacherFileSystemFactory.removeFile(fileID,function (err,res) {
                if(err)return Account.showToast('','err deleting file');
                Account.showToast('','succeeded in deleting '+res);
            })
        };
        $scope.btnPlayFile=function (fileID) {
            console.log('btnDownloadFile');
            teacherFileSystemFactory.getFile(fileID,function (err,res) {
                if(err)return Account.showToast('err','kk')
            })
        };
        $scope.btnDownloadFile=function (fileID) {
            console.log('btnDownloadFile');
            teacherFileSystemFactory.getFile(fileID,function (err,res) {
                if(err)return Account.showToast('err','kk')
            })
        }
    }
})();