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
                if(self.mOnSelected){
                    self.mOnSelected();
                }
            };
            return self;
        })
        .controller('teacherHeaderCtrl', function ($scope, teacherFactory, TeacherHeaderFactory, $log) {
            teacherFactory.getCourseList(function (err, courses) {
                $scope.courses = courses;
            });
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
        });
})();