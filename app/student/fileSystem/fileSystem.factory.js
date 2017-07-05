/**
 * Created by xs on 2017/4/21.
 */
(function () {
    'use strict';
    angular.module('student.fileSystem')
        .factory('studentFileSystemFactory', fact);
    function fact($http, Account, StudentConstants) {
        var self = {};

        self.getFiles = function (callback, author) {
            console.log('author',author);
            $http.get(StudentConstants.URL_FILES, {
                headers: {
                    'x-token': Account.getToken(),
                    'author':author
                }
            }).then(function (res) {
                callback(null, res.data);
            }, function (res) {
                callback(res);
            });
        };
        self.getUrl = function (fileID ,author) {
            var url =StudentConstants.URL_FILE + fileID + '?token=' + Account.getToken();
            if(author)url+='&author='+author;
            // console.log('url',url);
            return url;
        };
        self.getFile = function (fileID, author) {
            console.log(fileID,author,self.getUrl(fileID,author));
            window.open(self.getUrl(fileID,author));
            // $http.get(TeacherConstants.URL_FILE+fileID, {
            //     headers: {'x-token': Account.getToken()}
            // }).then(function (res) {
            //     callback(null, res.data);
            // }, function (res) {
            //     callback(res);
            // });
        };
        self.removeFile = function (fileID, callback) {
            $http.delete(StudentConstants.URL_FILE + fileID, {
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
