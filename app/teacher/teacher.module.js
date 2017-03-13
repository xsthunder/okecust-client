/**
 * Created by YY on 2016/9/4.
 */
(function () {
    angular.module('teacher', [
        'layout.header',
        'account',
        'ui.router',
        'ngMaterial',
        'ngAria',
        'teacher.doc',
        'teacher.person',
        'teacher.qa',
        'teacher.class',
        'teacher.course.detail',
        'teacher.course.post',
        'teacher.nameList',
        'teacher.qa.addQa',
        'teacher.exam',
        'teacher.questionLibrary',
        'teacher.questionLibrary.detail',
        'teacher.questionLibrary.post',
        'account.update',
        'account.notification',
        'teacher.analyseStudents'
    ]);
})();