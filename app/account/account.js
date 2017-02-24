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
    .factory('Account', function ($http, $cookies, $mdDialog, $mdToast, md5, AccountConstants) {
        var self = {};

        var last = {
            bottom: true,
            top: false,
            left: true,
            right: false
        };
        var toastPosition = angular.extend({}, last);
        var getToastPosition = function () {
            sanitizePosition();

            return Object.keys(toastPosition)
                .filter(function (pos) {
                    return toastPosition[pos];
                })
                .join(' ');
        };

        function sanitizePosition() {
            var current = toastPosition;

            if (current.bottom && last.top) current.top = false;
            if (current.top && last.bottom) current.bottom = false;
            if (current.right && last.left) current.left = false;
            if (current.left && last.right) current.right = false;

            last = angular.extend({}, current);
        }

        self.showToast = function (title, message) {

            console.log($mdToast.simple()
                );
            $mdToast.show(
                $mdToast.simple()
                    .textContent(message)
                    .position(getToastPosition())
                    .hideDelay(3000)
            );
        };


        var hash = self.hash = function (uid, password) {
            return md5.createHash('hash-it-happily-' + uid + '$' + password);
        };
        self.showAlert = self.showToast;

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
            $cookies.put('uid', data.uid);
            $cookies.put('freshTeacherConstantsFlag', 'yes');

        };
        self.getFreshTeacherConstantsFlag = function () {
            if ($cookies.get('freshTeacherConstantsFlag') === undefined ||
                $cookies.get('freshTeacherConstantsFlag') === 'yes') {
                $cookies.put('freshTeacherConstantsFlag', 'no');
                return true;
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
            $cookies.put('freshTeacherConstantsFlag', 'yes');
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
            if (profile === undefined || profile.uid !== self.getUid()) {
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
            else {
                return callback(null, profile);
            }
        };
        return self;
    });