angular
    .module('myApp', [
        'ui.router',
        'ngMaterial',
        'admin',
        'login',
        'student',
        'teacher'
    ])
    .config(function ($urlRouterProvider) {
        $urlRouterProvider.otherwise('/teacher');
    })
    .config(['$sceDelegateProvider', function ($sceDelegateProvider) {
        // Prevent OPTIONS http request.
        $sceDelegateProvider.resourceUrlWhitelist(['self', /^https?:\/\/127\\.0\\.0\\.1/]);
    }]);