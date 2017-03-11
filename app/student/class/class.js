/**
 * Created by YY on 7/22/2016.
 */
angular.module('student.class', ['ui.router'])
    .config(function ($stateProvider) {
        $stateProvider.state('student.class', {
            url: '/class',
            templateUrl: 'app/student/class/class.html',
            controller: 'classCtrl'
        })
    })
    .controller('classCtrl', function ($scope,$mdBottomSheet, $log, $state, Account, studentFactory) {
        studentFactory.getCourseList(function (err, list) {
            if (err == null) {
                $scope.courseList = list;
            }
            else Account.showlert('错误', '无法获得课程列表');
        });
        var setCourse = function (course) {
            studentFactory.setCurrentCourseName(course.name);
            studentFactory.setCurrentCourse(course._id);
        };
        $scope.btnExam = function (course) {
            console.log('btnExam');
            console.log(course);
            setCourse(course);
            $state.go('student.qa');
        };
        $scope.logout = function () {
            console.log('要推出了');
            Account.deleteCredit();
            $state.go('login');
        };
        $scope.updatePwd = function () {
            $state.go('student.accountUpdate');
        };
        $scope.btnNotification=function (course) {
            $mdBottomSheet.show({
                templateUrl: 'app/student/class/class.notifications.html',
                controller: function ($scope,Account) {
                    $scope.course=course;
                    function getUrl(notificationID) {
                        var url = Account.getUrl();
                        url += 'courses/' + course._id + '/notifications';
                        if (notificationID) url += '/' + notificationID;
                        return url;
                    }
                    Account.listNotifications(getUrl(),function (err,res) {
                        if(err)return Account.showToast('','获取通知列表失败');
                        $scope.notifications=res.data;
                        if($scope.notifications.length==0)return Account.showToast('meiyou','暂时还没有通知');
                    });
                    $scope.showNotification=function (item) {
                        Account.showAlert(item.name,item.description+' on '+new Date((item.createdTime)).toLocaleDateString());
                    };
                    console.log('hello bottom sheet');
                }
            }).then(function(clickedItem) {
            });
        };
        $scope.btnInfo=function (course) {
                $mdBottomSheet.show({
                    templateUrl: 'app/student/class/class.info.html',
                    controller: function ($scope,Account,studentFactory) {
                        course.tel='';
                        course.email='';
                        $scope.course=course;
                        studentFactory.getTeacherProfile(course._id,function (err,data) {
                            if(err)return Account.showToast('','获取作者信息失败');
                            else {
                                console.log('profile',data);
                                $scope.profile=data;
                            }
                        });
                        console.log('hello bottom sheet');
                    }
                }).then(function(clickedItem) {
                });
        }
    });
   
