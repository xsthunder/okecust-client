/**
 * Created by xs on 2017/4/21.
 */
(function () {
    'use strict';
    angular.module('student.fileSystem')
        .factory('studentFileSystemFactory', fact);
    function fact($http, Account,StudentConstants) {
        var self = {};

        self.getFiles = function (callback) {

            $http.get(StudentConstants.URL_FILES, {
                headers: {'x-token': Account.getToken()}
            }).then(function (res) {
                callback(null, res.data);
            }, function (res) {
                callback(res);
            });
        };
        self.getFile = function (fileID, callback) {
            window.open(StudentConstants.URL_FILE + fileID + '?token=' + Account.getToken());
            // $http.get(TeacherConstants.URL_FILE+fileID, {
            //     headers: {'x-token': Account.getToken()}
            // }).then(function (res) {
            //     callback(null, res.data);
            // }, function (res) {
            //     callback(res);
            // });
        };
        return self;
    }
})();
