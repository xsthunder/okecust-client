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
        self.URL_PWD = base + '/account/password';
        self.URL_BASE = AppConstants.URL_BASE;
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

        /* processing array buffers, only required for readAsArrayBuffer */
        function fixdata(data) {
            var o = "", l = 0, w = 10240;
            for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
            o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
            return o;
        }

        var rABS = true; // true: readAsBinaryString ; false: readAsArrayBuffer
        /* set up drag-and-drop event */
        /* fixdata and rABS are defined in the drag and drop example */
        function handleFile(e) {
            var files = e.target.files;
            var i, f;
            if (1 > files.length) {
                return showAlert('cuowu', '请选择一个文件');
            }
            f = files[0];
            var reader = new FileReader();
            var name = f.name;
            reader.onload = function (e) {
                var data = e.target.result;
                var workbook;
                if (rABS) {
                    /* if binary string, read with type 'binary' */
                    workbook = XLSX.read(data, {type: 'binary'});
                } else {
                    /* if array buffer, convert to base64 */
                    var arr = fixdata(data);
                    workbook = XLSX.read(btoa(arr), {type: 'base64'});
                }
                /* DO SOMETHING WITH workbook HERE */
                handleWorkbook(workbook);
            };
            reader.readAsBinaryString(f);
        }

        /**
         * Handle workbook.
         */
        function handleWorkbook(workbook) {
            var sheet_name_list = workbook.SheetNames;
            console.log(sheet_name_list);
            sheet_name_list.forEach(function (y) {
                /* iterate through sheets */
                var worksheet = workbook.Sheets[y];
                var sheetMap = {};
                var sheetArray = [];
                // Head: A1(CampusID) B1(Name)
                // Data: A2           B2
                // Data: A3           B3
                var regex = /(.+?)(\d+)/;
                for (var key in worksheet) {
                    /* all keys that do not begin with "!" correspond to cell addresses */
                    if (key[0] === '!') {
                        continue;
                    }
                    var res = regex.exec(key);
                    if (!res) {
                        return showAlert('cuowu', '无法处理: ' + key);
                    }
                    if (3 !== res.length) {
                        showAlert('cuowu', '格式不对: ' + key);
                        continue;
                    }
                    var keyOfRow = res[1];
                    if (!sheetMap[keyOfRow]) {
                        sheetMap[keyOfRow] = {};
                    }
                    sheetMap[keyOfRow][res[2]] = worksheet[key].v;
                }
                for (var key in sheetMap) {
                    sheetArray.push(sheetMap[key]);
                }
                console.log(sheetArray);
                console.log(sheetArray[0][1]);
                $scope.students = [];
                for (var key in sheetArray[0]) {
                    console.log(key);
                    console.log({
                        id: sheetArray[0][key] + '',
                        name: sheetArray[1][key]
                    });
                    $scope.students.push({
                        id: sheetArray[0][key] + '',
                        name: sheetArray[1][key]
                    });
                }
                console.log($scope.students);
            });
        }

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
        self.showAlert = function (title, message) {
            $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title(title)
                    .textContent(message)
                    .ariaLabel('Alert Dialog Demo')
                    .ok('明白')
            );
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
                    callback(res);
                });
        };
        self.setCredit = function (data) {
            $cookies.put('token', data.token);
            $cookies.put('type', data.type);
            $cookies.put('uid', data.uid);
            $cookies.put('freshTeacherConstantsFlag', 'yes');
            AccountConstants.USER_ID = data.uid;

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
        self.getUrl = function () {
            var type = $cookies.get('type');
            console.log($cookies.get('type') + "type");
            url = AccountConstants.URL_BASE;
            switch (type) {
                case "1":
                    url += '/student-side/';
                    break;
                case "2":
                    url += '/teacher-side/';
                    break;
                default:
                    console.log('unsuupported type in get url ', type);
            }
            url += self.getUid() + '/';
            console.log('url_base', url, type);

            return url;
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
        self.updateProfile = function (newProfile, callback) {
            console.log('updateProfile account', newProfile);
            if (newProfile.uid === self.getUid()) {
                $http.patch(AccountConstants.URL_PROFILE, newProfile, {
                    headers: {'x-token': self.getToken()}
                }).then(function (res) {
                    profile = res.data;
                    callback(null);
                }, function (res) {
                    callback(res);
                })
            }
            else {
                return callback(true);
            }
        };
        self.updatePwd = function (username, newPwd, curPwd, callback) {
            if (username && newPwd && curPwd) {
                newPwd = hash(username, newPwd);
                curPwd = hash(username, curPwd);
                $http.put(AccountConstants.URL_PWD, {
                        password: curPwd,
                        newPassword: newPwd
                    },
                    {
                        headers: {'x-token': self.getToken()}
                    }).then(function (res) {
                    callback(null);
                }, function (res) {
                    callback(res);
                })
            }
            else {
                return callback(profile);
            }
        };
        /**
         * notification goes here for its highly similarity
         */
        function getNotificationURL(courseID) {
            return AccountConstants.URL_NOTIFICATION + '/' + courseID.courseID + 'notifications'
        }


        /**
         * @param url
         * @param notification:{courseID:course._id,name:name,description:descrition}
         * @param callback
         */
        self.newNotification = function (url, notification, callback) {
            $http.post(url, {
                    name: notification.name,
                    description: notification.description
                },
                {headers: {'x-token': self.getToken()}}
            ).then(function (res) {
                console.log('newNOtifcation', res);
                callback(null, res.data);
            }, function (res) {
                callback(res);
            });
        };
        self.listNotifications = function (url, callback) {
            $http.get(
                url,
                {headers: {'x-token': self.getToken()}}
            ).then(function (res) {
                console.log('listnotifcation', res);
                callback(null, res);
            }, function (res) {
                callback(res);
            });
        };
        self.removeNotification = function (url, notification, callback) {
            // url += '/' + notification._id;
            $http.delete(
                url,
                {headers: {'x-token': self.getToken()}})
                .then(function (res) {
                    callback(null, res);
                }, function (res) {
                    callback(res);
                })
        };
        self.updateNotification = function (url, notification, callback) {
            // url += '/' + notification._id;
            $http.patch(
                url,
                {
                    name: notification.name,
                    description: notification.description
                }
                ,
                {headers: {'x-token': self.getToken()}})
                .then(function (res) {
                    callback(null, res);
                }, function (res) {
                    callback(res);
                })
        };
        self.currentNotification = undefined;
        self.setCurrentNotification = function (notification) {
            self.notification = notification;
        };
        self.getCurrentNotification = function () {
            return self.notification ? self.notification : 0;
        };
        return self;
    })
;