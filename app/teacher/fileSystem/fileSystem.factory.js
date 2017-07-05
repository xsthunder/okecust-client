/**
 * Created by xs on 2017/4/21.
 */
(function () {
    'use strict';
    angular.module('teacher.fileSystem')
        .factory('teacherFileSystemFactory', fact);
    function fact($http, TeacherConstants, Account, TeacherCourse, teacherFactory) {
        var self = {};
        self.getFiles = function (callback, uid) {
            TeacherConstants.freshTeacherConstant();
            $http.get(TeacherConstants.URL_FILES, {
                headers: {
                    'x-token': Account.getToken(),
                    'author':uid
                }
            }).then(function (res) {
                callback(null, res.data);
            }, function (res) {
                callback(res);
            });
        };
        self.postFile = function (file, callback) {
            console.log('in postfile file:', file);
            $http.post(TeacherConstants.URL_FILES,
                {
                    headers: {
                        'x-token': Account.getToken(),
                        'Content-Type': undefined
                    },

                    transformRequest: function (data) {
                        var formData = new FormData();
                        formData.append("name", file.name);
                        formData.append("file", file);
                        return formData;
                    },
                    data: {
                        file: file
                    }
                }
            ).then(function (res) {
                callback(null, res.data);
            }, function (res) {
                callback(res);
            });
        };
        self.getUrl = function (fileID ,author) {
            var url =TeacherConstants.URL_FILE + fileID + '?token=' + Account.getToken();
            if(author)url+='&author='+author;
            console.log('url',url);
            return url;
        };
        self.getFile = function (fileID, author) {
            window.open(self.getUrl(fileID,author));
        };
        self.removeFile = function (fileID, callback) {
            $http.delete(TeacherConstants.URL_FILE + fileID, {
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
