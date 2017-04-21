/**
 * Created by xs on 2017/4/21.
 */
(function () {
    'use strict';
    angular.module('teacher.fileSystem')
        .factory('teacherFileSystemFactory', fact);
    function fact($http, TeacherConstants,Account) {
        var self = {};

        self.getFiles = function (callback) {
            $http.get(TeacherConstants.URL_FILES, {
                headers: {'x-token': Account.getToken()}
            }).then(function (res) {
                callback(null, res.data);
            }, function (res) {
                callback(res);
            });
        };
        self.postFile = function (file,name,callback) {
            $http.get(TeacherConstants.URL_FILES, {
                headers: {'x-token': Account.getToken()},
                file:file,
                name:name
            }).then(function (res) {
                callback(null, res.data);
            }, function (res) {
                callback(res);
            });
        };
        self.getFile=function (fileID,callback) {
            //window.open(TeacherConstants.URL_FILE+fileID);
            $http.get(TeacherConstants.URL_FILE+fileID, {
                headers: {'x-token': Account.getToken()}
            }).then(function (res) {
                callback(null, res.data);
            }, function (res) {
                callback(res);
            });
        };
        self.removeFile=function (fileID,callback) {
            $http.get(TeacherConstants.URL_FILE+fileID, {
                headers: {'x-token': Account.getToken()}
            }).then(function (res) {
                callback(null, res.data);
            }, function (res) {
                callback(res);
            });
        };
        return self;
    }
})();
