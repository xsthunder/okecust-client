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
        .controller('teacherHeaderCtrl', function ($scope, teacherFactory, TeacherHeaderFactory, $log) {
                self.freshData = function () {

                    teacherFactory.getCourseList(function (err, courses) {
                        if(err)return alert("无法获取课程列表");
                        $scope.courses = courses;
                        console.log("已经获取菜单中，获取课程列表")
                        console.log(courses);
                    });
                };


                $scope.$on("Ctr1NameChangeFromParrent",

                    function (event, msg) {
                        console.log("childCtr2", msg);
                        $scope.ctr1Name = msg;
                        self.freshData();
                    });
                $scope.$on("Ctr1NameRemoveFromParrent",

                    function (event, msg) {
                        console.log("childCtr2,remove", msg);
                        $scope.ctr1Name = msg;
                        self.freshData();
                    });
                $scope.$on("Ctr1NameAddFromParrent",

                    function (event, msg) {
                        console.log("childCtr2,add", msg);
                        $scope.ctr1Name = msg;
                        self.freshData();
                    });


                self.freshData();

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