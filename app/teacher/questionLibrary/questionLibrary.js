/**
 * Created by Fisher at 23:50 on 10/08/2016.
 */
angular.module('teacher.questionLibrary', [
    'ui.router',
    'account',
    'teacher',
    'teacher.questionLibrary.detail',
    'teacher.questionLibrary.post'
]).factory('TeacherQuestionLibraryConstants', function (TeacherConstants) {
    var self = {};
    self.URL_LIBRARIES = TeacherConstants.URL_BASE + '/libraries';
    self.updateQuestionLibraryId = function (questionLibraryId) {
        self.URL_LIBRARY = self.URL_LIBRARIES + '/' + questionLibraryId;
        self.URL_LIBRARY_QUESTIONS = self.URL_LIBRARY + '/questions';
    };
    self.updateQuestionLibraryId('');
    return self;
}).factory('TeacherQuestionLibrary', function ($http, Account, TeacherConstants, TeacherQuestionLibraryConstants) {
    /** @namespace $scope.questionLibrary._id */
    var self = {};
    var activeQuestionLibrary;
    /**
     * Transfer value between pages.
     * FIXME standardize it.
     * @param questionLibrary Active questionLibrary to be edited.
     */
    self.setActiveQuestionLibrary = function (questionLibrary) {
        activeQuestionLibrary = questionLibrary;
    };
    self.getActiveQuestionLibrary = function () {
        return activeQuestionLibrary;
    };
    var questionLibraryList;
    self.flushQuestionLibraryList = function (callback) {
        $http.get(TeacherQuestionLibraryConstants.URL_LIBRARIES, {
            headers: {'x-token': Account.getToken()}
        }).then(function (res) {
            questionLibraryList = res.data;
            callback(null, questionLibraryList);
        }, function (res) {
            callback(res);
        });
    };
    /**
     * Get question-library list.
     */
    self.getQuestionLibraryList = function (callback) {
        if (questionLibraryList) {
            return callback(null, questionLibraryList);
        }
        self.flushQuestionLibraryList(callback);
    };
    self.createNewQuestionLibrary = function (questionLibrary, callback) {
        $http.post(TeacherQuestionLibraryConstants.URL_LIBRARY, {
            name: questionLibrary.name,
            desc: questionLibrary.desc
        }, {
            headers: {'x-token': Account.getToken()}
        }).then(function (res) {
            callback(null, res.data);
        }, function (res) {
            callback(res);
        });
    };
    /**
     * Update a question library;
     *
     * @param questionLibrary Question Library Object.
     * @param callback Callback
     *
     * QuestionLibrary Object looks like:
     {
        "name": "线性代数-第二章",
        "description": "第二章 习题库 :)",
       "questions": [
    	    "58207e9ad3a9869000a3d87c",
    	    "58207f36d3a9869000a3d87d",
    	    "58242ea337b9e4d0033335ce"
        ]
     }
     */
    self.updateQuestionLibrary = function (questionLibrary, callback) {
        TeacherQuestionLibraryConstants.updateQuestionLibraryId(questionLibrary._id);
        $http.patch(TeacherQuestionLibraryConstants.URL_LIBRARY, {
            name: questionLibrary.name,
            desc: questionLibrary.desc
        }, {
            headers: {'x-token': Account.getToken()}
        }).then(function (res) {
            callback(null, res.data);
        }, function (res) {
            callback(res);
        });
    };
    self.removeQuestionLibrary = function (questionLibraryId, callback) {
        TeacherQuestionLibraryConstants.updateQuestionLibraryId(questionLibraryId);
        $http.delete(TeacherQuestionLibraryConstants.URL_LIBRARY, {
            headers: {'x-token': Account.getToken()}
        }).then(function (res) {
            callback(null, res.data);
        }, function (res) {
            callback(res);
        });
    };
    return self;
}).config(function ($stateProvider) {
    $stateProvider.state('teacher.questionLibrary', {
        url: '/questionLibrary',
        views: {
            'header': {
                templateUrl: 'app/teacher/teacher.header.html',
                controller: 'teacherHeaderCtrl'
            },
            'main': {
                templateUrl: 'app/teacher/questionLibrary/questionLibrary.html',
                controller: 'teacherQuestionQuestionLibrariesCtrl'
            }
        }
    })
}).controller('teacherQuestionQuestionLibrariesCtrl', function ($scope, teacherFactory, TeacherQuestionLibrary) {
    var onListCallback = function (err, questionLibraries) {
        if (err) {return alert('Error getting questionLibraries list.');}
        $scope.questionLibraries = questionLibraries;
    };
    TeacherQuestionLibrary.getQuestionLibraryList(onListCallback);
    $scope.btnViewQuestionLibrary = function (questionLibrary) {
        TeacherQuestionLibrary.setActiveQuestionLibrary(questionLibrary);
    };
    $scope.btnTargetNewQuestionLibrary = function () {
        TeacherQuestionLibrary.setActiveQuestionLibrary({name: ''});
    };
    $scope.btnUpdateQuestionLibrary = function (questionLibrary) {
        TeacherQuestionLibrary.setActiveQuestionLibrary(questionLibrary);
    };
    $scope.btnRemoveQuestionLibrary = function (questionLibrary) {
        var confirmed = confirm('Remove this questionLibrary?');
        if (confirmed) {
            TeacherQuestionLibrary.removeQuestionLibrary(questionLibrary._id, function (err, questionLibrary) {
                if (err) {return alert('failed to delete questionLibrary: ' + err.data);}
                TeacherQuestionLibrary.flushQuestionLibraryList(onListCallback);
                alert('QuestionLibrary deleted!');
            });
        }
    };
});