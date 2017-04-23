(function () {
    'use strict';
    angular.module('student.fileSystem',[
        'ui.router',
        'account',
        'student'
        ]).config(function ($stateProvider) {
        $stateProvider.state('student.fileSystem', {
            url: '/fileSystem',
            templateUrl: 'app/student/fileSystem/fileSystem.html',
            controller: 'studentFileSystem'
        })
    })
})();