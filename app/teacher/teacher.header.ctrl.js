/**
 * Created by YY on 2016/11/12.
 */
(function () {
    angular.module('teacher')
        .factory('TeacherHeaderFactory', function () {
            var self = {};
            self.mOnSelected = null;
            /**
             * Set on selected listener.
             * @param callback{Function} Called when the head value changed.
             */
            self.setOnSelectedListener = function (callback) {
                self.mOnSelected = callback;
            };
            /**
             * Private method called only in header controller.
             */
            self.onSelect = function () {
                if (self.mOnSelected) {
                    self.mOnSelected();
                }
            };
            return self;
        })
        .controller('teacherHeaderCtrl', function ($scope, $mdDialog, Account, $location, teacherFactory, TeacherHeaderFactory, $log) {
                self.freshData = function () {

                    teacherFactory.getCourseList(function (err, courses) {

                        if (err) {
                            if (err.status == 400) {
                                return showAlert("登录信息有误请尝试刷新，或重新登录");
                            }
                            console.log(err);
                            return showAlert("无法获取课程列表，请刷新重试");
                        }
                        $scope.courses = courses;
                        console.log("已经获取菜单中，获取课程列表");
                        console.log(courses);
                    });
                };
                self.freshData();

                var showAlert = function (title, message) {
                    // Appending dialog to document.body to cover sidenav in docs app
                    // Modal dialogs should fully cover application
                    // to prevent interaction outside of dialog
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
                var empty_course = 1;
                var old_course;

                $scope.selectedCourse = teacherFactory.getCurrentCourse();
                $scope.$watch('selectedCourse', function (newValue) {
                    teacherFactory.setCurrentCourse(newValue);
                    if (empty_course === 1) {
                        //location.reload();
                        empty_course = newValue;//init empty_course
                    }
                    if (newValue !== empty_course) {
                        if (newValue !== old_course) {
                            old_course = newValue;
                            TeacherHeaderFactory.onSelect();
                            // location.reload();
                        }
                    }
                });
            }
        );
})();