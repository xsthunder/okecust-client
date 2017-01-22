/**
 * Created by YY on 2016/9/9.
 */
angular.module('account', ['helper', 'angular-md5', 'ngCookies'])
    .factory('AccountConstants', function (AppConstants) {
        var self = {};
        self.USER_ID = 'whatever';
        var base = AppConstants.URL_BASE + '/account-secure/' + self.USER_ID;
        self.URL_TOKENS = base + '/tokens';
        self.URL_PROFILE = base + '/profile';
        return self;
    })
    .factory('Account', function ($http, $cookies, md5,AccountConstants) {
        var self = {};
        var hash = self.hash = function (uid, password) {
            return md5.createHash('hash-it-happily-' + uid + '$' + password);
        };
        self.login = function (username, password, callback) {
            password = hash(username, password);
            $http
                .post(AccountConstants.URL_TOKENS, {
                    uid: username,
                    password: password
                })
                .then(function (res) {
                    console.log("account.js uid=" + res.data.uid);
                    $cookies.put('uid', res.data.uid);
                    callback(null, res.data);
                }, function (res) {
                    callback(true, res);
                });
        };
        self.setCredit = function (data) {
            $cookies.put('token', data.token);
            $cookies.put('type', data.type);
            $cookies.put('uid', data.type);
            $cookies.put('freshTeacherConstantsFlag','yes');

        };
        self.getFreshTeacherConstantsFlag=function () {
             if($cookies.get('freshTeacherConstantsFlag')===undefined||
                 $cookies.get('freshTeacherConstantsFlag')==='yes'){
                 $cookies.put('freshTeacherConstantsFlag','no');
                 return  true;
             }
             else return false;
        };
        self.checkCredit = function (type) {
            return $cookies.get('type') == type;
        };
        self.deleteCredit = function () {
            $cookies.put('token', '');
            $cookies.put('type', '');
            $cookies.put('uid', '');
            $cookies.put('freshTeacherConstantsFlag','yes');
            $cookies.putObject('currentCourse', function () {
                _id = 0;
            })
        };
        self.getToken = function () {
            return $cookies.get('token') ? $cookies.get('token') : '';
        };
        self.getUid = function () {
            console.log($cookies.get('uid') + "uid");
            if (!$cookies.get('uid')) location.reload();
            return $cookies.get('uid');
        };
        var profile;
        self.getProfile = function (callback) {
            if(profile===undefined||profile.uid!==self.getUid()){
                $http.get(AccountConstants.URL_PROFILE, {
                    headers: {'x-token': self.getToken()}
                }).then(function (res) {
                    profile = res.data;
                    $cookies.put('uid', profile.uid);
                    callback(null, profile);
                }, function (res) {
                    callback(res);
                })
            }
            else{
                return callback(null, profile);
            }
        };
        return self;
    });