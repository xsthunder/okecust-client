/**
 * Created by Fisher at 23:50 on 10/08/2016.
 */
angular.module('teacher.quizModel', [
    'ui.router',
    'account',
    'teacher',
    'teacher.quizModel.detail',
    'teacher.quizModel.post'
]).factory('TeacherQuizModelConstants', function (TeacherConstants) {
    var self = {};
    self.URL_MODELS = TeacherConstants.URL_BASE + '/models';
    self.updateQuizModelId = function (quizModelId) {
        self.URL_MODEL = self.URL_MODELS + '/' + quizModelId;
        self.URL_MODEL_QUESTIONS = self.URL_MODEL + '/questions';
    };
    self.updateQuizModelId('');
    return self;
}).factory('TeacherQuizModel', function ($http, Account, TeacherConstants, TeacherQuizModelConstants) {
    /** @namespace $scope.quizModel._id */
    var self = {};
    var activeQuizModel;
    /**
     * Transfer value between pages.
     * FIXME standardize it.
     * @param quizModel Active quizModel to be edited.
     */
    self.setActiveQuizModel = function (quizModel) {
        activeQuizModel = quizModel;
    };
    self.getActiveQuizModel = function () {
        return activeQuizModel;
    };
    var quizModelList;
    self.flushQuizModelList = function (callback) {
        $http.get(TeacherQuizModelConstants.URL_MODELS, {
            headers: {'x-token': Account.getToken()}
        }).then(function (res) {
            quizModelList = res.data;
            callback(null, quizModelList);
        }, function (res) {
            callback(res);
        });
    };
    /**
     * Get quiz-model list.
     */
    self.getQuizModelList = function (callback) {
        if (quizModelList) {
            return callback(null, quizModelList);
        }
        self.flushQuizModelList(callback);
    };
    self.createNewQuizModel = function (quizModel, callback) {
        $http.post(TeacherQuizModelConstants.URL_MODELS, {
            name: quizModel.name,
            desc: quizModel.desc,
            questions: quizModel.questions
        }, {
            headers: {'x-token': Account.getToken()}
        }).then(function (res) {
            callback(null, res.data);
        }, function (res) {
            callback(res);
        });
    };
    self.updateQuizModel = function (quizModel, callback) {
        TeacherQuizModelConstants.updateQuizModelId(quizModel._id);
        $http.patch(TeacherQuizModelConstants.URL_MODEL, {
            name: quizModel.name,
            desc: quizModel.desc,
            questions: quizModel.questions
        }, {
            headers: {'x-token': Account.getToken()}
        }).then(function (res) {
            callback(null, res.data);
        }, function (res) {
            callback(res);
        });
    };
    self.removeQuizModel = function (quizModelId, callback) {
        TeacherQuizModelConstants.updateQuizModelId(quizModelId);
        $http.delete(TeacherQuizModelConstants.URL_MODEL, {
            headers: {'x-token': Account.getToken()}
        }).then(function (res) {
            callback(null, res.data);
        }, function (res) {
            callback(res);
        });
    };
    return self;
}).config(function ($stateProvider) {
    $stateProvider.state('teacher.quizModel', {
        url: '/quizModel',
        views: {
            'header': {
                templateUrl: 'app/teacher/teacher.header.html',
                controller: 'teacherHeaderCtrl'
            },
            'main': {
                templateUrl: 'app/teacher/quizModel/quizModel.html',
                controller: 'teacherQuizModelsCtrl'
            }
        }
    })
}).controller('teacherQuizModelsCtrl', function ($scope, teacherFactory, TeacherQuizModel) {
    var onListCallback = function (err, quizModels) {
        if (err) {return alert('Error getting quizModels list.');}
        $scope.quizModels = quizModels;
    };
    TeacherQuizModel.getQuizModelList(onListCallback);
    $scope.btnViewQuizModel = function (quizModel) {
        TeacherQuizModel.setActiveQuizModel(quizModel);
    };
    $scope.btnTargetNewQuizModel = function () {
        TeacherQuizModel.setActiveQuizModel({name: ''});
    };
    $scope.btnUpdateQuizModel = function (quizModel) {
        TeacherQuizModel.setActiveQuizModel(quizModel);
    };
    $scope.btnRemoveQuizModel = function (quizModel) {
        var confirmed = confirm('Remove this quizModel?');
        if (confirmed) {
            TeacherQuizModel.removeQuizModel(quizModel._id, function (err, quizModel) {
                if (err) {return alert('failed to delete quizModel: ' + err.data);}
                TeacherQuizModel.flushQuizModelList(onListCallback);
                alert('QuizModel deleted!');
            });
        }
    };
});